import { useLocalSearchParams } from 'expo-router'
import { StubScreen } from '@/components/common/stub-screen'

export default function ActivityParticipantsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <StubScreen title="參與者列表" description={`活動 ${id} 參與者名單這版先保留路由，之後補公會主檢視與名單管理。`} />
}
