import { Text, View } from 'react-native'
import { Check } from 'lucide-react-native'
import { cn } from '@/lib/utils/cn'

type AvatarProps = {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  verified?: boolean
}

const sizes = {
  xs: 'h-8 w-8',
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
}

export function Avatar({ name, size = 'md', verified }: AvatarProps) {
  const initial = name?.charAt(0)?.toUpperCase() ?? '?'

  return (
    <View className="relative">
      <View className={cn('items-center justify-center rounded-full bg-grey-200 dark:bg-grey-800', sizes[size])}>
        <Text className="font-semibold text-grey-700 dark:text-grey-100">{initial}</Text>
      </View>
      {verified ? (
        <View className="absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full bg-accent-600">
          <Check size={12} color="#FFFFFF" />
        </View>
      ) : null}
    </View>
  )
}
