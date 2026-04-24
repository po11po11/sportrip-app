import { router } from 'expo-router'
import { ChevronRight, LogOut, ShieldCheck, UserCircle2 } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import { Screen } from '@/components/common/screen'
import { Header } from '@/components/ui/header'
import { Avatar } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks/use-auth'

const menu = [
  { label: '編輯個人資料', href: '/profile/edit' },
  { label: '運動履歷', href: '/profile/achievements' },
  { label: '設定', href: '/profile/settings' },
  { label: '實名認證', href: '/profile/verify' },
  { label: '公會主後台', href: '/guild-admin' },
]

export default function ProfileScreen() {
  const { user, signOut, isDemoMode } = useAuth()

  return (
    <Screen>
      <Header title="我的" />
      {user ? (
        <>
          <Card>
            <View className="flex-row items-center gap-4">
              <Avatar name={user.name ?? user.email} size="lg" verified={user.verified} />
              <View className="flex-1 gap-1">
                <Text className="text-xl font-semibold text-black dark:text-white">{user.name ?? user.email}</Text>
                <Text className="text-sm text-grey-500 dark:text-grey-400">@{user.username ?? user.email.split('@')[0]}</Text>
                <View className="flex-row items-center gap-2">
                  <ShieldCheck size={16} color={user.verified ? '#10B981' : '#737373'} />
                  <Text className="text-sm text-grey-500 dark:text-grey-400">{user.verified ? '已完成認證' : '尚未認證'}</Text>
                </View>
                {isDemoMode ? <Text className="text-sm text-accent-600">目前為 demo mode，資料不會寫入雲端。</Text> : null}
              </View>
            </View>
          </Card>

          <View className="gap-3">
            {menu.map((item) => (
              <Pressable key={item.href} onPress={() => router.push(item.href as never)}>
                <Card>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <UserCircle2 size={18} color="#737373" />
                      <Text className="text-base font-medium text-black dark:text-white">{item.label}</Text>
                    </View>
                    <ChevronRight size={18} color="#737373" />
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>

          <Button variant="outline" color="destructive" onPress={async () => { await signOut(); router.replace('/auth/login') }} icon={<LogOut size={18} color="#EF4444" />}>
            登出
          </Button>
        </>
      ) : (
        <Card>
          <View className="gap-4">
            <Text className="text-xl font-semibold text-black dark:text-white">還沒登入</Text>
            <Text className="text-sm leading-6 text-grey-600 dark:text-grey-400">登入後才能查看錢包、參與活動、加入公會與管理個人資料。</Text>
            <Button onPress={() => router.push('/auth/login')}>前往登入</Button>
          </View>
        </Card>
      )}
    </Screen>
  )
}
