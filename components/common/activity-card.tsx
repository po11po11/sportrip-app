import { Text, View } from 'react-native'
import { CalendarDays, MapPin, Users } from 'lucide-react-native'
import type { Activity } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function ActivityCard({ activity, onPress }: { activity: Activity; onPress?: () => void }) {
  const statusVariant = activity.status === 'open' ? 'accent' : 'grey'

  return (
    <Card onPress={onPress} className="gap-3" accessibilityLabel={activity.title}>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-medium text-grey-500 dark:text-grey-400">{formatDate(activity.start_time)}</Text>
        <Badge label={activity.status === 'open' ? '報名中' : activity.status === 'full' ? '已額滿' : activity.status} variant={statusVariant} />
      </View>
      <Text className="text-xl font-semibold text-black dark:text-white">{activity.title}</Text>
      <Text className="text-sm text-grey-600 dark:text-grey-400">{activity.guild?.name} • {activity.guild?.location}</Text>
      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-2">
          <Users size={14} color="#737373" />
          <Text className="text-sm text-grey-600 dark:text-grey-400">{activity.registration_count ?? 0}/{activity.max_participants}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <MapPin size={14} color="#737373" />
          <Text className="text-sm text-grey-600 dark:text-grey-400">{activity.location}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <CalendarDays size={14} color="#EA580C" />
        <Text className="text-sm font-semibold text-accent-600">{activity.price > 0 ? `NT$ ${activity.price}` : '免費'}</Text>
      </View>
    </Card>
  )
}
