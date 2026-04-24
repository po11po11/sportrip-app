import { Text, View } from 'react-native'
import { cn } from '@/lib/utils/cn'

type BadgeProps = {
  label: string
  variant?: 'grey' | 'accent'
}

const variantMap = {
  grey: 'bg-grey-100 text-grey-700 dark:bg-grey-800 dark:text-grey-200',
  accent: 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300',
}

export function Badge({ label, variant = 'grey' }: BadgeProps) {
  return (
    <View className={cn('self-start rounded-lg px-2 py-1', variantMap[variant])}>
      <Text className="text-xs font-medium">{label}</Text>
    </View>
  )
}
