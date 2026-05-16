# MineMind

A competitive minesweeper web app with ranked modes, daily challenges, XP progression, achievements, and leaderboards.

## Features

### Game Modes

| Mode | Description |
|---|---|
| **Classic** | Standard minesweeper. Best time tracked for the leaderboard. |
| **No Flags** | Win without placing any flags — pure memory and logic. |
| **Timed** | Survive 60 seconds. Clear boards to earn mines; each cleared board adds 5 seconds. Score = total mines found. |
| **Daily Challenge** | One shared board per day for all players. Ranked by completion time. |

### Progression
- **XP** is awarded after every game — wins earn significantly more, and Classic/No Flags wins get a speed bonus (up to +60 XP for finishing in under 100 seconds)
- **Levels** scale exponentially: level thresholds double each time starting from 100 → 250 → 500 → 1000 → …
- **10 achievements** unlock as you play and are saved to your profile

### Achievements

| Achievement | Condition |
|---|---|
| First Blood | Win any game |
| Speed Demon | Win Classic in under 30 seconds |
| Lightning | Win Classic in under 15 seconds |
| Bare Hands | Win a No Flags game |
| Streak Master | 7-day win streak |
| Daily Warrior | Play 10 daily mode games |
| Bomb Squad | Play 50 games total |
| Centurion | Win 100 games |
| Mine Hunter | Find 100 mines in Timed mode |
| Dedicated | Play on 7 different days |

A custom notification pops up on achievement unlock — slides in from the right on desktop, slides up from the bottom on mobile.

### Leaderboard
- Ranked by best Classic time, globally and by city
- Separate daily challenge leaderboard sorted by fastest completion time

### Profile
- Win rate per mode with trend vs. last week
- Current and best win streak
- Recent games history
- Achievement grid (locked achievements shown greyed out)
- XP progress bar toward next level

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS v4
- **Backend/DB:** Supabase (PostgreSQL, Auth, Row-Level Security)
- **UI:** hugeicons-react, Radix UI primitives
- **i18n:** English and Russian (toggle in settings)
- **Package manager:** pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

Requires a Supabase project. Set environment variables:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Apply migrations in order from `supabase/migrations/`.

## Project Structure

```
src/app/
  components/       # UI components (GameDashboard, MobileGame, ProfileStats, …)
  components/game/  # Game logic (gameRules.mjs, MinesweeperBoard, useGameLogic)
  hooks/            # Data hooks (useProfileStats, useDailyChallenge, …)
  services/         # Side-effect services (achievements, profileXp)
  i18n/             # Translation strings + LocaleProvider
  contexts/         # AuthContext
supabase/
  migrations/       # Ordered SQL migrations
```

## Mobile

The UI adapts fully to mobile viewports. Long-press to flag cells (iOS-safe — no context menu), swipe-friendly layout, bottom navigation bar.
