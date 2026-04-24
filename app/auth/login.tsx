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
            <Input label="Email" value={field.value} onChangeText={field.onChange} error={errors.email?.message} keyboardType="email-address" />
          )} />
          <Controller control={control} name="password" render={({ field }) => (
            <Input label="密碼" value={field.value} onChangeText={field.onChange} error={errors.password?.message} secureTextEntry />
          )} />
          {error ? <Text className="text-sm text-error">{error}</Text> : null}
          {isDemoMode ? <Text className="text-sm text-accent-600">目前使用 demo auth，可直接登入預設帳號。</Text> : null}
          <Button onPress={onSubmit} loading={loading}>登入</Button>
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
