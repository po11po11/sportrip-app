import type { Session } from '@supabase/supabase-js'
import type { Activity, Guild, UserProfile, WalletTransaction } from '@/lib/types'
import { demoActivities, demoGuilds, demoTransactions, demoUsers, demoWallet } from './mock-data'
import { supabase } from './client'
import { hasSupabaseEnv } from './env'

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase env 尚未設定，目前為 demo mode')
  }
  return supabase
}

export async function signInWithEmail(email: string, password: string) {
  if (!hasSupabaseEnv) {
    const user = demoUsers.find((item) => item.email === email) ?? demoUsers[0]
    return { session: { user } as unknown as Session, profile: user, isDemo: true }
  }

  const client = ensureSupabase()
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error) throw error

  const profile = await getProfile(data.user.id)
  return { session: data.session, profile, isDemo: false }
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  if (!hasSupabaseEnv) {
    const user: UserProfile = {
      id: `demo-${Date.now()}`,
      email,
      name,
      username: email.split('@')[0],
      verified: false,
      level: 1,
    }
    return { session: { user } as unknown as Session, profile: user, isDemo: true }
  }

  const client = ensureSupabase()
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })
  if (error) throw error

  if (data.user) {
    await client.from('users').upsert({
      id: data.user.id,
      email,
      name,
      username: email.split('@')[0],
    })
  }

  const profile = data.user ? await getProfile(data.user.id) : null
  return { session: data.session, profile, isDemo: false }
}

export async function signOutSession() {
  if (!hasSupabaseEnv) return
  const client = ensureSupabase()
  const { error } = await client.auth.signOut()
  if (error) throw error
}

export async function getCurrentSession() {
  if (!hasSupabaseEnv) return null
  const client = ensureSupabase()
  const { data } = await client.auth.getSession()
  return data.session
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (!hasSupabaseEnv) {
    return demoUsers.find((item) => item.id === userId) ?? null
  }

  const client = ensureSupabase()
  const { data, error } = await client.from('users').select('*').eq('id', userId).single()
  if (error) throw error
  return data as UserProfile
}

export async function getGuilds(): Promise<Guild[]> {
  if (!hasSupabaseEnv) return demoGuilds

  const client = ensureSupabase()
  const [{ data: guildRows, error: guildError }, { data: tagRows, error: tagError }] = await Promise.all([
    client.from('guilds').select('*').eq('status', 'approved').order('member_count', { ascending: false }),
    client.from('guild_tags').select('guild_id, tag'),
  ])

  if (guildError) throw guildError
  if (tagError) throw tagError

  const tagsByGuild = new Map<string, string[]>()
  for (const row of tagRows ?? []) {
    const bucket = tagsByGuild.get(row.guild_id) ?? []
    bucket.push(row.tag)
    tagsByGuild.set(row.guild_id, bucket)
  }

  return (guildRows ?? []).map((guild) => ({
    ...(guild as Guild),
    tags: tagsByGuild.get(guild.id) ?? [],
  }))
}

export async function getGuildById(id: string): Promise<Guild | null> {
  if (!hasSupabaseEnv) return demoGuilds.find((item) => item.id === id) ?? null

  const client = ensureSupabase()
  const { data: guild, error } = await client.from('guilds').select('*').eq('id', id).single()
  if (error) throw error
  const { data: tags } = await client.from('guild_tags').select('tag').eq('guild_id', id)
  return {
    ...(guild as Guild),
    tags: tags?.map((item) => item.tag) ?? [],
  }
}

export async function getActivities(): Promise<Activity[]> {
  if (!hasSupabaseEnv) return demoActivities

  const client = ensureSupabase()
  const { data, error } = await client
    .from('events')
    .select('*, guild:guilds(id, name, logo_url, location), registrations:event_registrations(count)')
    .in('status', ['open', 'full'])
    .order('start_time', { ascending: true })

  if (error) throw error

  return (data ?? []).map((item: any) => ({
    ...(item as Activity),
    guild: item.guild,
    registration_count: item.registrations?.[0]?.count ?? 0,
  }))
}

export async function getActivityById(id: string): Promise<Activity | null> {
  if (!hasSupabaseEnv) return demoActivities.find((item) => item.id === id) ?? null

  const client = ensureSupabase()
  const { data, error } = await client
    .from('events')
    .select('*, guild:guilds(id, name, logo_url, location), registrations:event_registrations(count)')
    .eq('id', id)
    .single()

  if (error) throw error

  return {
    ...(data as Activity),
    guild: (data as any).guild,
    registration_count: (data as any).registrations?.[0]?.count ?? 0,
  }
}

export async function joinGuild(guildId: string, userId: string) {
  if (!hasSupabaseEnv) return { success: true, isDemo: true, guildId, userId }

  const client = ensureSupabase()
  const { error } = await client.from('guild_members').insert({ guild_id: guildId, user_id: userId })
  if (error) throw error
  return { success: true, isDemo: false }
}

export async function getWalletTransactions(userId: string): Promise<{ balance: number; transactions: WalletTransaction[] }> {
  if (!hasSupabaseEnv) {
    return { balance: demoWallet.balance, transactions: demoTransactions }
  }

  const client = ensureSupabase()
  const { data: wallet, error: walletError } = await client.from('wallets').select('*').eq('user_id', userId).single()
  if (walletError) throw walletError

  const { data: transactions, error: txError } = await client
    .from('wallet_transactions')
    .select('*')
    .eq('wallet_id', wallet.id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (txError) throw txError

  return {
    balance: Number(wallet.balance ?? 0),
    transactions: (transactions ?? []) as WalletTransaction[],
  }
}
