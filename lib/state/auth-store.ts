import { create } from 'zustand'
import type { UserProfile } from '@/lib/types'
import { getCurrentSession, getProfile, signInWithEmail, signOutSession, signUpWithEmail } from '@/lib/supabase/services'

type AuthState = {
  user: UserProfile | null
  loading: boolean
  initialized: boolean
  isDemoMode: boolean
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  isDemoMode: false,
  initialize: async () => {
    set({ loading: true })
    try {
      const session = await getCurrentSession()
      if (session?.user) {
        const profile = await getProfile(session.user.id)
        set({ user: profile, initialized: true, loading: false, isDemoMode: false })
      } else {
        set({ user: null, initialized: true, loading: false })
      }
    } catch {
      set({ user: null, initialized: true, loading: false })
    }
  },
  signIn: async (email, password) => {
    set({ loading: true })
    const result = await signInWithEmail(email, password)
    set({ user: result.profile, loading: false, initialized: true, isDemoMode: result.isDemo })
  },
  signUp: async (name, email, password) => {
    set({ loading: true })
    const result = await signUpWithEmail(email, password, name)
    set({ user: result.profile, loading: false, initialized: true, isDemoMode: result.isDemo })
  },
  signOut: async () => {
    await signOutSession()
    set({ user: null, isDemoMode: false })
  },
}))
