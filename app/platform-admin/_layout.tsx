import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@/lib/hooks/use-auth'

export default function PlatformAdminLayout() {
  const { initialized, user } = useAuth()

  if (!initialized) return null
  if (!user) return <Redirect href="/auth/login" />
  if (user.role !== 'platform_admin') return <Redirect href="/(tabs)/profile" />

  return <Stack screenOptions={{ headerShown: false }} />
}
