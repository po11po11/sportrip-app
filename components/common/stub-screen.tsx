import { Text, View } from 'react-native'
import { Screen } from './screen'
import { Header } from '@/components/ui/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type StubScreenProps = {
  title: string
  description: string
  ctaLabel?: string
}

export function StubScreen({ title, description, ctaLabel = 'Phase 2 TODO' }: StubScreenProps) {
  return (
    <Screen>
      <Header title={title} />
      <Card>
        <View className="gap-3">
          <Text className="font-semibold text-2xl text-black dark:text-white">{title}</Text>
          <Text className="text-base leading-6 text-grey-600 dark:text-grey-400">{description}</Text>
          <Button variant="outline" onPress={() => {}}>
            {ctaLabel}
          </Button>
        </View>
      </Card>
    </Screen>
  )
}
