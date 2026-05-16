create or replace function public.award_profile_xp(xp_delta integer)
returns integer
language plpgsql
set search_path = public
as $$
declare
  bounded_delta integer := least(greatest(coalesce(xp_delta, 0), 0), 1000);
  next_xp integer;
begin
  update public.user_profiles
  set xp = xp + bounded_delta
  where user_id = (select auth.uid())
  returning xp into next_xp;

  return next_xp;
end;
$$;

revoke all on function public.award_profile_xp(integer) from public;
grant execute on function public.award_profile_xp(integer) to authenticated;
