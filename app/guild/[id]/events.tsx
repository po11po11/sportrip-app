import { useLocalSearchParams } from 'expo-router'
import { StubScreen } from '@/components/common/stub-screen'

export default function GuildEventsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <StubScreen title="公會活動" description={`公會 ${id} 的活動列表 Phase 2 可做完整分頁與篩選，這版先導回詳情頁中的活動摘要。`} />
}
