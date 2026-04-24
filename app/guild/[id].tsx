import { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Share, Text, View } from 'react-native'
import { CalendarDays, MapPin, MoreHorizontal, Share2, Users } from 'lucide-react-native'
import { Header } from '@/components/ui/header'
import { Screen } from '@/components/common/screen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { TabBar } from '@/components/ui/tab-bar'
import { useGuild } from '@/lib/hooks/use-guilds'
import { useActivities } from '@/lib/hooks/use-activities'
import { useAuth } from '@/lib/hooks/use-auth'
import { joinGuild } from '@/lib/supabase/services'

const tabs = [
  { key: 'about', label: '關於' },
  { key: 'activities', label: '活動' },
  { key: 'members', label: '成員' },
]

export default function GuildDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>()
  const { user } = useAuth()
  const guildQuery = useGuild(params.id)
  const activitiesQuery = useActivities()
  const [activeTab, setActiveTab] = useState('about')
  const [joining, setJoining] = useState(false)

  const guild = guildQuery.data
  const guildActivities = (activitiesQuery.data ?? []).filter((item) => item.guild_id === guild?.id)

  if (!guild) {
    return (
      <Screen>
        <Header title="公會詳情" showBack />
        <Text className="text-sm text-grey-500">載入中...</Text>
      </Screen>
    )
  }

  return (
    <Screen>
      <Header
        title={guild.name}
        showBack
        rightSlot={
          <>
            <Button fullWidth={false} size="small" variant="ghost" onPress={() => Share.share({ message: `${guild.name} - Sportrip` })} icon={<Share2 size={18} color="#171717" />}>
              
            </Button>
            <Button fullWidth={false} size="small" variant="ghost" onPress={() => {}} icon={<MoreHorizontal size={18} color="#171717" />}>
              
            </Button>
          </>
        }
      />

      <Card>
        <View className="gap-4">
          <View className="flex-row items-start gap-4">
            <Avatar name={guild.name} size="xl" />
            <View className="flex-1 gap-2">
              <Text className="text-3xl font-semibold text-black dark:text-white">{guild.name}</Text>
              <View className="flex-row items-center gap-2">
                <MapPin size={16} color="#737373" />
                <Text className="text-sm text-grey-500 dark:text-grey-400">{guild.location}</Text>
                <Users size={16} color="#737373" />
                <Text className="text-sm text-grey-500 dark:text-grey-400">{guild.member_count} 位成員</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {guild.tags?.map((tag) => <Badge key={tag} label={tag} />)}
              </View>
            </View>
          </View>
          <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </View>
      </Card>

      {activeTab === 'about' ? (
        <View className="gap-4">
          <Card>
            <View className="gap-3">
              <Text className="text-lg font-semibold text-black dark:text-white">公會簡介</Text>
              <Text className="text-base leading-7 text-grey-600 dark:text-grey-400">{guild.description}</Text>
            </View>
          </Card>
          <Card>
            <View className="gap-3">
              <Text className="text-lg font-semibold text-black dark:text-white">公會資訊</Text>
              <Text className="text-sm text-grey-600 dark:text-grey-400">• 評分：{guild.rating.toFixed(1)}（{guild.review_count} 則）</Text>
              <Text className="text-sm text-grey-600 dark:text-grey-400">• 狀態：{guild.status}</Text>
              <Text className="text-sm text-grey-600 dark:text-grey-400">• 公會主 ID：{guild.owner_id}</Text>
            </View>
          </Card>
        </View>
      ) : null}

      {activeTab === 'activities' ? (
        <View className="gap-3">
          {guildActivities.map((activity) => (
            <Card key={activity.id} onPress={() => router.push(`/activity/${activity.id}`)}>
              <View className="gap-2">
                <Text className="text-sm text-grey-500 dark:text-grey-400">{new Date(activity.start_time).toLocaleString('zh-TW')}</Text>
                <Text className="text-lg font-semibold text-black dark:text-white">{activity.title}</Text>
                <View className="flex-row items-center gap-2">
                  <CalendarDays size={14} color="#737373" />
                  <Text className="text-sm text-grey-600 dark:text-grey-400">{activity.registration_count ?? 0} / {activity.max_participants} 人</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      ) : null}

      {activeTab === 'members' ? (
        <Card>
          <View className="gap-3">
            <Text className="text-lg font-semibold text-black dark:text-white">成員名單</Text>
            <Text className="text-sm leading-6 text-grey-600 dark:text-grey-400">Phase 1 先以 summary 呈現，完整列表路由已保留在 `/guild/[id]/members`。</Text>
            <Button variant="outline" onPress={() => router.push(`/guild/${guild.id}/members`)}>查看成員頁</Button>
          </View>
        </Card>
      ) : null}

      <View className="pb-8">
        <Button
          loading={joining}
          onPress={async () => {
            if (!user) {
              router.push('/auth/login')
              return
            }
            setJoining(true)
            try {
              await joinGuild(guild.id, user.id)
            } finally {
              setJoining(false)
            }
          }}
        >
          {guild.is_member ? '已加入' : '加入公會'}
        </Button>
      </View>
    </Screen>
  )
}
