import { Text, View } from 'react-native'

type DividerProps = {
  text?: string
}

export function Divider({ text }: DividerProps) {
  if (!text) {
    return <View className="h-px w-full bg-grey-200 dark:bg-grey-800" />
  }

  return (
    <View className="flex-row items-center gap-3">
      <View className="h-px flex-1 bg-grey-200 dark:bg-grey-800" />
      <Text className="text-xs text-grey-500">{text}</Text>
      <View className="h-px flex-1 bg-grey-200 dark:bg-grey-800" />
    </View>
  )
}
