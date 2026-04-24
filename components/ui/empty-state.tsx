import { LucideIcon } from 'lucide-react-native'
import { Text, View } from 'react-native'
import { Button } from './button'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center justify-center gap-4 rounded-md border border-dashed border-grey-300 bg-white p-6 dark:border-grey-700 dark:bg-grey-900">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-grey-100 dark:bg-grey-800">
        <Icon size={24} color="#737373" />
      </View>
      <View className="gap-2 items-center">
        <Text className="text-xl font-semibold text-black dark:text-white">{title}</Text>
        <Text className="text-center text-sm leading-6 text-grey-500 dark:text-grey-400">{description}</Text>
      </View>
      {actionLabel && onAction ? <Button fullWidth={false} onPress={onAction}>{actionLabel}</Button> : null}
    </View>
  )
}
