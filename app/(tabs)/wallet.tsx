import { router } from 'expo-router'
import { Ellipsis, Gift, ReceiptText, WalletCards } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import { Screen } from '@/components/common/screen'
import { Header } from '@/components/ui/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks/use-auth'
import { useWallet } from '@/lib/hooks/use-wallet'
import { EmptyState } from '@/components/ui/empty-state'

export default function WalletScreen() {
  const { user } = useAuth()
  const walletQuery = useWallet(user?.id)

  if (!user) {
    return (
      <Screen className="justify-center" contentClassName="flex-1 justify-center">
        <EmptyState icon={WalletCards} title="先登入才有錢包" description="錢包、交易紀錄與推薦獎勵都綁定會員帳號。" actionLabel="前往登入" onAction={() => router.push('/auth/login')} />
      </Screen>
    )
  }

  const data = walletQuery.data

  return (
    <Screen>
      <Header
        title="錢包"
        rightSlot={<Pressable onPress={() => router.push('/wallet/history')} accessibilityRole="button" accessibilityLabel="查看交易紀錄" className="h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-grey-900"><Ellipsis size={20} color="#171717" /></Pressable>}
      />

      <Card className="bg-grey-900 dark:bg-grey-900">
        <View className="gap-5">
          <Text className="text-sm text-grey-300">點數餘額</Text>
          <Text className="text-4xl font-semibold text-white">NT$ {data?.balance ?? 0}</Text>
          <View className="flex-row gap-3">
            <View className="flex-1"><Button onPress={() => router.push('/wallet/topup')}>儲值</Button></View>
            <View className="flex-1"><Button variant="outline" onPress={() => router.push('/wallet/history')}>交易紀錄</Button></View>
          </View>
        </View>
      </Card>

      <Card>
        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <Gift size={18} color="#EA580C" />
            <Text className="text-lg font-semibold text-black dark:text-white">推薦獎勵</Text>
          </View>
          <Text className="text-sm leading-6 text-grey-600 dark:text-grey-400">推薦 1 位好友首次報名，你和好友各得 50 點數。這版先以靜態規則顯示，後續接 referral backend。</Text>
          <Button variant="outline" color="secondary" onPress={() => {}}>邀請好友（mock）</Button>
        </View>
      </Card>

      <View className="gap-3 pb-8">
        <Text className="text-lg font-semibold text-black dark:text-white">最近交易</Text>
        {data?.transactions.map((transaction) => (
          <Card key={transaction.id}>
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-row items-start gap-3 flex-1">
                <View className="mt-1 h-10 w-10 items-center justify-center rounded-full bg-grey-100 dark:bg-grey-800">
                  <ReceiptText size={18} color="#737373" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-grey-500 dark:text-grey-400">{new Date(transaction.created_at ?? '').toLocaleString('zh-TW')}</Text>
                  <Text className="mt-1 text-base font-medium text-black dark:text-white">{transaction.description}</Text>
                </View>
              </View>
              <Text className={`text-sm font-semibold ${transaction.amount >= 0 ? 'text-accent-600' : 'text-black dark:text-white'}`}>
                {transaction.amount >= 0 ? '+' : '-'} NT$ {Math.abs(transaction.amount)}
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  )
}
