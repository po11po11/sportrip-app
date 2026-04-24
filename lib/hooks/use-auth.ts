import { useAuthStore } from '@/lib/state/auth-store'

export function useAuth() {
  return useAuthStore()
}
