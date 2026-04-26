import { Slot, Tabs } from 'expo-router'
import { Compass, Users, CalendarDays, Wallet, User } from 'lucide-react-native'
import { useResponsive } from '@/lib/hooks/use-responsive'

const tabs = {
  index: { title: '探索', icon: Compass },
  guilds: { title: '公會', icon: Users },
  activities: { title: '活動', icon: CalendarDays },
  wallet: { title: '錢包', icon: Wallet },
  profile: { title: '我的', icon: User },
} as const

export default function TabsLayout() {
  const { showWebShell, isWeb } = useResponsive()

  if (isWeb && showWebShell) {
    return <Slot />
  }

  return (
    <Tabs
      screenOptions={({ route }) => {
        const config = tabs[route.name as keyof typeof tabs]
        return {
          headerShown: false,
          tabBarActiveTintColor: '#EA580C',
          tabBarInactiveTintColor: '#737373',
          tabBarStyle: {
            height: 72,
            paddingTop: 8,
            paddingBottom: 8,
            borderTopColor: '#E5E5E5',
            backgroundColor: '#FFFFFF',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIcon: ({ color, size }) => <config.icon color={color} size={size} />,
          title: config.title,
        }
      }}
    />
  )
}
