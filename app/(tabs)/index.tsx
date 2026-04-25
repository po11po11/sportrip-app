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
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { DesktopSectionHeader, WebShell } from '@/components/web/web-shell'
import { useResponsive } from '@/lib/hooks/use-responsive'
import { useAuth } from '@/lib/hooks/use-auth'

export default function ExploreScreen() {
  const guildsQuery = useGuilds()
  const activitiesQuery = useActivities()
  const guilds = guildsQuery.data ?? []
  const activities = activitiesQuery.data ?? []
  const { showWebShell, isDesktop } = useResponsive()
  const { user } = useAuth()

  if (showWebShell) {
    return (
      <WebShell>
        <View className="gap-8">
          <View className="rounded-3xl border border-accent-100 bg-accent-50 px-6 py-6 lg:px-8">
            <View className="flex-row items-start justify-between gap-4">
              <View className="max-w-2xl gap-2">
                <Text className="text-3xl font-bold text-black">歡迎回來，{user?.name ?? '運動旅人'}！</Text>
                <Text className="text-base leading-7 text-grey-700">你有 3 場即將開始的活動，今天很適合把本週行程排好，也順手看看新的熱門公會。</Text>
              </View>
              <Pressable onPress={() => router.push('/profile')}>
                <Text className="text-sm font-medium text-accent-600">查看行事曆 →</Text>
              </Pressable>
            </View>
          </View>

          <View>
            <DesktopSectionHeader title="即將開始的活動" actionLabel="查看全部" onAction={() => router.push('/(tabs)/activities')} />
            <View className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {activities.slice(0, 4).map((activity) => (
                <Card key={activity.id} onPress={() => router.push(`/activity/${activity.id}`)} className="p-0 overflow-hidden">
                  <View className="h-40 bg-grey-200" />
                  <View className="gap-3 p-4">
                    <Text className="text-lg font-semibold text-black">{activity.title}</Text>
                    <Text className="text-sm text-grey-500">{activity.guild?.name}</Text>
                    <Text className="text-sm text-grey-700">{new Date(activity.start_time).toLocaleDateString('zh-TW')} · {new Date(activity.start_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</Text>
                    <Text className="text-sm text-grey-700">{activity.registration_count ?? 0}/{activity.max_participants} 人已報名</Text>
                    <Text className="text-base font-semibold text-accent-600">{activity.price > 0 ? `NT$ ${activity.price}` : '免費'}</Text>
                  </View>
                </Card>
              ))}
            </View>
          </View>

          <View>
            <DesktopSectionHeader title="熱門公會" actionLabel="查看全部" onAction={() => router.push('/(tabs)/guilds')} />
            <View className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {guilds.slice(0, 3).map((guild) => (
                <Card key={guild.id} onPress={() => router.push(`/guild/${guild.id}`)} className="overflow-hidden p-0">
                  <View className="h-32 bg-grey-200" />
                  <View className="gap-3 p-5">
                    <View className="flex-row items-center gap-3">
                      <Avatar name={guild.name} size={isDesktop ? 'lg' : 'md'} />
                      <View className="flex-1">
                        <Text className="text-xl font-semibold text-black">{guild.name}</Text>
                        <Text className="text-sm text-grey-500">📍 {guild.location} · {guild.member_count} 位成員</Text>
                      </View>
                    </View>
                    <Text className="text-sm leading-6 text-grey-700">{guild.description}</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {guild.tags?.map((tag) => (
                        <View key={tag} className="rounded-full bg-grey-100 px-3 py-1">
                          <Text className="text-xs text-grey-600">#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>

          <View>
            <DesktopSectionHeader title="推薦給你" actionLabel="查看全部" onAction={() => router.push('/(tabs)/guilds')} />
            <View className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {guilds.slice(1, 5).map((guild) => (
                <Card key={`${guild.id}-recommend`} onPress={() => router.push(`/guild/${guild.id}`)}>
                  <View className="flex-row items-center gap-3">
                    <Avatar name={guild.name} size="md" />
                    <View className="flex-1 gap-1">
                      <Text className="text-base font-semibold text-black">{guild.name}</Text>
                      <Text className="text-sm text-grey-500">📍 {guild.location}</Text>
                      <Text className="text-sm text-grey-500">👥 {guild.member_count} 位成員 · ⭐ {guild.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        </View>
      </WebShell>
    )
  }

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
