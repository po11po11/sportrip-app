import { useMemo, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Share, Text, View, Pressable, ScrollView } from 'react-native'
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
import { WebShell } from '@/components/web/web-shell'
import { useResponsive } from '@/lib/hooks/use-responsive'
import { demoUsers } from '@/lib/supabase/mock-data'

const tabs = [
  { key: 'about', label: '簡介' },
  { key: 'activities', label: '活動' },
  { key: 'members', label: '成員' },
  { key: 'reviews', label: '評價' },
]

export default function GuildDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>()
  const { user } = useAuth()
  const guildQuery = useGuild(params.id)
  const activitiesQuery = useActivities()
  const [activeTab, setActiveTab] = useState('about')
  const [joining, setJoining] = useState(false)
  const { showWebShell, isDesktop } = useResponsive()

  const guild = guildQuery.data
  const guildActivities = (activitiesQuery.data ?? []).filter((item) => item.guild_id === guild?.id)
  const owner = useMemo(() => demoUsers.find((item) => item.id === guild?.owner_id) ?? demoUsers[0], [guild?.owner_id])

  if (!guild) {
    return (
      <Screen>
        <Header title="公會詳情" showBack />
        <Text className="text-sm text-grey-500">載入中...</Text>
      </Screen>
    )
  }

  if (showWebShell) {
    return (
      <WebShell>
        <View className="gap-6">
          <View className="overflow-hidden rounded-[28px] border border-grey-200 bg-white">
            <View className="h-64 bg-grey-200" />
            <View className="gap-5 px-6 py-6 lg:px-8">
              <View className="flex-row items-start justify-between gap-5">
                <View className="flex-row items-center gap-4 flex-1">
                  <Avatar name={guild.name} size={isDesktop ? 'xl' : 'lg'} />
                  <View className="flex-1 gap-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-3xl font-bold text-black">{guild.name}</Text>
                      <Text className="text-sm text-grey-600">⭐ {guild.rating.toFixed(1)}</Text>
                    </View>
                    <Text className="text-sm text-grey-500">📍 {guild.location} • 👥 {guild.member_count} 位成員</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {guild.tags?.map((tag) => <Badge key={tag} label={tag} />)}
                    </View>
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <Button variant="outline" fullWidth={false} onPress={() => Share.share({ message: `${guild.name} - Sportrip` })}>分享</Button>
                  <Button fullWidth={false} loading={joining} onPress={async () => {
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
                  }}>{guild.is_member ? '已加入' : '加入公會'}</Button>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 12 }}>
                <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
              </ScrollView>
            </View>
          </View>

          <View className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <View className="gap-6 lg:col-span-2">
              {activeTab === 'about' ? (
                <>
                  <Card>
                    <View className="gap-4">
                      <Text className="text-xl font-semibold text-black">關於公會</Text>
                      <Text className="text-base leading-8 text-grey-700">{guild.description}</Text>
                      <View className="gap-2">
                        <Text className="text-sm font-semibold text-grey-700">集合地點</Text>
                        <Text className="text-sm text-grey-600">📍 {guild.location}，常見集合點包含大安森林公園與河濱沿線。</Text>
                      </View>
                      <View className="gap-2">
                        <Text className="text-sm font-semibold text-grey-700">聯絡方式</Text>
                        <Text className="text-sm text-grey-600">📧 contact@sportrip.app</Text>
                        <Text className="text-sm text-grey-600">📱 FB / IG / LINE</Text>
                      </View>
                    </View>
                  </Card>
                  <Card>
                    <View className="flex-row items-center gap-4">
                      <Avatar name={owner.name ?? owner.email} size="lg" verified={owner.verified} />
                      <View className="gap-1">
                        <Text className="text-lg font-semibold text-black">{owner.name}</Text>
                        <Text className="text-sm text-grey-500">公會主 • LV {owner.level}</Text>
                        <Text className="text-sm text-grey-500">已參加 27 場活動</Text>
                      </View>
                    </View>
                  </Card>
                </>
              ) : null}

              {activeTab === 'activities' ? (
                <Card>
                  <View className="gap-0 overflow-hidden rounded-lg border border-grey-200">
                    <View className="flex-row bg-grey-50 px-4 py-3">
                      <Text className="flex-[2] text-xs font-semibold uppercase text-grey-500">活動名稱</Text>
                      <Text className="flex-1 text-xs font-semibold uppercase text-grey-500">時間</Text>
                      <Text className="flex-1 text-xs font-semibold uppercase text-grey-500">地點</Text>
                      <Text className="w-24 text-xs font-semibold uppercase text-grey-500">報名</Text>
                    </View>
                    {guildActivities.map((activity) => (
                      <View key={activity.id} className="flex-row items-center border-t border-grey-100 px-4 py-4">
                        <Text className="flex-[2] text-sm font-medium text-black">{activity.title}</Text>
                        <Text className="flex-1 text-sm text-grey-700">{new Date(activity.start_time).toLocaleDateString('zh-TW')}</Text>
                        <Text className="flex-1 text-sm text-grey-700">{activity.location}</Text>
                        <Pressable onPress={() => router.push(`/activity/${activity.id}`)}><Text className="w-24 text-sm font-medium text-accent-600">報名</Text></Pressable>
                      </View>
                    ))}
                  </View>
                </Card>
              ) : null}

              {activeTab === 'members' ? (
                <View className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[owner, ...demoUsers].slice(0, 4).map((member, index) => (
                    <Card key={`${member.id}-${index}`}>
                      <View className="items-center gap-3 py-2">
                        <Avatar name={member.name ?? member.email} size="lg" verified={member.verified} />
                        <Text className="text-base font-semibold text-black">{member.name}</Text>
                        <Text className="text-sm text-grey-500">{index === 0 ? '公會主' : '成員'} • LV {member.level}</Text>
                        <Text className="text-sm text-grey-500">{12 - index * 2} 場活動</Text>
                      </View>
                    </Card>
                  ))}
                </View>
              ) : null}

              {activeTab === 'reviews' ? (
                <View className="gap-4">
                  {['很棒的跑步社，氣氛很好。', '教練節奏控制得很好，很適合進步。'].map((review, index) => (
                    <Card key={review}>
                      <View className="gap-2">
                        <Text className="text-sm text-grey-500">{'⭐'.repeat(5)} · 會員 {index + 1} · {index + 1} 週前</Text>
                        <Text className="text-base text-grey-700">{review}</Text>
                      </View>
                    </Card>
                  ))}
                </View>
              ) : null}
            </View>

            <View className="gap-4 lg:sticky lg:top-20 lg:self-start">
              <Card>
                <View className="gap-4">
                  <Text className="text-lg font-semibold text-black">即將開始的活動</Text>
                  {guildActivities.slice(0, 3).map((activity) => (
                    <View key={activity.id} className="rounded-xl border border-grey-200 p-4">
                      <Text className="text-base font-semibold text-black">{activity.title}</Text>
                      <Text className="mt-2 text-sm text-grey-600">{new Date(activity.start_time).toLocaleDateString('zh-TW')} · {new Date(activity.start_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</Text>
                      <Text className="text-sm text-grey-600">📍 {activity.location}</Text>
                      <Text className="text-sm text-grey-600">{activity.registration_count ?? 0}/{activity.max_participants} 人已報名</Text>
                      <Pressable onPress={() => router.push(`/activity/${activity.id}`)} className="mt-3 rounded-lg bg-accent-600 px-4 py-2">
                        <Text className="text-center text-sm font-semibold text-white">立即報名</Text>
                      </Pressable>
                    </View>
                  ))}
                  <Pressable onPress={() => setActiveTab('activities')}><Text className="text-sm font-medium text-accent-600">查看全部活動 →</Text></Pressable>
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
          <TabBar tabs={tabs.slice(0, 3)} activeTab={activeTab} onTabChange={setActiveTab} />
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
