import { Text, View } from 'react-native'
import { MapPin, Users } from 'lucide-react-native'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Guild } from '@/lib/types'
import { Avatar } from '@/components/ui/avatar'

type GuildCardProps = {
  guild: Guild
  onPress?: () => void
  compact?: boolean
}

export function GuildCard({ guild, onPress, compact }: GuildCardProps) {
  return (
    <Card onPress={onPress} className={compact ? 'w-48 gap-3' : 'gap-3'}>
      <View className="gap-3">
        <View className="flex-row items-start gap-3">
          <Avatar name={guild.name} size={compact ? 'md' : 'lg'} />
          <View className="flex-1 gap-1">
            <Text className="text-lg font-semibold text-black dark:text-white">{guild.name}</Text>
            <View className="flex-row items-center gap-2">
              <MapPin size={14} color="#737373" />
              <Text className="text-sm text-grey-500 dark:text-grey-400">{guild.location}</Text>
              <Users size={14} color="#737373" />
              <Text className="text-sm text-grey-500 dark:text-grey-400">{guild.member_count}</Text>
            </View>
          </View>
        </View>
        <Text numberOfLines={compact ? 2 : 3} className="text-sm leading-6 text-grey-600 dark:text-grey-400">
          {guild.description}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {guild.tags?.slice(0, compact ? 2 : 3).map((tag) => <Badge key={tag} label={tag} />)}
        </View>
      </View>
    </Card>
  )
}
