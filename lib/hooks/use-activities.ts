import { useQuery } from '@tanstack/react-query'
import { getActivities, getActivityById } from '@/lib/supabase/services'

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
  })
}

export function useActivity(id: string) {
  return useQuery({
    queryKey: ['activity', id],
    queryFn: () => getActivityById(id),
    enabled: Boolean(id),
  })
}
