alter table public.game_attempts
  drop constraint if exists game_attempts_user_id_fkey;

alter table public.daily_challenge_attempts
  drop constraint if exists daily_challenge_attempts_user_id_fkey;

alter table public.game_attempts
  drop column if exists difficulty,
  drop column if exists board_date;

alter table public.game_attempts
  drop constraint if exists game_attempts_mode_check;

alter table public.game_attempts
  add constraint game_attempts_mode_check
  check (mode in ('classic', 'noFlags', 'timed'));

alter table public.user_profiles
  alter column username set not null,
  alter column city set not null,
  alter column member_since set not null,
  alter column created_at set not null,
  alter column xp set not null;

alter table public.daily_challenge_attempts
  alter column status set not null,
  alter column started_at set not null;

drop policy if exists "Users can insert their own profile" on public.user_profiles;
create policy "Users can insert their own profile" on public.user_profiles
  for insert with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own profile" on public.user_profiles;
create policy "Users can update their own profile" on public.user_profiles
  for update using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own attempts" on public.game_attempts;
create policy "Users can insert their own attempts" on public.game_attempts
  for insert with check ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own daily attempt" on public.daily_challenge_attempts;
create policy "Users can insert their own daily attempt" on public.daily_challenge_attempts
  for insert with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own daily attempt" on public.daily_challenge_attempts;
create policy "Users can update their own daily attempt" on public.daily_challenge_attempts
  for update using ((select auth.uid()) = user_id);
