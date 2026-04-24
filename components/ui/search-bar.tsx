import { Pressable, Text } from 'react-native'
import { Search } from 'lucide-react-native'

type SearchBarProps = {
  placeholder?: string
  onPress?: () => void
}

export function SearchBar({ placeholder = '搜尋公會或活動...', onPress }: SearchBarProps) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 rounded bg-grey-100 px-4 py-3 dark:bg-grey-900">
      <Search size={18} color="#737373" />
      <Text className="text-base text-grey-500">{placeholder}</Text>
    </Pressable>
  )
}
