import { Pressable, View } from 'react-native'
import { cn } from '@/lib/utils/cn'

type CardProps = {
  children: React.ReactNode
  onPress?: () => void
  className?: string
  accessibilityLabel?: string
}

export function Card({ children, onPress, className, accessibilityLabel }: CardProps) {
  const content = <View className={cn('rounded-xl border border-grey-200 bg-white p-4 dark:border-grey-800 dark:bg-grey-900', className)}>{children}</View>

  if (!onPress) return content

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      {content}
    </Pressable>
  )
}
