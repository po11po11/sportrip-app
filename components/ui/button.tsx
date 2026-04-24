import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { cn } from '@/lib/utils/cn'

type ButtonProps = {
  children?: React.ReactNode
  onPress: () => void
  variant?: 'solid' | 'outline' | 'ghost'
  color?: 'primary' | 'secondary' | 'destructive'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
}

const sizeMap = {
  small: 'min-h-8 px-3 py-2',
  medium: 'min-h-11 px-4 py-3',
  large: 'min-h-14 px-6 py-4',
}

const variantMap = {
  solid: {
    primary: 'bg-accent-600 active:bg-accent-700',
    secondary: 'bg-grey-900 active:bg-grey-800 dark:bg-white dark:active:bg-grey-100',
    destructive: 'bg-error active:opacity-90',
  },
  outline: {
    primary: 'border border-accent-600 bg-transparent',
    secondary: 'border border-grey-300 bg-transparent dark:border-grey-700',
    destructive: 'border border-error bg-transparent',
  },
  ghost: {
    primary: 'bg-transparent',
    secondary: 'bg-transparent',
    destructive: 'bg-transparent',
  },
} as const

const textMap = {
  solid: {
    primary: 'text-white',
    secondary: 'text-white dark:text-black',
    destructive: 'text-white',
  },
  outline: {
    primary: 'text-accent-600',
    secondary: 'text-grey-700 dark:text-grey-200',
    destructive: 'text-error',
  },
  ghost: {
    primary: 'text-accent-600',
    secondary: 'text-grey-700 dark:text-grey-200',
    destructive: 'text-error',
  },
} as const

export function Button({
  children,
  onPress,
  variant = 'solid',
  color = 'primary',
  size = 'medium',
  disabled,
  loading,
  fullWidth = true,
  icon,
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      className={cn(
        'items-center justify-center rounded flex-row gap-2',
        sizeMap[size],
        variantMap[variant][color],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50'
      )}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'solid' ? '#FFFFFF' : '#EA580C'} />
      ) : (
        <>
          {icon ? <View>{icon}</View> : null}
          {children ? <Text className={cn('font-semibold text-base', textMap[variant][color])}>{children}</Text> : null}
        </>
      )}
    </Pressable>
  )
}
