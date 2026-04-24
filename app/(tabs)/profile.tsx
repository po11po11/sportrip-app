import { Redirect, router } from 'expo-router'
import { ChevronRight, LogOut, ShieldCheck, UserCircle2 } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import { Screen } from '@/components/common/screen'
import { Header } from '@/components/ui/header'
import { Avatar } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks/use-auth'

const baseMenu = [
  { label: '編輯個人資料', href: '/profile/edit' },
  { label: '運動履歷', href: '/profile/achievements' },
  { label: '設定', href: '/profile/settings' },
  { label: '實名認證', href: '/profile/verify' },
]

export default function ProfileScreen() {
  const { initialized, user, signOut, isDemoMode } = useAuth()

  if (!initialized) return null
  if (!user) return <Redirect href="/auth/login" />

  const menu = [
    ...baseMenu,
    ...(user.role === 'guild_owner' ? [{ label: '公會主後台', href: '/guild-admin' }] : []),
    ...(user.role === 'platform_admin' ? [{ label: '平台管理後台', href: '/platform-admin' }] : []),
  ]

  return (
    <Screen>
      <Header title="我的" />
      <>
        <Card>
          <View className="flex-row items-center gap-4">
            <Avatar name={user.name ?? user.email} size="lg" verified={user.verified} />
            <View className="flex-1 gap-1">
              <Text className="text-xl font-semibold text-black dark:text-white">{user.name ?? user.email}</Text>
              <Text className="text-sm text-grey-500 dark:text-grey-400">@{user.username ?? user.email.split('@')[0]}</Text>
              <View className="flex-row items-center gap-2">
                <ShieldCheck size={16} color={user.verified ? '#EA580C' : '#737373'} />
                <Text className="text-sm text-grey-500 dark:text-grey-400">{user.verified ? '已完成認證' : '尚未認證'}</Text>
              </View>
              <Text className="text-sm text-grey-500 dark:text-grey-400">角色：{user.role === 'platform_admin' ? '平台管理員' : user.role === 'guild_owner' ? '公會主' : '會員'}</Text>
              {isDemoMode ? <Text className="text-sm text-accent-600">目前為 demo mode，資料不會寫入雲端。</Text> : null}
            </View>
          </View>
        </Card>

        <View className="gap-3">
          {menu.map((item) => (
            <Pressable key={item.href} onPress={() => router.push(item.href as never)} accessibilityRole="button" accessibilityLabel={item.label}>
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

        <Button variant="outline" color="secondary" onPress={async () => { await signOut(); router.replace('/auth/login') }} icon={<LogOut size={18} color="#737373" />}>
          登出
        </Button>
      </>
    </Screen>
  )
}
