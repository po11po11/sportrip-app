import { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'

type HeaderProps = {
  title: string
  subtitle?: string
  leftSlot?: ReactNode
  rightSlot?: ReactNode
  showBack?: boolean
}

export function Header({ title, subtitle, leftSlot, rightSlot, showBack }: HeaderProps) {
  const router = useRouter()

  return (
    <View className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center gap-3 flex-1">
        {showBack ? (
          <Pressable onPress={() => router.back()} className="h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-grey-900">
            <ChevronLeft size={20} color="#171717" />
          </Pressable>
        ) : leftSlot ? (
          leftSlot
        ) : null}
        <View className="flex-1">
          <Text className="text-2xl font-semibold text-black dark:text-white">{title}</Text>
          {subtitle ? <Text className="text-sm text-grey-500 dark:text-grey-400">{subtitle}</Text> : null}
        </View>
      </View>
      {rightSlot ? <View className="ml-3 flex-row items-center gap-2">{rightSlot}</View> : null}
    </View>
  )
}
