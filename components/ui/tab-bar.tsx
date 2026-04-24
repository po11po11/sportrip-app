import { Pressable, Text, View } from 'react-native'
import { cn } from '@/lib/utils/cn'

type TabItem = {
  key: string
  label: string
}

type TabBarProps = {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (key: string) => void
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <View className="flex-row gap-2">
      {tabs.map((tab) => {
        const active = tab.key === activeTab
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
            className={cn(
              'rounded-full px-4 py-2',
              active ? 'bg-accent-600' : 'bg-grey-100 dark:bg-grey-900'
            )}
          >
            <Text className={cn('text-sm font-medium', active ? 'text-white' : 'text-grey-700 dark:text-grey-300')}>
              {tab.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
