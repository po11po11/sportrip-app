import { router } from 'expo-router'
import { CircleAlert } from 'lucide-react-native'
import { EmptyState } from '@/components/ui/empty-state'
import { Screen } from '@/components/common/screen'

export default function NotFoundScreen() {
  return (
    <Screen className="justify-center" contentClassName="flex-1 justify-center">
      <EmptyState
        icon={CircleAlert}
        title="找不到頁面"
        description="這個路由尚未建立，先回首頁繼續探索。"
        actionLabel="回首頁"
        onAction={() => router.replace('/(tabs)')}
      />
    </Screen>
  )
}
