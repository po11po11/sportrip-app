import { PropsWithChildren, useMemo, useState } from 'react'
import { Link, usePathname, useRouter } from 'expo-router'
import { Bell, BriefcaseBusiness, CalendarDays, ChevronDown, Compass, CreditCard, LayoutDashboard, Search, ShieldCheck, Users, Wallet } from 'lucide-react-native'
import { Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils/cn'
import { useResponsive } from '@/lib/hooks/use-responsive'
import { useAuth } from '@/lib/hooks/use-auth'
import type { UserProfile } from '@/lib/types'

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; color?: string }>
}

type WebShellProps = PropsWithChildren<{
  title?: string
  subtitle?: string
  headerRight?: React.ReactNode
  contentClassName?: string
}>

const memberItems: NavItem[] = [
  { label: '探索', href: '/(tabs)', icon: Compass },
  { label: '公會', href: '/(tabs)/guilds', icon: Users },
  { label: '活動', href: '/(tabs)/activities', icon: CalendarDays },
  { label: '錢包', href: '/(tabs)/wallet', icon: Wallet },
  { label: '我的', href: '/(tabs)/profile', icon: BriefcaseBusiness },
]

const guildOwnerItems: NavItem[] = [
  { label: '我的公會', href: '/guild-admin', icon: Users },
  { label: '活動管理', href: '/guild-admin/events', icon: CalendarDays },
  { label: '會員管理', href: '/guild-admin/members', icon: Users },
  { label: '數據看板', href: '/guild-admin/dashboard', icon: LayoutDashboard },
]

const platformAdminItems: NavItem[] = [
  { label: '公會審核', href: '/platform-admin/guilds', icon: ShieldCheck },
  { label: '檢舉處理', href: '/platform-admin/reports', icon: Bell },
  { label: '營收看板', href: '/platform-admin/analytics', icon: CreditCard },
]

function getSections(user: UserProfile | null) {
  const role = user?.role ?? 'member'
  return [
    { title: '會員', items: memberItems },
    ...(role === 'guild_owner' || role === 'platform_admin' ? [{ title: '公會主', items: guildOwnerItems }] : []),
    ...(role === 'platform_admin' ? [{ title: '平台管理', items: platformAdminItems }] : []),
  ]
}

export function WebShell({ children, title, subtitle, headerRight, contentClassName }: WebShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const { isDesktop, isTablet } = useResponsive()
  const [menuOpen, setMenuOpen] = useState(false)
  const sections = useMemo(() => getSections(user), [user])

  if (Platform.OS !== 'web' || (!isDesktop && !isTablet)) {
    return <>{children}</>
  }

  const sidebarExpanded = isDesktop
  const sidebarWidth = sidebarExpanded ? 240 : 64

  return (
    <View className="min-h-screen bg-grey-50">
      <View className="fixed inset-x-0 top-0 z-50 h-16 border-b border-grey-200 bg-white">
        <View className="mx-auto flex h-16 max-w-[1600px] flex-row items-center justify-between px-6">
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => router.push('/(tabs)')}>
              <Text className="text-2xl font-bold text-accent-600">Sportrip</Text>
            </Pressable>
            <View className={cn('hidden overflow-hidden rounded-full border border-grey-200 bg-grey-50 px-4', isDesktop ? 'lg:flex w-[400px]' : 'flex w-[300px]')}>
              <View className="flex-row items-center gap-3 py-3">
                <Search size={18} color="#737373" />
                <TextInput placeholder="搜尋公會、活動..." placeholderTextColor="#A3A3A3" className="flex-1 text-sm text-black outline-none" />
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            {headerRight}
            <Pressable onPress={() => router.push('/notifications')} className="h-10 w-10 items-center justify-center rounded-full bg-grey-100">
              <Bell size={18} color="#171717" />
            </Pressable>
            <View className="relative">
              <Pressable onPress={() => setMenuOpen((open) => !open)} className="flex-row items-center gap-2 rounded-full border border-grey-200 bg-white px-2 py-1.5">
                <Avatar name={user?.name ?? user?.email ?? '訪客'} size="sm" verified={user?.verified} />
                {isDesktop ? <Text className="max-w-32 text-sm font-medium text-black">{user?.name ?? '訪客'}</Text> : null}
                <ChevronDown size={16} color="#525252" />
              </Pressable>
              {menuOpen ? (
                <View className="absolute right-0 top-14 w-48 rounded-xl border border-grey-200 bg-white p-2 shadow-sm">
                  <Link href="/(tabs)/profile" asChild>
                    <Pressable className="rounded-lg px-3 py-2"><Text className="text-sm text-black">個人檔案</Text></Pressable>
                  </Link>
                  <Link href="/auth/login" asChild>
                    <Pressable className="rounded-lg px-3 py-2"><Text className="text-sm text-black">切換帳號</Text></Pressable>
                  </Link>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>

      <View className="fixed bottom-0 left-0 top-16 border-r border-grey-200 bg-grey-50" style={{ width: sidebarWidth }}>
        <ScrollView contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 10 }}>
          <View className="gap-5">
            {sections.map((section) => (
              <View key={section.title} className="gap-2">
                {sidebarExpanded ? <Text className="px-3 text-xs font-semibold uppercase tracking-[1px] text-grey-500">{section.title}</Text> : null}
                {section.items.map((item) => {
                  const active = pathname === item.href || (item.href !== '/(tabs)' && pathname.startsWith(item.href))
                  const Icon = item.icon
                  return (
                    <Pressable
                      key={item.href}
                      onPress={() => router.push(item.href as never)}
                      className={cn(
                        'flex-row items-center rounded-xl px-3 py-2.5',
                        active ? 'bg-accent-50' : 'bg-transparent hover:bg-grey-100'
                      )}
                    >
                      <Icon size={20} color={active ? '#EA580C' : '#525252'} />
                      {sidebarExpanded ? <Text className={cn('ml-3 text-sm font-medium', active ? 'text-accent-600' : 'text-grey-700')}>{item.label}</Text> : null}
                    </Pressable>
                  )
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className="min-h-screen" style={{ marginLeft: sidebarWidth, paddingTop: 64 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View className={cn('mx-auto w-full max-w-screen-xl px-6 py-5', isDesktop ? 'lg:px-8 lg:py-6' : '', contentClassName)}>
            {title ? (
              <View className="mb-6 gap-1">
                <Text className="text-3xl font-bold text-black">{title}</Text>
                {subtitle ? <Text className="text-sm text-grey-500">{subtitle}</Text> : null}
              </View>
            ) : null}
            {children}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export function DesktopSectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-xl font-semibold text-black">{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction}><Text className="text-sm font-medium text-accent-600">{actionLabel}</Text></Pressable>
      ) : null}
    </View>
  )
}
