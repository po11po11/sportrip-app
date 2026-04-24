import { useMemo, useState } from 'react'
import { router } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Search, SlidersHorizontal } from 'lucide-react-native'
import { Screen } from '@/components/common/screen'
import { Header } from '@/components/ui/header'
import { TabBar } from '@/components/ui/tab-bar'
import { useGuilds } from '@/lib/hooks/use-guilds'
import { GuildCard } from '@/components/common/guild-card'

const tabs = ['全部', '跑步', '單車', '健身', '游泳', '登山', '瑜珈']

export default function GuildsScreen() {
  const [activeTab, setActiveTab] = useState('全部')
  const guildsQuery = useGuilds()

  const guilds = useMemo(() => {
    const all = guildsQuery.data ?? []
    if (activeTab === '全部') return all
    return all.filter((guild) => guild.tags?.includes(activeTab))
  }, [activeTab, guildsQuery.data])

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
