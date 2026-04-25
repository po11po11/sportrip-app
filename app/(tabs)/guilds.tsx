import { useMemo, useState } from 'react'
import { router } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Search, SlidersHorizontal } from 'lucide-react-native'
import { Screen } from '@/components/common/screen'
import { Header } from '@/components/ui/header'
import { TabBar } from '@/components/ui/tab-bar'
import { useGuilds } from '@/lib/hooks/use-guilds'
import { GuildCard } from '@/components/common/guild-card'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { WebShell } from '@/components/web/web-shell'
import { useResponsive } from '@/lib/hooks/use-responsive'

const tabs = ['全部', '跑步', '單車', '健身', '游泳', '登山', '瑜珈']
const regions = ['全部', '台北市', '新北市', '台中市', '新竹縣']

export default function GuildsScreen() {
  const [activeTab, setActiveTab] = useState('全部')
  const [activeRegion, setActiveRegion] = useState('全部')
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const guildsQuery = useGuilds()
  const { showWebShell, isDesktop } = useResponsive()

  const guilds = useMemo(() => {
    let all = guildsQuery.data ?? []
    if (activeTab !== '全部') all = all.filter((guild) => guild.tags?.includes(activeTab))
    if (activeRegion !== '全部') all = all.filter((guild) => guild.location === activeRegion)
    return all
  }, [activeRegion, activeTab, guildsQuery.data])

  if (showWebShell) {
    return (
      <WebShell title="公會列表">
        <View className="flex-row gap-6">
          <Card className="hidden w-[220px] self-start md:flex">
            <View className="gap-6">
              <View className="gap-3">
                <Text className="text-sm font-semibold text-grey-600">運動類型</Text>
                {tabs.map((tab) => (
                  <Pressable key={tab} onPress={() => setActiveTab(tab)} className="flex-row items-center justify-between rounded-lg px-3 py-2 hover:bg-grey-100">
                    <Text className={activeTab === tab ? 'font-semibold text-accent-600' : 'text-grey-700'}>{tab}</Text>
                    <Text className="text-grey-400">{activeTab === tab ? '✓' : ''}</Text>
                  </Pressable>
                ))}
              </View>
              <View className="gap-3">
                <Text className="text-sm font-semibold text-grey-600">地區</Text>
                {regions.map((region) => (
                  <Pressable key={region} onPress={() => setActiveRegion(region)} className="rounded-lg px-3 py-2 hover:bg-grey-100">
                    <Text className={activeRegion === region ? 'font-semibold text-accent-600' : 'text-grey-700'}>{region}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Card>

          <View className="flex-1 gap-5">
            <View className="flex-row items-center justify-between">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 12 }}>
                <TabBar tabs={tabs.map((item) => ({ key: item, label: item }))} activeTab={activeTab} onTabChange={setActiveTab} />
              </ScrollView>
              <View className="flex-row gap-2">
                <Pressable onPress={() => setViewMode('table')} className={`rounded-lg px-3 py-2 ${viewMode === 'table' ? 'bg-accent-600' : 'bg-white border border-grey-200'}`}>
                  <Text className={viewMode === 'table' ? 'text-white' : 'text-grey-700'}>表格</Text>
                </Pressable>
                <Pressable onPress={() => setViewMode('card')} className={`rounded-lg px-3 py-2 ${viewMode === 'card' ? 'bg-accent-600' : 'bg-white border border-grey-200'}`}>
                  <Text className={viewMode === 'card' ? 'text-white' : 'text-grey-700'}>卡片</Text>
                </Pressable>
              </View>
            </View>

            {viewMode === 'table' && isDesktop ? (
              <Card>
                <View className="gap-0">
                  <View className="flex-row border-b border-grey-200 bg-grey-50 px-4 py-3">
                    <Text className="flex-[2] text-xs font-semibold uppercase text-grey-500">公會名稱</Text>
                    <Text className="flex-1 text-xs font-semibold uppercase text-grey-500">地區</Text>
                    <Text className="w-20 text-xs font-semibold uppercase text-grey-500">成員數</Text>
                    <Text className="w-20 text-xs font-semibold uppercase text-grey-500">評分</Text>
                    <Text className="w-24 text-xs font-semibold uppercase text-grey-500">操作</Text>
                  </View>
                  {guilds.map((guild) => (
                    <View key={guild.id} className="flex-row items-center border-b border-grey-100 px-4 py-4 last:border-b-0">
                      <View className="flex-[2] flex-row items-center gap-3">
                        <Avatar name={guild.name} size="sm" />
                        <View>
                          <Text className="font-semibold text-black">{guild.name}</Text>
                          <Text className="text-xs text-grey-500">本月活動 8 場</Text>
                        </View>
                      </View>
                      <Text className="flex-1 text-sm text-grey-700">{guild.location}</Text>
                      <Text className="w-20 text-sm text-grey-700">{guild.member_count}</Text>
                      <Text className="w-20 text-sm text-grey-700">⭐ {guild.rating.toFixed(1)}</Text>
                      <Pressable onPress={() => router.push(`/guild/${guild.id}`)}><Text className="w-24 text-sm font-medium text-accent-600">查看</Text></Pressable>
                    </View>
                  ))}
                </View>
              </Card>
            ) : (
              <View className="gap-4">
                {guilds.map((guild) => (
                  <Card key={guild.id} onPress={() => router.push(`/guild/${guild.id}`)} className="overflow-hidden p-0">
                    <View className="h-28 bg-grey-200" />
                    <View className="gap-3 p-5">
                      <View className="flex-row items-start justify-between gap-4">
                        <View className="flex-row items-center gap-3 flex-1">
                          <Avatar name={guild.name} size={isDesktop ? 'lg' : 'md'} />
                          <View className="flex-1 gap-1">
                            <Text className="text-xl font-semibold text-black">{guild.name}</Text>
                            <Text className="text-sm text-grey-500">📍 {guild.location} • 👥 {guild.member_count} 位成員 • ⭐ {guild.rating.toFixed(1)} ({guild.review_count})</Text>
                          </View>
                        </View>
                        <Text className="text-sm font-medium text-accent-600">查看詳情 →</Text>
                      </View>
                      <Text className="text-sm leading-6 text-grey-700">{guild.description}</Text>
                      <View className="flex-row flex-wrap gap-2">
                        {guild.tags?.map((tag) => (
                          <View key={tag} className="rounded-full bg-grey-100 px-3 py-1"><Text className="text-xs text-grey-600">#{tag}</Text></View>
                        ))}
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            )}
          </View>
        </View>
      </WebShell>
    )
  }

  return (
    <Screen>
      <Header
        title="公會"
        rightSlot={
          <>
            <Pressable onPress={() => router.push('/search')} accessibilityRole="button" accessibilityLabel="篩選公會" className="h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-grey-900">
              <SlidersHorizontal size={20} color="#171717" />
            </Pressable>
            <Pressable onPress={() => router.push('/search')} className="h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-grey-900">
              <Search size={20} color="#171717" />
            </Pressable>
          </>
        }
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
        <TabBar tabs={tabs.map((item) => ({ key: item, label: item }))} activeTab={activeTab} onTabChange={setActiveTab} />
      </ScrollView>

      <View className="gap-3 pb-8">
        {guilds.map((guild) => (
          <GuildCard key={guild.id} guild={guild} onPress={() => router.push(`/guild/${guild.id}`)} />
        ))}
        {!guilds.length ? <Text className="text-sm text-grey-500">目前沒有符合條件的公會。</Text> : null}
      </View>
    </Screen>
  )
}
