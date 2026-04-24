import { Text, TextInput, View } from 'react-native'
import { cn } from '@/lib/utils/cn'

type InputProps = {
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  error?: string
  helperText?: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address'
  multiline?: boolean
  numberOfLines?: number
  autoComplete?: 'email' | 'password' | 'name' | 'off'
  textContentType?: 'emailAddress' | 'password' | 'name' | 'none'
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  secureTextEntry,
  keyboardType = 'default',
  multiline,
  numberOfLines,
  autoComplete = 'off',
  textContentType = 'none',
}: InputProps) {
  return (
    <View className="gap-2">
      {label ? <Text className="text-sm font-medium text-grey-700 dark:text-grey-300">{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A3A3A3"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        accessibilityLabel={label}
        autoComplete={autoComplete}
        textContentType={textContentType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        className={cn(
          'rounded-lg border bg-white px-4 py-3 text-base text-black dark:bg-grey-900 dark:text-white',
          error ? 'border-accent-600' : 'border-grey-200 dark:border-grey-700',
          multiline && 'min-h-28 text-base align-top'
        )}
      />
      {error ? <Text className="text-sm text-accent-700">{error}</Text> : helperText ? <Text className="text-sm text-grey-500">{helperText}</Text> : null}
    </View>
  )
}
