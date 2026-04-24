import type { Session } from '@supabase/supabase-js'
import type { Activity, ActivityRegistration, Guild, UserProfile, Wallet, WalletTransaction } from '@/lib/types'
import { demoActivities, demoGuilds, demoTransactions, demoUsers, demoWallet } from './mock-data'
import { supabase } from './client'
import { hasSupabaseEnv } from './env'

const DEMO_PASSWORD = 'password123'

type RegistrationRpcResult = {
  registration_id: string
  registration_count: number
  balance_after: number
  event_status: Activity['status']
}

const demoState = {
  activities: demoActivities.map((activity) => ({ ...activity })),
  registrations: [
    {
      id: 'r1111111-1111-1111-1111-111111111111',
      event_id: 'b1111111-1111-1111-1111-111111111111',
      user_id: '11111111-1111-1111-1111-111111111111',
      status: 'confirmed',
      payment_status: 'paid',
      paid_amount: 100,
      registered_at: '2026-04-24T15:30:00+08:00',
    },
    {
      id: 'r2222222-2222-2222-2222-222222222222',
      event_id: 'b1111111-1111-1111-1111-111111111111',
      user_id: '22222222-2222-2222-2222-222222222222',
      status: 'confirmed',
      payment_status: 'paid',
      paid_amount: 100,
      registered_at: '2026-04-24T16:00:00+08:00',
    },
    {
      id: 'r3333333-3333-3333-3333-333333333333',
      event_id: 'b2222222-2222-2222-2222-222222222222',
      user_id: '33333333-3333-3333-3333-333333333333',
      status: 'confirmed',
      payment_status: 'paid',
      paid_amount: 200,
      registered_at: '2026-04-24T16:30:00+08:00',
    },
    {
      id: 'r4444444-4444-4444-4444-444444444444',
      event_id: 'b3333333-3333-3333-3333-333333333333',
      user_id: '11111111-1111-1111-1111-111111111111',
      status: 'confirmed',
      payment_status: 'paid',
      paid_amount: 0,
      registered_at: '2026-04-24T17:00:00+08:00',
    },
  ] as ActivityRegistration[],
  walletByUserId: new Map<string, Wallet>([[demoWallet.user_id, { ...demoWallet }]]),
  transactionsByWalletId: new Map<string, WalletTransaction[]>([[demoWallet.id, demoTransactions.map((item) => ({ ...item }))]]),
}

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase env 尚未設定，目前為 demo mode')
  }
  return supabase
}

function cloneActivity(activity: Activity): Activity {
  return {
    ...activity,
    guild: activity.guild ? { ...activity.guild } : activity.guild,
  }
}

function syncDemoActivityRegistrationCount(eventId: string) {
  const activity = demoState.activities.find((item) => item.id === eventId)
  if (!activity) return

  const registrationCount = demoState.registrations.filter((item) => item.event_id === eventId && item.status === 'confirmed').length
  activity.registration_count = registrationCount
  activity.status = registrationCount >= activity.max_participants ? 'full' : 'open'
}

function getOrCreateDemoWallet(userId: string) {
  const existing = demoState.walletByUserId.get(userId)
  if (existing) return existing

  const wallet: Wallet = {
    id: `wallet-${userId}`,
    user_id: userId,
    balance: 1000,
  }
  demoState.walletByUserId.set(userId, wallet)
  demoState.transactionsByWalletId.set(wallet.id, [])
  return wallet
}

function toAppErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : '報名失敗，請稍後再試'
  switch (message) {
    case 'ALREADY_REGISTERED':
      return '你已經報名這場活動了'
    case 'EVENT_NOT_FOUND':
      return '找不到活動資料'
    case 'REGISTRATION_CLOSED':
      return '報名已截止'
    case 'EVENT_FULL':
      return '活動名額已滿'
    case 'INSUFFICIENT_BALANCE':
      return '錢包餘額不足'
    case 'UNAUTHORIZED':
      return '請先登入後再報名'
    default:
      return message
  }
}

export async function signInWithEmail(email: string, password: string) {
  if (!hasSupabaseEnv) {
    const user = demoUsers.find((item) => item.email === email)
    if (!user) throw new Error('Demo 帳號不存在')
    if (password !== DEMO_PASSWORD) throw new Error('Demo 密碼錯誤，請使用指定測試帳號')
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
      role: 'member',
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
      role: 'member',
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
  if (!hasSupabaseEnv) return demoGuilds.map((guild) => ({ ...guild, tags: guild.tags ? [...guild.tags] : guild.tags }))

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
  if (!hasSupabaseEnv) {
    const guild = demoGuilds.find((item) => item.id === id)
    return guild ? { ...guild, tags: guild.tags ? [...guild.tags] : guild.tags } : null
  }

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
  if (!hasSupabaseEnv) return demoState.activities.map(cloneActivity)

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
  if (!hasSupabaseEnv) {
    const activity = demoState.activities.find((item) => item.id === id)
    return activity ? cloneActivity(activity) : null
  }

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

export async function getActivityRegistration(activityId: string, userId: string): Promise<ActivityRegistration | null> {
  if (!hasSupabaseEnv) {
    const registration = demoState.registrations.find((item) => item.event_id === activityId && item.user_id === userId)
    return registration ? { ...registration } : null
  }

  const client = ensureSupabase()
  const { data, error } = await client
    .from('event_registrations')
    .select('*')
    .eq('event_id', activityId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return (data as ActivityRegistration | null) ?? null
}

export async function registerForActivity(activityId: string, userId: string) {
  if (!hasSupabaseEnv) {
    const activity = demoState.activities.find((item) => item.id === activityId)
    if (!activity) throw new Error('EVENT_NOT_FOUND')

    const existing = demoState.registrations.find((item) => item.event_id === activityId && item.user_id === userId)
    if (existing) throw new Error('ALREADY_REGISTERED')

    const confirmedCount = demoState.registrations.filter((item) => item.event_id === activityId && item.status === 'confirmed').length
    if (confirmedCount >= activity.max_participants) throw new Error('EVENT_FULL')

    const wallet = getOrCreateDemoWallet(userId)
    const price = Number(activity.price ?? 0)
    if (wallet.balance < price) throw new Error('INSUFFICIENT_BALANCE')

    wallet.balance -= price

    // MVP: demo mode mirrors production by creating confirmed registrations immediately because the schema has no pending_payment status.
    const registration: ActivityRegistration = {
      id: `demo-registration-${Date.now()}`,
      event_id: activityId,
      user_id: userId,
      status: 'confirmed',
      payment_status: 'paid',
      paid_amount: price,
      registered_at: new Date().toISOString(),
    }
    demoState.registrations.unshift(registration)

    const transactions = demoState.transactionsByWalletId.get(wallet.id) ?? []
    transactions.unshift({
      id: `demo-tx-${Date.now()}`,
      wallet_id: wallet.id,
      type: 'payment',
      amount: -price,
      balance_after: wallet.balance,
      description: `報名：${activity.title}`,
      created_at: new Date().toISOString(),
    })
    demoState.transactionsByWalletId.set(wallet.id, transactions)

    syncDemoActivityRegistrationCount(activityId)

    return {
      registration,
      registrationCount: demoState.activities.find((item) => item.id === activityId)?.registration_count ?? confirmedCount + 1,
      balanceAfter: wallet.balance,
      isDemo: true,
    }
  }

  const client = ensureSupabase()
  const { data, error } = await client.rpc('register_for_event', { p_event_id: activityId })

  if (error) throw new Error(toAppErrorMessage(error))

  const rpcData = data as RegistrationRpcResult | null
  const registration = await getActivityRegistration(activityId, userId)
  if (!registration || !rpcData) {
    throw new Error('報名成功，但無法讀取最新資料，請重新整理確認')
  }

  return {
    registration,
    registrationCount: rpcData.registration_count,
    balanceAfter: rpcData.balance_after,
    isDemo: false,
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
    const wallet = getOrCreateDemoWallet(userId)
    const transactions = demoState.transactionsByWalletId.get(wallet.id) ?? []
    return { balance: wallet.balance, transactions: transactions.map((item) => ({ ...item })) }
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

export { toAppErrorMessage }
