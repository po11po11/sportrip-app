import { useLocalSearchParams } from 'expo-router'
import { StubScreen } from '@/components/common/stub-screen'

export default function PlatformAdminReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <StubScreen title="檢舉詳情" description={`檢舉 ${id} 的處理頁留待後續。`} />
}
