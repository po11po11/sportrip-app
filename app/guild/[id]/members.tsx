import { useLocalSearchParams } from 'expo-router'
import { StubScreen } from '@/components/common/stub-screen'

export default function GuildMembersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <StubScreen title="公會成員" description={`公會 ${id} 的完整成員列表 Phase 2 再補，這版先保留路由與入口。`} />
}
