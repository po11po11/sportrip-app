import { router, useLocalSearchParams } from 'expo-router'
import { Share, Text, View } from 'react-native'
import { CalendarDays, MapPin, Users, Wallet, Share2, MoreHorizontal } from 'lucide-react-native'
import { Screen } from '@/components/common/screen'
import { Header } from '@/components/ui/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useActivity, useActivityRegistration } from '@/lib/hooks/use-activities'
import { useAuth } from '@/lib/hooks/use-auth'
import { WebShell } from '@/components/web/web-shell'
import { useResponsive } from '@/lib/hooks/use-responsive'
import { Avatar } from '@/components/ui/avatar'

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user } = useAuth()
  const activityQuery = useActivity(id)
  const registrationQuery = useActivityRegistration(id, user?.id)
  const activity = activityQuery.data
  const { showWebShell } = useResponsive()

  if (!activity) {
    return (
      <Screen>
        <Header title="活動詳情" showBack />
        <Text className="text-sm text-grey-500">載入中...</Text>
      </Screen>
    )
  }

  const isRegistered = Boolean(registrationQuery.data)

  if (showWebShell) {
    return (
      <WebShell>
        <View className="gap-6">
          <View className="h-72 rounded-[28px] border border-grey-200 bg-grey-200" />
          <View className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <View className="gap-6 lg:col-span-2">
              <Card>
                <View className="gap-4">
                  <View>
                    <Text className="text-3xl font-bold text-black">{activity.title}</Text>
                    <Text className="mt-2 text-base text-grey-500">{activity.guild?.name} • {activity.guild?.location}</Text>
                  </View>
                  <View className="gap-3">
                    <View className="flex-row items-center gap-3"><CalendarDays size={18} color="#737373" /><Text className="text-sm text-grey-700">{new Date(activity.start_time).toLocaleString('zh-TW')} - {activity.end_time ? new Date(activity.end_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) : ''}</Text></View>
                    <View className="flex-row items-center gap-3"><MapPin size={18} color="#737373" /><Text className="text-sm text-grey-700">{activity.location}</Text></View>
                    <View className="flex-row items-center gap-3"><Wallet size={18} color="#737373" /><Text className="text-sm text-grey-700">{activity.price > 0 ? `NT$ ${activity.price} / 人` : '免費'}</Text></View>
                    <View className="flex-row items-center gap-3"><Users size={18} color="#737373" /><Text className="text-sm text-grey-700">{activity.registration_count ?? 0} / {activity.max_participants} 人已報名</Text></View>
                  </View>
                  <View className="flex-row gap-3">
                    <Button fullWidth={false} variant="outline" onPress={() => Share.share({ message: `${activity.title} - Sportrip` })}>分享</Button>
                    <Button fullWidth={false} variant="outline" onPress={() => {}}>收藏</Button>
                  </View>
                </View>
              </Card>

              <Card>
                <View className="gap-3">
                  <Text className="text-xl font-semibold text-black">活動說明</Text>
                  <Text className="text-base leading-8 text-grey-700">{activity.description}</Text>
                </View>
              </Card>

              <Card>
                <View className="gap-3">
                  <Text className="text-lg font-semibold text-black">費用包含</Text>
                  <Text className="text-sm text-grey-700">• 專業帶領與活動保險</Text>
                  <Text className="text-sm text-grey-700">• 補給品與集合前確認</Text>
                  <Text className="text-sm text-grey-700">• 活動後紀錄與社群交流</Text>
                </View>
              </Card>

              <Card onPress={() => router.push(`/guild/${activity.guild_id}`)}>
                <View className="flex-row items-center gap-4">
                  <Avatar name={activity.guild?.name ?? 'G'} size="lg" />
                  <View className="flex-1 gap-1">
                    <Text className="text-lg font-semibold text-black">{activity.guild?.name}</Text>
                    <Text className="text-sm text-grey-500">120 位成員 • ⭐ 4.8</Text>
                  </View>
                  <Text className="text-sm font-medium text-accent-600">查看公會 →</Text>
                </View>
              </Card>

              <Card>
                <View className="gap-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-black">已報名成員</Text>
                    <Text className="text-sm text-accent-600">查看全部</Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    {[1, 2, 3, 4, 5].map((member) => <Avatar key={member} name={`M${member}`} size="sm" />)}
                    <Text className="text-sm text-grey-500">+{Math.max((activity.registration_count ?? 0) - 5, 0)}</Text>
                  </View>
                </View>
              </Card>

              <View className="gap-4">
                <Text className="text-lg font-semibold text-black">活動評價</Text>
                {['很棒的活動！補給很充足。', '推薦給想找固定團練的人。'].map((review) => (
                  <Card key={review}><Text className="text-sm leading-7 text-grey-700">⭐⭐⭐⭐⭐ {review}</Text></Card>
                ))}
              </View>
            </View>

            <View className="lg:sticky lg:top-20 lg:self-start">
              <Card className="border-accent-200 bg-accent-50">
                <View className="gap-4">
                  <Text className="text-xl font-semibold text-black">報名活動</Text>
                  <View className="gap-2">
                    <Text className="text-sm text-grey-700">📅 {new Date(activity.start_time).toLocaleDateString('zh-TW')}</Text>
                    <Text className="text-sm text-grey-700">🕐 {new Date(activity.start_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</Text>
                    <Text className="text-sm text-grey-700">👥 {activity.registration_count ?? 0} / {activity.max_participants} 人已報名</Text>
                    <Text className="text-lg font-semibold text-accent-600">NT$ {activity.price}</Text>
                  </View>
                  <View className="gap-2 rounded-xl bg-white p-4">
                    <Text className="text-sm font-semibold text-grey-700">報名資訊</Text>
                    <Text className="text-sm text-grey-600">姓名：{user?.name ?? '王小明'}</Text>
                    <Text className="text-sm text-grey-600">手機：{user?.phone ?? '0912-345-678'}</Text>
                    <Text className="text-sm text-grey-600">Email：{user?.email ?? 'ming@sportrip.app'}</Text>
                  </View>
                  <View className="gap-2 rounded-xl bg-white p-4">
                    <Text className="text-sm font-semibold text-grey-700">費用明細</Text>
                    <View className="flex-row justify-between"><Text className="text-sm text-grey-600">活動費用</Text><Text className="text-sm text-grey-700">NT$ {activity.price}</Text></View>
                    <View className="flex-row justify-between"><Text className="text-sm text-grey-600">平台服務費</Text><Text className="text-sm text-grey-700">NT$ 0</Text></View>
                    <View className="mt-2 flex-row justify-between border-t border-grey-200 pt-2"><Text className="font-semibold text-black">總計</Text><Text className="font-semibold text-black">NT$ {activity.price}</Text></View>
                  </View>
                  <Button disabled={isRegistered} onPress={() => router.push(`/activity/${activity.id}/register`)}>{isRegistered ? '已報名' : '確認報名'}</Button>
                </View>
              </Card>
            </View>
          </View>
        </View>
      </WebShell>
    )
  }

  return (
    <Screen>
      <Header
        title="活動詳情"
        showBack
        rightSlot={
          <>
            <Button fullWidth={false} size="small" variant="ghost" onPress={() => Share.share({ message: `${activity.title} - Sportrip` })} icon={<Share2 size={18} color="#171717" />}>
              
            </Button>
            <Button fullWidth={false} size="small" variant="ghost" onPress={() => {}} icon={<MoreHorizontal size={18} color="#171717" />}>
              
            </Button>
          </>
        }
      />

      <Card>
        <View className="gap-4">
          <Badge label={activity.status === 'open' ? '報名中' : activity.status} variant={activity.status === 'open' ? 'accent' : 'grey'} />
          <Text className="text-3xl font-semibold text-black dark:text-white">{activity.title}</Text>
          <Text className="text-base text-grey-500 dark:text-grey-400">{activity.guild?.name} • {activity.guild?.location}</Text>
          <View className="gap-3">
            <View className="flex-row items-center gap-3"><CalendarDays size={18} color="#737373" /><Text className="text-sm text-grey-600 dark:text-grey-400">{new Date(activity.start_time).toLocaleString('zh-TW')} - {activity.end_time ? new Date(activity.end_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) : ''}</Text></View>
            <View className="flex-row items-center gap-3"><MapPin size={18} color="#737373" /><Text className="text-sm text-grey-600 dark:text-grey-400">{activity.location}</Text></View>
            <View className="flex-row items-center gap-3"><Wallet size={18} color="#737373" /><Text className="text-sm text-grey-600 dark:text-grey-400">{activity.price > 0 ? `NT$ ${activity.price} / 人` : '免費'}</Text></View>
            <View className="flex-row items-center gap-3"><Users size={18} color="#737373" /><Text className="text-sm text-grey-600 dark:text-grey-400">{activity.registration_count ?? 0} / {activity.max_participants} 人已報名</Text></View>
          </View>
        </View>
      </Card>

      <Card>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-black dark:text-white">活動說明</Text>
          <Text className="text-base leading-7 text-grey-600 dark:text-grey-400">{activity.description}</Text>
        </View>
      </Card>

      <Card>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-black dark:text-white">主辦公會</Text>
          <Button variant="outline" onPress={() => router.push(`/guild/${activity.guild_id}`)}>{activity.guild?.name}</Button>
        </View>
      </Card>

      <View className="pb-8">
        <Button disabled={isRegistered} onPress={() => router.push(`/activity/${activity.id}/register`)}>
          {isRegistered ? '已報名' : `立即報名 ${activity.price > 0 ? `NT$ ${activity.price}` : '免費'}`}
        </Button>
      </View>
    </Screen>
  )
}
