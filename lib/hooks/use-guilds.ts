import { useQuery } from '@tanstack/react-query'
import { getGuildById, getGuilds } from '@/lib/supabase/services'

export function useGuilds() {
  return useQuery({
    queryKey: ['guilds'],
    queryFn: getGuilds,
  })
}

export function useGuild(id: string) {
  return useQuery({
    queryKey: ['guild', id],
    queryFn: () => getGuildById(id),
    enabled: Boolean(id),
  })
}
