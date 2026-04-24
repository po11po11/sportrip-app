import { Text, View } from 'react-native'
import { cn } from '@/lib/utils/cn'

type BadgeProps = {
  label: string
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error'
}

const variantMap = {
  default: 'bg-grey-100 text-grey-700 dark:bg-grey-800 dark:text-grey-200',
  accent: 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <View className={cn('self-start rounded-sm px-2 py-1', variantMap[variant])}>
      <Text className="text-xs font-medium">{label}</Text>
    </View>
  )
}
