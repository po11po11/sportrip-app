import { Pressable, Text, View } from 'react-native'
import { WebShell } from '@/components/web/web-shell'
import { Card } from '@/components/ui/card'
import { Screen } from '@/components/common/screen'
import { useResponsive } from '@/lib/hooks/use-responsive'

const reports = [
  ['@alice', '用戶', '@bob', '騷擾', '04/25 15:30'],
  ['台北跑步社', '公會', '@charlie', '違規', '04/24 10:20'],
  ['陽明山晨跑', '活動', '@david', '詐騙', '04/23 09:45'],
]

export default function PlatformAdminReportsScreen() {
  const { showWebShell, isDesktop } = useResponsive()

  if (!showWebShell) {
    return <Screen><Card><Text className="text-lg font-semibold text-black">平台管理頁面僅支援桌機。</Text></Card></Screen>
  }

  return (
    <WebShell title="檢舉處理">
      <View className="gap-6">
        <View className="flex-row gap-2">
          {['待處理', '已處理', '已駁回', '全部'].map((tab, index) => <View key={tab} className={`rounded-full px-4 py-2 ${index === 0 ? 'bg-accent-600' : 'bg-white border border-grey-200'}`}><Text className={index === 0 ? 'text-white' : 'text-grey-700'}>{tab}</Text></View>)}
        </View>
        {isDesktop ? (
          <Card>
            <View className="overflow-hidden rounded-lg border border-grey-200">
              <View className="flex-row bg-grey-50 px-4 py-3">
                {['檢舉對象', '類型', '檢舉人', '原因', '時間', '操作'].map((label) => <Text key={label} className="flex-1 text-xs font-semibold uppercase text-grey-500">{label}</Text>)}
              </View>
              {reports.map((report) => (
                <View key={report[0]} className="flex-row items-center border-t border-grey-100 px-4 py-4">
                  {report.map((cell) => <Text key={cell} className="flex-1 text-sm text-grey-700">{cell}</Text>)}
                  <View className="flex-1 flex-row gap-3">
                    <Pressable><Text className="text-sm font-medium text-accent-600">查看</Text></Pressable>
                    <Pressable><Text className="text-sm font-medium text-accent-600">處理</Text></Pressable>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        ) : null}
      </View>
    </WebShell>
  )
}
