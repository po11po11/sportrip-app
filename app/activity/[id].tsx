import { router, useLocalSearchParams } from 'expo-router'
import { Share, Text, View } from 'react-native'
import { CalendarDays, MapPin, Users, Wallet, Share2, MoreHorizontal } from 'lucide-react-native'
import { Screen } from '@/components/common/screen'
import { Header } from '@/components/ui/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useActivity } from '@/lib/hooks/use-activities'

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const activityQuery = useActivity(id)
  const activity = activityQuery.data

  if (!activity) {
    return (
      <Screen>
        <Header title="活動詳情" showBack />
        <Text className="text-sm text-grey-500">載入中...</Text>
      </Screen>
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
          <Badge label={activity.status === 'open' ? '報名中' : activity.status} variant={activity.status === 'open' ? 'success' : 'default'} />
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
        <Button onPress={() => router.push(`/activity/${activity.id}/register`)}>
          立即報名 {activity.price > 0 ? `NT$ ${activity.price}` : '免費'}
        </Button>
      </View>
    </Screen>
  )
}
