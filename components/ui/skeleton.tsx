import { View } from 'react-native'
import { cn } from '@/lib/utils/cn'

type SkeletonProps = {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <View className={cn('animate-pulse rounded bg-grey-200 dark:bg-grey-800', className)} />
}
