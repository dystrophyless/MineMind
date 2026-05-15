insert into public.user_profiles (user_id, username, city, member_since)
select
  users.id,
  'player_' || substr(replace(users.id::text, '-', ''), 1, 8),
  'Almaty',
  coalesce(users.created_at, now())
from auth.users as users
where not exists (
  select 1
  from public.user_profiles as profiles
  where profiles.user_id = users.id
)
on conflict (user_id) do nothing;

alter table public.game_attempts
  drop constraint if exists game_attempts_user_profile_fkey;

alter table public.game_attempts
  add constraint game_attempts_user_profile_fkey
  foreign key (user_id)
  references public.user_profiles(user_id)
  on delete cascade;

alter table public.daily_challenge_attempts
  drop constraint if exists daily_challenge_attempts_user_profile_fkey;

alter table public.daily_challenge_attempts
  add constraint daily_challenge_attempts_user_profile_fkey
  foreign key (user_id)
  references public.user_profiles(user_id)
  on delete cascade;
