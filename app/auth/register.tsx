import { useState } from 'react'
import { Link, router } from 'expo-router'
import { Text, View } from 'react-native'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Screen } from '@/components/common/screen'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks/use-auth'

const registerSchema = z.object({
  name: z.string().min(2, '至少 2 個字'),
  email: z.string().email('Email 格式不正確'),
  password: z.string().min(6, '密碼至少 6 碼'),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterScreen() {
  const { signUp, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null)
      await signUp(values.name, values.email, values.password)
      router.replace('/(tabs)')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '註冊失敗')
    }
  })

  return (
    <Screen className="justify-center" contentClassName="flex-1 justify-center gap-6">
      <View className="gap-2">
        <Text className="text-3xl font-semibold text-black dark:text-white">建立帳號</Text>
        <Text className="text-base text-grey-500 dark:text-grey-400">先完成 MVP 所需的 Email 註冊，其他 onboarding 之後補。</Text>
      </View>
      <Card>
        <View className="gap-4">
          <Controller control={control} name="name" render={({ field }) => (
            <Input label="名稱" value={field.value} onChangeText={field.onChange} error={errors.name?.message} />
          )} />
          <Controller control={control} name="email" render={({ field }) => (
            <Input label="Email" value={field.value} onChangeText={field.onChange} error={errors.email?.message} keyboardType="email-address" />
          )} />
          <Controller control={control} name="password" render={({ field }) => (
            <Input label="密碼" value={field.value} onChangeText={field.onChange} error={errors.password?.message} secureTextEntry />
          )} />
          {error ? <Text className="text-sm text-error">{error}</Text> : null}
          <Button onPress={onSubmit} loading={loading}>註冊</Button>
        </View>
      </Card>
      <Link href="/auth/login" asChild>
        <Button variant="ghost" onPress={() => {}}>已有帳號，返回登入</Button>
      </Link>
    </Screen>
  )
}
