import { Pressable, Text, View } from 'react-native'
import { WebShell } from '@/components/web/web-shell'
import { Card } from '@/components/ui/card'
import { Screen } from '@/components/common/screen'
import { useResponsive } from '@/lib/hooks/use-responsive'
import { demoGuilds, demoUsers } from '@/lib/supabase/mock-data'

export default function PlatformAdminGuildsScreen() {
  const { showWebShell, isDesktop } = useResponsive()

  if (!showWebShell) {
    return <Screen><Card><Text className="text-lg font-semibold text-black">平台管理頁面僅支援桌機。</Text></Card></Screen>
  }

  return (
    <WebShell title="公會審核">
      <View className="gap-6">
        <View className="flex-row gap-2">
          {['待審核', '已通過', '已拒絕', '全部'].map((tab, index) => <View key={tab} className={`rounded-full px-4 py-2 ${index === 0 ? 'bg-accent-600' : 'bg-white border border-grey-200'}`}><Text className={index === 0 ? 'text-white' : 'text-grey-700'}>{tab}</Text></View>)}
        </View>
        {isDesktop ? (
          <Card>
            <View className="overflow-hidden rounded-lg border border-grey-200">
              <View className="flex-row bg-grey-50 px-4 py-3">
                {['公會名稱', '公會主', '地區', '成員數', '申請時間', '操作'].map((label) => <Text key={label} className="flex-1 text-xs font-semibold uppercase text-grey-500">{label}</Text>)}
              </View>
              {demoGuilds.slice(0, 4).map((guild, index) => (
                <View key={guild.id} className="flex-row items-center border-t border-grey-100 px-4 py-4">
                  <Text className="flex-1 text-sm font-medium text-black">{guild.name}</Text>
                  <Text className="flex-1 text-sm text-grey-700">{demoUsers[index % demoUsers.length].name}</Text>
                  <Text className="flex-1 text-sm text-grey-700">{guild.location}</Text>
                  <Text className="flex-1 text-sm text-grey-700">0</Text>
                  <Text className="flex-1 text-sm text-grey-700">04/25 10:30</Text>
                  <View className="flex-1 flex-row gap-2">
                    <Pressable className="rounded-lg bg-accent-600 px-3 py-2"><Text className="text-xs font-semibold text-white">審核</Text></Pressable>
                    <Pressable className="rounded-lg bg-grey-100 px-3 py-2"><Text className="text-xs font-semibold text-grey-700">拒絕</Text></Pressable>
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
