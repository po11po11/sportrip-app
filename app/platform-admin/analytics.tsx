import { Pressable, Text, View } from 'react-native'
import { WebShell } from '@/components/web/web-shell'
import { Card } from '@/components/ui/card'
import { Screen } from '@/components/common/screen'
import { useResponsive } from '@/lib/hooks/use-responsive'
import { demoGuilds } from '@/lib/supabase/mock-data'

const metrics = [
  { label: '總 GMV', value: 'NT$ 85K', trend: '+25% ↑' },
  { label: '平台收益', value: 'NT$ 8.5K', trend: '+25% ↑' },
  { label: '總公會數', value: '150', trend: '+5 ↑' },
  { label: '總活動數', value: '50', trend: '+12 ↑' },
]

export default function PlatformAdminAnalyticsScreen() {
  const { showWebShell, isDesktop } = useResponsive()

  if (!showWebShell) {
    return <Screen><Card><Text className="text-lg font-semibold text-black">平台管理頁面僅支援桌機。</Text></Card></Screen>
  }

  return (
    <WebShell title="營收看板">
      <View className="gap-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-2">
            {['本月', '上月', '近 3 月', '近半年'].map((tab, index) => <View key={tab} className={`rounded-full px-4 py-2 ${index === 0 ? 'bg-accent-600' : 'bg-white border border-grey-200'}`}><Text className={index === 0 ? 'text-white' : 'text-grey-700'}>{tab}</Text></View>)}
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
              <View className="h-44 w-full flex-row items-end justify-between">
                {[30, 52, 70, 100].map((height, index) => (
                  <View key={height} className="items-center gap-3">
                    <View className="w-14 rounded-t-2xl bg-accent-500" style={{ height: `${height}%` }} />
                    <Text className="text-xs text-grey-500">W{index + 1}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <View className="gap-4">
            <Text className="text-xl font-semibold text-black">Top 10 公會（本月 GMV）</Text>
            {isDesktop ? (
              <View className="overflow-hidden rounded-lg border border-grey-200">
                <View className="flex-row bg-grey-50 px-4 py-3">
                  {['公會名稱', '成員數', '活動數', 'GMV', '平台收益'].map((label) => <Text key={label} className="flex-1 text-xs font-semibold uppercase text-grey-500">{label}</Text>)}
                </View>
                {demoGuilds.slice(0, 3).map((guild, index) => (
                  <View key={guild.id} className="flex-row border-t border-grey-100 px-4 py-4">
                    <Text className="flex-1 text-sm font-medium text-black">{guild.name}</Text>
                    <Text className="flex-1 text-sm text-grey-700">{guild.member_count}</Text>
                    <Text className="flex-1 text-sm text-grey-700">{12 - index * 2}</Text>
                    <Text className="flex-1 text-sm text-grey-700">NT$ {8.5 - index * 1.2}K</Text>
                    <Text className="flex-1 text-sm text-grey-700">NT$ {850 - index * 120}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="gap-3">
                {demoGuilds.slice(0, 3).map((guild) => <Card key={guild.id}><Text className="font-semibold text-black">{guild.name}</Text><Text className="text-sm text-grey-500">{guild.member_count} 位成員</Text></Card>)}
              </View>
            )}
          </View>
        </Card>
      </View>
    </WebShell>
  )
}
