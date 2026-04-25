import { useMemo, useState } from 'react'
import { router } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Search, SlidersHorizontal } from 'lucide-react-native'
import { Screen } from '@/components/common/screen'
import { Header } from '@/components/ui/header'
import { TabBar } from '@/components/ui/tab-bar'
import { ActivityCard } from '@/components/common/activity-card'
import { useActivities } from '@/lib/hooks/use-activities'
import { Card } from '@/components/ui/card'
import { WebShell } from '@/components/web/web-shell'
import { useResponsive } from '@/lib/hooks/use-responsive'

const tabs = ['全部', '即將開始', '本週末', '下週', '本月']

export default function ActivitiesScreen() {
  const [activeTab, setActiveTab] = useState('全部')
  const activitiesQuery = useActivities()
  const { showWebShell } = useResponsive()

  const activities = useMemo(() => {
    const all = activitiesQuery.data ?? []
    switch (activeTab) {
      case '即將開始':
        return all.slice(0, 3)
      case '本週末':
        return all.filter((item) => new Date(item.start_time).getDay() === 0 || new Date(item.start_time).getDay() === 6)
      case '下週':
        return all.slice(1)
      case '本月':
        return all
      default:
        return all
    }
  }, [activeTab, activitiesQuery.data])

  if (showWebShell) {
    return (
      <WebShell title="活動列表">
        <View className="gap-5">
          <View className="flex-row items-center justify-between gap-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 12 }}>
              <TabBar tabs={tabs.map((item) => ({ key: item, label: item }))} activeTab={activeTab} onTabChange={setActiveTab} />
            </ScrollView>
            <Pressable className="rounded-lg border border-grey-200 bg-white px-4 py-2"><Text className="text-sm font-medium text-grey-700">篩選</Text></Pressable>
          </View>

          <View className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => {
              const ratio = (activity.registration_count ?? 0) / activity.max_participants
              const statusColor = ratio >= 1 ? 'text-red-600' : ratio >= 0.8 ? 'text-yellow-600' : 'text-grey-700'
              return (
                <Card key={activity.id} onPress={() => router.push(`/activity/${activity.id}`)} className="overflow-hidden p-0">
                  <View className="h-48 bg-grey-200" />
                  <View className="gap-3 p-5">
                    <View>
                      <Text className="text-lg font-semibold text-black">{activity.title}</Text>
                      <Text className="text-sm text-grey-500">{activity.guild?.name}</Text>
                    </View>
                    <Text className="text-sm text-grey-700">📅 {new Date(activity.start_time).toLocaleDateString('zh-TW')} · 🕐 {new Date(activity.start_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</Text>
                    <Text className="text-sm text-grey-700">📍 {activity.location}</Text>
                    <Text className={`text-sm font-medium ${statusColor}`}>{activity.registration_count ?? 0}/{activity.max_participants} 人已報名</Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base font-semibold text-accent-600">{activity.price > 0 ? `NT$ ${activity.price}` : '免費'}</Text>
                      <View className={`rounded-lg px-4 py-2 ${ratio >= 1 ? 'bg-grey-300' : 'bg-accent-600'}`}>
                        <Text className={`text-sm font-semibold ${ratio >= 1 ? 'text-grey-600' : 'text-white'}`}>{ratio >= 1 ? '已額滿' : '立即報名'}</Text>
                      </View>
                    </View>
                  </View>
                </Card>
              )
            })}
          </View>
        </View>
      </WebShell>
    )
  }

  return (
    <Screen>
      <Header
        title="活動"
        rightSlot={
          <>
            <Pressable onPress={() => router.push('/search')} accessibilityRole="button" accessibilityLabel="篩選活動" className="h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-grey-900">
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
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} onPress={() => router.push(`/activity/${activity.id}`)} />
        ))}
      </View>
    </Screen>
  )
}
