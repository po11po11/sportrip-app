import { useQuery } from '@tanstack/react-query'
import { getWalletTransactions } from '@/lib/supabase/services'

export function useWallet(userId?: string) {
  return useQuery({
    queryKey: ['wallet', userId],
    queryFn: () => getWalletTransactions(userId!),
    enabled: Boolean(userId),
  })
}
