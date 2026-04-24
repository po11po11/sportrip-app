import { Pressable, View } from 'react-native'
import { cn } from '@/lib/utils/cn'

type CardProps = {
  children: React.ReactNode
  onPress?: () => void
  className?: string
}

export function Card({ children, onPress, className }: CardProps) {
  const content = <View className={cn('rounded-md border border-grey-200 bg-white p-4 dark:border-grey-800 dark:bg-grey-900', className)}>{children}</View>

  if (!onPress) return content

  return <Pressable onPress={onPress}>{content}</Pressable>
}
