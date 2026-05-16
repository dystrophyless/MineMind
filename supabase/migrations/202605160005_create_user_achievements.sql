create table public.user_achievements (
  user_id uuid not null references public.user_profiles(user_id) on delete cascade,
  achievement_key text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_key)
);

alter table public.user_achievements enable row level security;

create policy "users can read own achievements"
  on public.user_achievements for select
  using (user_id = auth.uid());

create policy "users can insert own achievements"
  on public.user_achievements for insert
  with check (user_id = auth.uid());
