import { Bell, Search } from 'lucide-react-native'
import { router } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Header } from '@/components/ui/header'
import { SearchBar } from '@/components/ui/search-bar'
import { Screen } from '@/components/common/screen'
import { useGuilds } from '@/lib/hooks/use-guilds'
import { useActivities } from '@/lib/hooks/use-activities'
import { GuildCard } from '@/components/common/guild-card'
import { ActivityCard } from '@/components/common/activity-card'

export default function ExploreScreen() {
  const guildsQuery = useGuilds()
  const activitiesQuery = useActivities()
  const guilds = guildsQuery.data ?? []
  const activities = activitiesQuery.data ?? []

  return (
    <Screen>
      <Header
        title="Sportrip"
        rightSlot={
          <>
            <Pressable onPress={() => router.push('/search')} accessibilityRole="button" accessibilityLabel="搜尋" className="h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-grey-900">
              <Search size={20} color="#171717" />
            </Pressable>
            <Pressable onPress={() => router.push('/search')} accessibilityRole="button" accessibilityLabel="搜尋" className="h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-grey-900">
              <Bell size={20} color="#171717" />
            </Pressable>
          </>
        }
      />

      <SearchBar onPress={() => router.push('/search')} />

      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-black dark:text-white">熱門公會</Text>
          <Pressable onPress={() => router.push('/(tabs)/guilds')}>
            <Text className="text-sm font-medium text-accent-600">更多</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 16 }}>
          {guilds.slice(0, 5).map((guild) => (
            <GuildCard key={guild.id} guild={guild} compact onPress={() => router.push(`/guild/${guild.id}`)} />
          ))}
        </ScrollView>
      </View>

      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-black dark:text-white">即將開始</Text>
          <Pressable onPress={() => router.push('/(tabs)/activities')}>
            <Text className="text-sm font-medium text-accent-600">更多</Text>
          </Pressable>
        </View>
        <View className="gap-3">
          {activities.slice(0, 3).map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onPress={() => router.push(`/activity/${activity.id}`)} />
          ))}
        </View>
      </View>

      <View className="gap-4 pb-8">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-black dark:text-white">為你推薦</Text>
          <Pressable onPress={() => router.push('/(tabs)/guilds')}>
            <Text className="text-sm font-medium text-accent-600">更多</Text>
          </Pressable>
        </View>
        <View className="gap-3">
          {guilds.slice(0, 3).map((guild) => (
            <GuildCard key={`${guild.id}-recommend`} guild={guild} onPress={() => router.push(`/guild/${guild.id}`)} />
          ))}
        </View>
      </View>
    </Screen>
  )
}
