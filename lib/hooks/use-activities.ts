import { useQuery } from '@tanstack/react-query'
import { getActivities, getActivityById, getActivityRegistration } from '@/lib/supabase/services'

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

export function useActivityRegistration(activityId?: string, userId?: string) {
  return useQuery({
    queryKey: ['activity-registration', activityId, userId],
    queryFn: () => getActivityRegistration(activityId!, userId!),
    enabled: Boolean(activityId && userId),
  })
}
