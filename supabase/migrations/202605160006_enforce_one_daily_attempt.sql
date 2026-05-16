with ranked_daily_attempts as (
  select
    id,
    row_number() over (
      partition by user_id, challenge_date
      order by started_at desc, id desc
    ) as attempt_rank
  from public.daily_challenge_attempts
)
delete from public.daily_challenge_attempts as attempts
using ranked_daily_attempts as ranked
where attempts.id = ranked.id
  and ranked.attempt_rank > 1;

alter table public.daily_challenge_attempts
  drop constraint if exists daily_challenge_attempts_one_attempt_per_day;

alter table public.daily_challenge_attempts
  add constraint daily_challenge_attempts_one_attempt_per_day
  unique (user_id, challenge_date);
