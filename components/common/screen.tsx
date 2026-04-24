import { PropsWithChildren } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppTheme } from '@/lib/theme/use-theme'
import { cn } from '@/lib/utils/cn'

type ScreenProps = PropsWithChildren<{
  scroll?: boolean
  className?: string
  contentClassName?: string
  refreshing?: boolean
  onRefresh?: () => void
}>

export function Screen({ children, scroll = true, className, contentClassName, refreshing, onRefresh }: ScreenProps) {
  const theme = useAppTheme()

  if (!scroll) {
    return (
      <SafeAreaView className={cn('flex-1 bg-grey-50 dark:bg-black', className)}>
        <View className={cn('flex-1 px-4', contentClassName)}>{children}</View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className={cn('flex-1 bg-grey-50 dark:bg-black', className)}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} tintColor={theme.colors.accent} />
          ) : undefined
        }
      >
        <View className={cn('flex-1 gap-6', contentClassName)}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  )
}
