import { useMemo, useState } from 'react'
import { router } from 'expo-router'
import { Pressable, ScrollView, View } from 'react-native'
import { Search, SlidersHorizontal } from 'lucide-react-native'
import { Screen } from '@/components/common/screen'
import { Header } from '@/components/ui/header'
import { TabBar } from '@/components/ui/tab-bar'
import { ActivityCard } from '@/components/common/activity-card'
import { useActivities } from '@/lib/hooks/use-activities'

const tabs = ['全部', '本週', '本月', '免費', '付費']

export default function ActivitiesScreen() {
  const [activeTab, setActiveTab] = useState('全部')
  const activitiesQuery = useActivities()

  const activities = useMemo(() => {
    const all = activitiesQuery.data ?? []
    switch (activeTab) {
      case '免費':
        return all.filter((item) => item.price === 0)
      case '付費':
        return all.filter((item) => item.price > 0)
      default:
        return all
    }
  }, [activeTab, activitiesQuery.data])

  return (
    <Screen>
      <Header
        title="活動"
        rightSlot={
          <>
            <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-grey-900">
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
