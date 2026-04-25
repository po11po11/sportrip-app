import { Pressable, Text, View } from 'react-native'
import { WebShell } from '@/components/web/web-shell'
import { Card } from '@/components/ui/card'
import { Screen } from '@/components/common/screen'
import { useResponsive } from '@/lib/hooks/use-responsive'

const metrics = [
  { label: 'GMV', value: 'NT$ 8.5K', trend: '+12.5% ↑' },
  { label: '可提現收益', value: 'NT$ 3.2K', trend: '+8.3% ↑' },
  { label: '本月活動', value: '15', trend: '+3 ↑' },
  { label: '總報名數', value: '98', trend: '+25 ↑' },
]

const rows = [
  ['陽明山晨跑 10K', '83%', '95%', '4.9', 'NT$ 2.5K'],
  ['健身團課', '60%', '88%', '4.7', 'NT$ 1.8K'],
  ['單車訓練', '53%', '92%', '4.8', 'NT$ 2.4K'],
]

export default function GuildAdminDashboardScreen() {
  const { showWebShell, isDesktop } = useResponsive()

  if (!showWebShell) {
    return (
      <Screen>
        <Card>
          <Text className="text-lg font-semibold text-black">數據看板請使用平板或桌機查看</Text>
        </Card>
      </Screen>
    )
  }

  return (
    <WebShell title="數據看板">
      <View className="gap-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-2">
            {['本月', '上月', '近 3 月', '近半年'].map((tab, index) => (
              <View key={tab} className={`rounded-full px-4 py-2 ${index === 0 ? 'bg-accent-600' : 'bg-white border border-grey-200'}`}><Text className={index === 0 ? 'text-white' : 'text-grey-700'}>{tab}</Text></View>
            ))}
          </View>
          <Pressable><Text className="text-sm font-medium text-accent-600">匯出報表</Text></Pressable>
        </View>

        <View className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <View className="gap-2">
                <Text className="text-sm text-grey-500">{metric.label}</Text>
                <Text className="text-3xl font-bold text-black">{metric.value}</Text>
                <Text className="text-sm font-semibold text-green-600">{metric.trend}</Text>
              </View>
            </Card>
          ))}
        </View>

        <Card>
          <View className="gap-4">
            <Text className="text-xl font-semibold text-black">GMV 趨勢圖</Text>
            <View className="h-72 items-end justify-end rounded-2xl bg-grey-50 px-6 py-5">
              <View className="h-40 w-full flex-row items-end justify-between">
                {[36, 72, 58, 100].map((height, index) => (
                  <View key={height} className="items-center gap-3">
                    <View className="w-14 rounded-t-2xl bg-accent-500" style={{ height: `${height}%` }} />
                    <Text className="text-xs text-grey-500">W{index + 1}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Card>

        <View className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <View className="gap-4">
              <Text className="text-xl font-semibold text-black">會員成長</Text>
              <View className="grid grid-cols-2 gap-4">
                <Card><Text className="text-3xl font-bold text-black">120</Text><Text className="text-sm text-grey-500">總會員數</Text></Card>
                <Card><Text className="text-3xl font-bold text-black">+12</Text><Text className="text-sm text-grey-500">本月新增</Text></Card>
              </View>
            </View>
          </Card>
          <Card>
            <View className="gap-4">
              <Text className="text-xl font-semibold text-black">口碑數據</Text>
              <View className="grid grid-cols-2 gap-4">
                <Card><Text className="text-3xl font-bold text-black">4.8</Text><Text className="text-sm text-grey-500">平均評分</Text></Card>
                <Card><Text className="text-3xl font-bold text-black">65</Text><Text className="text-sm text-grey-500">總評價數</Text></Card>
              </View>
            </View>
          </Card>
        </View>

        <Card>
          <View className="gap-4">
            <Text className="text-xl font-semibold text-black">活動數據</Text>
            {isDesktop ? (
              <View className="overflow-hidden rounded-lg border border-grey-200">
                <View className="flex-row bg-grey-50 px-4 py-3">
                  {['活動名稱', '報名率', '出席率', '評分', 'GMV'].map((label) => <Text key={label} className="flex-1 text-xs font-semibold uppercase text-grey-500">{label}</Text>)}
                </View>
                {rows.map((row) => (
                  <View key={row[0]} className="flex-row border-t border-grey-100 px-4 py-4">
                    {row.map((cell) => <Text key={cell} className="flex-1 text-sm text-grey-700">{cell}</Text>)}
                  </View>
                ))}
              </View>
            ) : (
              <View className="gap-3">
                {rows.map((row) => <Card key={row[0]}><Text className="font-semibold text-black">{row[0]}</Text><Text className="text-sm text-grey-500">報名率 {row[1]} · 出席率 {row[2]} · 評分 {row[3]} · GMV {row[4]}</Text></Card>)}
              </View>
            )}
          </View>
        </Card>
      </View>
    </WebShell>
  )
}
