import { PropsWithChildren, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'
import { useAuthStore } from '@/lib/state/auth-store'

const queryClient = new QueryClient()

export function AppProviders({ children }: PropsWithChildren) {
  const initialize = useAuthStore((state) => state.initialize)
  const colorScheme = useColorScheme()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <GestureHandlerRootView style={{ flex: 1 }} className={colorScheme === 'dark' ? 'dark' : ''}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
