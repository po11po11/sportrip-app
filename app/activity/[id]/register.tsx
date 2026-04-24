import { Redirect, useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'
import { Screen } from '@/components/common/screen'
import { Header } from '@/components/ui/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useActivity } from '@/lib/hooks/use-activities'
import { useAuth } from '@/lib/hooks/use-auth'

export default function ActivityRegisterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { initialized, user } = useAuth()
  const activityQuery = useActivity(id)
  const activity = activityQuery.data

  if (!initialized) return null
  if (!user) return <Redirect href="/auth/login" />

  return (
    <Screen>
      <Header title="報名活動" showBack />
      <Card>
        <View className="gap-3">
          <Text className="text-xl font-semibold text-black dark:text-white">{activity?.title}</Text>
          <Text className="text-sm text-grey-600 dark:text-grey-400">{activity ? new Date(activity.start_time).toLocaleString('zh-TW') : ''}</Text>
        </View>
      </Card>
      <Card>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-black dark:text-white">報名資訊</Text>
          <Text className="text-sm text-grey-600 dark:text-grey-400">• 姓名：{user.name ?? '未提供'}</Text>
          <Text className="text-sm text-grey-600 dark:text-grey-400">• Email：{user.email}</Text>
          <Text className="text-sm text-grey-600 dark:text-grey-400">• 總計：{activity?.price ? `NT$ ${activity.price}` : '免費'}</Text>
          <Text className="text-sm leading-6 text-grey-600 dark:text-grey-400">Phase 1 付款先 mock，這裡只保留流程與 UI，後續接 Stripe / 錢包扣點。</Text>
          <Button onPress={() => {}}>確認報名（mock）</Button>
        </View>
      </Card>
    </Screen>
  )
}
