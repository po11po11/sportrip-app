import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@/lib/hooks/use-auth'

export default function GuildAdminLayout() {
  const { initialized, user } = useAuth()

  if (!initialized) return null
  if (!user) return <Redirect href="/auth/login" />
  if (user.role !== 'guild_owner') return <Redirect href="/(tabs)/profile" />

  return <Stack screenOptions={{ headerShown: false }} />
}
