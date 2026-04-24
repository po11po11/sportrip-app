import { useLocalSearchParams } from 'expo-router'
import { StubScreen } from '@/components/common/stub-screen'

export default function GuildAdminEditEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <StubScreen title="編輯活動" description={`活動 ${id} 的編輯後台留待 Phase 2。`} />
}
