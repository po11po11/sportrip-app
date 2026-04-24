import { useLocalSearchParams } from 'expo-router'
import { StubScreen } from '@/components/common/stub-screen'

export default function PlatformAdminGuildDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <StubScreen title="公會審核詳情" description={`公會 ${id} 的平台審核頁 Phase 2 再補。`} />
}
