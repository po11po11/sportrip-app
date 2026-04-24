export type SportTag = '跑步' | '單車' | '健身' | '游泳' | '登山' | '瑜珈'

export interface UserProfile {
  id: string
  email: string
  role?: 'member' | 'guild_owner' | 'platform_admin'
  username?: string | null
  name?: string | null
  avatar_url?: string | null
  phone?: string | null
  bio?: string | null
  level?: number
  verified?: boolean
  verified_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface Guild {
  id: string
  owner_id: string
  name: string
  slug: string
  description?: string | null
  cover_image?: string | null
  logo_url?: string | null
  location?: string | null
  member_count: number
  rating: number
  review_count: number
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  created_at?: string
  updated_at?: string
  tags?: string[]
  is_member?: boolean
}

export interface GuildMember {
  id: string
  guild_id: string
  user_id: string
  role: 'owner' | 'member'
  joined_at?: string
  user?: UserProfile
}

export interface Activity {
  id: string
  guild_id: string
  title: string
  description?: string | null
  cover_image?: string | null
  event_type: string
  start_time: string
  end_time?: string | null
  location: string
  max_participants: number
  price: number
  registration_deadline?: string | null
  status: 'open' | 'full' | 'closed' | 'cancelled'
  members_only?: boolean
  verified_only?: boolean
  created_at?: string
  updated_at?: string
  guild?: Pick<Guild, 'id' | 'name' | 'logo_url' | 'location'>
  registration_count?: number
}

export interface ActivityRegistration {
  id: string
  event_id: string
  user_id: string
  status: 'confirmed' | 'cancelled' | 'attended' | 'no_show'
  payment_status: 'pending' | 'paid' | 'refunded'
  paid_amount?: number | null
  registered_at?: string
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  created_at?: string
  updated_at?: string
}

export interface WalletTransaction {
  id: string
  wallet_id: string
  type: 'topup' | 'payment' | 'refund' | 'reward' | 'withdrawal'
  amount: number
  balance_after: number
  description?: string | null
  created_at?: string
}
