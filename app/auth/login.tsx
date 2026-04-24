import { useState } from 'react'
import { Link, router } from 'expo-router'
import { Text, View } from 'react-native'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Screen } from '@/components/common/screen'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/hooks/use-auth'
import { demoUsers } from '@/lib/supabase/mock-data'

const loginSchema = z.object({
  email: z.string().email('Email 格式不正確'),
  password: z.string().min(6, '密碼至少 6 碼'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginScreen() {
  const { signIn, loading, isDemoMode } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'tom@sportrip.app', password: 'password123' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null)
      await signIn(values.email, values.password)
      router.replace('/(tabs)')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '登入失敗')
    }
  })

  return (
    <Screen className="justify-center" contentClassName="flex-1 justify-center gap-6">
      <View className="gap-2">
        <Text className="text-3xl font-semibold text-black dark:text-white">登入 Sportrip</Text>
        <Text className="text-base text-grey-500 dark:text-grey-400">Phase 1 先支援 Email + 密碼，Supabase 未設 env 時會進 demo mode。</Text>
      </View>

      <Card>
        <View className="gap-4">
          <Controller control={control} name="email" render={({ field }) => (
            <Input label="Email" value={field.value} onChangeText={field.onChange} error={errors.email?.message} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" />
          )} />
          <Controller control={control} name="password" render={({ field }) => (
            <Input label="密碼" value={field.value} onChangeText={field.onChange} error={errors.password?.message} secureTextEntry textContentType="password" autoComplete="password" />
          )} />
          {error ? <Text className="text-sm text-accent-700">{error}</Text> : null}
          {isDemoMode ? (
            <View className="gap-2 rounded-xl bg-grey-100 p-3 dark:bg-grey-800">
              <Text className="text-sm font-medium text-black dark:text-white">目前使用 demo auth，僅接受以下帳號</Text>
              {demoUsers.map((item) => (
                <Text key={item.id} className="text-sm text-grey-600 dark:text-grey-300">• {item.email} ({item.role === 'platform_admin' ? 'platform admin' : item.role === 'guild_owner' ? 'guild owner' : 'member'})</Text>
              ))}
              <Text className="text-sm text-accent-600">demo 密碼：password123</Text>
            </View>
          ) : null}
          <Button onPress={onSubmit}>登入</Button>
        </View>
      </Card>

      <Divider text="或" />

      <View className="gap-3">
        <Link href="/auth/register" asChild>
          <Button variant="outline" onPress={() => {}}>建立新帳號</Button>
        </Link>
        <Link href="/auth/forgot-password" asChild>
          <Button variant="ghost" onPress={() => {}}>忘記密碼</Button>
        </Link>
      </View>
    </Screen>
  )
}
