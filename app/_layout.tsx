import '../global.css'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Text } from 'react-native'
import { useFonts } from 'expo-font'
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter'
import { NotoSansTC_400Regular, NotoSansTC_500Medium, NotoSansTC_700Bold } from '@expo-google-fonts/noto-sans-tc'
import { AppProviders } from '@/components/common/app-providers'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    NotoSansTC_400Regular,
    NotoSansTC_500Medium,
    NotoSansTC_700Bold,
  })

  if (!fontsLoaded) {
    return <Text style={{ padding: 24 }}>Loading Sportrip...</Text>
  }

  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FAFAFA' } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppProviders>
  )
}
