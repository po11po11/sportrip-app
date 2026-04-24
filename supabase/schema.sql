create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  username text unique,
  name text,
  avatar_url text,
  phone text,
  bio text,
  level int default 1,
  verified boolean default false,
  verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.guilds (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text,
  cover_image text,
  logo_url text,
  location text,
  member_count int default 0,
  rating numeric(2,1) default 0.0,
  review_count int default 0,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_guilds_owner on public.guilds(owner_id);
create index if not exists idx_guilds_status on public.guilds(status);

create table if not exists public.guild_members (
  id uuid primary key default gen_random_uuid(),
  guild_id uuid not null references public.guilds(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz default now(),
  unique (guild_id, user_id)
);
create index if not exists idx_guild_members_guild on public.guild_members(guild_id);
create index if not exists idx_guild_members_user on public.guild_members(user_id);

create table if not exists public.guild_tags (
  id uuid primary key default gen_random_uuid(),
  guild_id uuid not null references public.guilds(id) on delete cascade,
  tag text not null,
  created_at timestamptz default now()
);
create index if not exists idx_guild_tags_guild on public.guild_tags(guild_id);
create index if not exists idx_guild_tags_tag on public.guild_tags(tag);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  guild_id uuid not null references public.guilds(id) on delete cascade,
  title text not null,
  description text,
  cover_image text,
  event_type text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  location text not null,
  max_participants int not null,
  price numeric(10,2) default 0,
  registration_deadline timestamptz,
  status text default 'open' check (status in ('open', 'full', 'closed', 'cancelled')),
  members_only boolean default false,
  verified_only boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_events_guild on public.events(guild_id);
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_events_start_time on public.events(start_time);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  status text default 'confirmed' check (status in ('confirmed', 'cancelled', 'attended', 'no_show')),
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  paid_amount numeric(10,2),
  registered_at timestamptz default now(),
  unique (event_id, user_id)
);
create index if not exists idx_event_registrations_event on public.event_registrations(event_id);
create index if not exists idx_event_registrations_user on public.event_registrations(user_id);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  balance numeric(10,2) default 0 check (balance >= 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  type text not null check (type in ('topup', 'payment', 'refund', 'reward', 'withdrawal')),
  amount numeric(10,2) not null,
  balance_after numeric(10,2) not null,
  description text,
  reference_id uuid,
  created_at timestamptz default now()
);
create index if not exists idx_wallet_transactions_wallet on public.wallet_transactions(wallet_id);
create index if not exists idx_wallet_transactions_type on public.wallet_transactions(type);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  badge_type text not null,
  earned_at timestamptz default now()
);
create index if not exists idx_achievements_user on public.achievements(user_id);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  guild_id uuid references public.guilds(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);
create index if not exists idx_reviews_guild on public.reviews(guild_id);
create index if not exists idx_reviews_event on public.reviews(event_id);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.users(id) on delete set null,
  target_type text not null check (target_type in ('user', 'guild', 'event')),
  target_id uuid not null,
  reason text not null,
  description text,
  status text default 'pending' check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at timestamptz default now(),
  resolved_at timestamptz
);
create index if not exists idx_reports_status on public.reports(status);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references public.users(id) on delete cascade,
  invitee_id uuid not null references public.users(id) on delete cascade,
  reward_amount numeric(10,2) default 50,
  status text default 'pending' check (status in ('pending', 'rewarded', 'expired')),
  created_at timestamptz default now(),
  unique (inviter_id, invitee_id)
);

create table if not exists public.user_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  sport text not null,
  created_at timestamptz default now(),
  unique (user_id, sport)
);

create trigger set_updated_at_users before update on public.users for each row execute function public.set_updated_at();
create trigger set_updated_at_guilds before update on public.guilds for each row execute function public.set_updated_at();
create trigger set_updated_at_events before update on public.events for each row execute function public.set_updated_at();
create trigger set_updated_at_wallets before update on public.wallets for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.guilds enable row level security;
alter table public.guild_members enable row level security;
alter table public.guild_tags enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.achievements enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;
alter table public.referrals enable row level security;
alter table public.user_interests enable row level security;

create policy "users are publicly readable" on public.users for select using (true);
create policy "users can update self" on public.users for update using (auth.uid() = id);

create policy "approved guilds are publicly readable" on public.guilds for select using (status = 'approved' or owner_id = auth.uid());
create policy "verified users can create guilds" on public.guilds for insert with check (
  exists (select 1 from public.users where id = auth.uid() and verified = true)
);
create policy "guild owners can update guilds" on public.guilds for update using (owner_id = auth.uid());

create policy "guild membership readable" on public.guild_members for select using (true);
create policy "users can join guilds" on public.guild_members for insert with check (user_id = auth.uid());
create policy "users can leave own memberships" on public.guild_members for delete using (user_id = auth.uid());

create policy "guild tags readable" on public.guild_tags for select using (true);
create policy "guild owners manage tags" on public.guild_tags for all using (
  exists (select 1 from public.guilds where guilds.id = guild_id and guilds.owner_id = auth.uid())
);

create policy "events publicly readable" on public.events for select using (status in ('open', 'full', 'closed'));
create policy "guild owners create events" on public.events for insert with check (
  exists (select 1 from public.guilds where guilds.id = guild_id and guilds.owner_id = auth.uid())
);
create policy "guild owners update events" on public.events for update using (
  exists (select 1 from public.guilds where guilds.id = guild_id and guilds.owner_id = auth.uid())
);

create policy "registrations viewable by self or guild owner" on public.event_registrations for select using (
  user_id = auth.uid() or exists (
    select 1 from public.events e
    join public.guilds g on g.id = e.guild_id
    where e.id = event_id and g.owner_id = auth.uid()
  )
);
create policy "users register themselves" on public.event_registrations for insert with check (user_id = auth.uid());
create policy "users update own registrations" on public.event_registrations for update using (user_id = auth.uid());

create policy "wallet owner reads wallet" on public.wallets for select using (user_id = auth.uid());
create policy "wallet owner reads transactions" on public.wallet_transactions for select using (
  exists (select 1 from public.wallets where wallets.id = wallet_id and wallets.user_id = auth.uid())
);

create policy "users read achievements" on public.achievements for select using (user_id = auth.uid());
create policy "reviews readable" on public.reviews for select using (true);
create policy "users can create reviews" on public.reviews for insert with check (user_id = auth.uid());
create policy "users create reports" on public.reports for insert with check (reporter_id = auth.uid());
create policy "users read own referrals" on public.referrals for select using (inviter_id = auth.uid() or invitee_id = auth.uid());
create policy "users read own interests" on public.user_interests for select using (user_id = auth.uid());
create policy "users manage own interests" on public.user_interests for all using (user_id = auth.uid());
