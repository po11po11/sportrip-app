import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import { Alert, Text, View } from 'react-native'
import { Screen } from '@/components/common/screen'
import { Header } from '@/components/ui/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useActivity, useActivityRegistration } from '@/lib/hooks/use-activities'
import { useAuth } from '@/lib/hooks/use-auth'
import { registerForActivity, toAppErrorMessage } from '@/lib/supabase/services'

export default function ActivityRegisterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { initialized, user, isDemoMode } = useAuth()
  const activityQuery = useActivity(id)
  const registrationQuery = useActivityRegistration(id, user?.id)
  const activity = activityQuery.data
  const registration = registrationQuery.data

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!id || !user?.id) throw new Error('請先登入後再報名')
      return registerForActivity(id, user.id)
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['activities'] }),
        queryClient.invalidateQueries({ queryKey: ['activity', id] }),
        queryClient.invalidateQueries({ queryKey: ['activity-registration', id, user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['wallet', user?.id] }),
      ])

      Alert.alert(
        '報名成功',
        isDemoMode ? 'Demo mode 已完成本地報名流程，資料已同步更新。' : '你已成功報名活動，稍後帶你回到活動頁。',
        [{ text: '知道了', onPress: () => router.replace(`/activity/${id}`) }],
      )
    },
    onError: (error) => {
      Alert.alert('報名失敗', toAppErrorMessage(error))
    },
  })

  if (!initialized) return null
  if (!user) return <Redirect href="/auth/login" />

  if (!activity) {
    return (
      <Screen>
        <Header title="報名活動" showBack />
        <Text className="text-sm text-grey-500">載入中...</Text>
      </Screen>
    )
  }

  const isRegistered = Boolean(registration)
  const isFull = (activity.registration_count ?? 0) >= activity.max_participants || activity.status === 'full'

  return (
    <Screen>
      <Header title="報名活動" showBack />
      <Card>
        <View className="gap-3">
          <Text className="text-xl font-semibold text-black dark:text-white">{activity.title}</Text>
          <Text className="text-sm text-grey-600 dark:text-grey-400">{new Date(activity.start_time).toLocaleString('zh-TW')}</Text>
          <Text className="text-sm text-grey-600 dark:text-grey-400">目前 {activity.registration_count ?? 0} / {activity.max_participants} 人已報名</Text>
        </View>
      </Card>
      <Card>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-black dark:text-white">報名資訊</Text>
          <Text className="text-sm text-grey-600 dark:text-grey-400">• 姓名：{user.name ?? '未提供'}</Text>
          <Text className="text-sm text-grey-600 dark:text-grey-400">• Email：{user.email}</Text>
          <Text className="text-sm text-grey-600 dark:text-grey-400">• 總計：{activity.price ? `NT$ ${activity.price}` : '免費'}</Text>
          <Text className="text-sm leading-6 text-grey-600 dark:text-grey-400">
            {isDemoMode ? '目前為 demo mode，報名、交易紀錄與名額會先寫入本地狀態。' : 'MVP 先直接建立 confirmed 報名並同步寫入錢包交易紀錄。'}
          </Text>
          {isRegistered ? <Text className="text-sm font-medium text-accent-600">你已報名這場活動</Text> : null}
          {isFull && !isRegistered ? <Text className="text-sm font-medium text-red-500">活動名額已滿</Text> : null}
          <Button
            onPress={() => {
              if (isRegistered || isFull) return
              registerMutation.mutate()
            }}
            disabled={isRegistered || isFull}
            loading={registerMutation.isPending}
          >
            {isRegistered ? '已報名' : activity.price > 0 ? `確認報名 NT$ ${activity.price}` : '確認免費報名'}
          </Button>
        </View>
      </Card>
    </Screen>
  )
}
