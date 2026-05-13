import { BrainIcon, StarIcon, StopWatchIcon, FireIcon, ChartUpIcon, DiamondIcon, CrownIcon, BombIcon, FlashIcon } from "hugeicons-react";

const STATS = [
  { label: "Win Rate", value: "82%", icon: <ChartUpIcon size={16} color="var(--mm-green)" />, color: "var(--mm-green)", change: "+3% this week" },
  { label: "Games Played", value: "1,247", icon: <BrainIcon size={16} color="var(--mm-blue)" />, color: "var(--mm-blue)", change: "+18 today" },
  { label: "Best Time", value: "1:24", icon: <StopWatchIcon size={16} color="var(--mm-amber)" />, color: "var(--mm-amber)", change: "Beginner" },
  { label: "Avg Accuracy", value: "94%", icon: <StarIcon size={16} color="var(--mm-purple)" />, color: "var(--mm-purple)", change: "Top 8%" },
  { label: "Current Streak", value: "7 days", icon: <FireIcon size={16} color="var(--mm-red)" />, color: "var(--mm-red)", change: "Personal best: 21" },
  { label: "Fav. Difficulty", value: "Advanced", icon: <BombIcon size={16} color="var(--mm-text-2)" />, color: "var(--mm-text-2)", change: "72% of games" },
];

const BADGES = [
  { name: "Speed Demon", desc: "Sub 1-min solve", icon: "⚡", unlocked: true },
  { name: "Flawless", desc: "100% accuracy game", icon: "✨", unlocked: true },
  { name: "Streak Master", desc: "21-day streak", icon: "🔥", unlocked: true },
  { name: "Daily Warrior", desc: "30 daily challenges", icon: "🏆", unlocked: false },
  { name: "Grandmaster", desc: "Expert in < 3 min", icon: "👑", unlocked: false },
  { name: "Scholar", desc: "Study 100 AI hints", icon: "🧠", unlocked: false },
];

const RECENT_GAMES = [
  { diff: "Advanced", time: "2:14", accuracy: 96, result: "won", date: "Today" },
  { diff: "Advanced", time: "1:58", accuracy: 98, result: "won", date: "Today" },
  { diff: "Expert",   time: "—",    accuracy: 72, result: "lost", date: "Today" },
  { diff: "Beginner", time: "1:24", accuracy: 100, result: "won", date: "Yesterday" },
  { diff: "Advanced", time: "2:37", accuracy: 95, result: "won", date: "Yesterday" },
];

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--mm-surface-3)" }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${(value / max) * 100}%`, background: color, boxShadow: `0 0 8px ${color}50` }}
      />
    </div>
  );
}

export function ProfileStats() {
  return (
    <div className="min-h-screen" style={{ background: "var(--mm-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile header */}
        <div
          className="rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}
        >
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 relative"
            style={{
              background: "linear-gradient(135deg, var(--mm-amber), var(--mm-amber-dim))",
              boxShadow: "0 8px 24px var(--mm-amber-glow-strong)",
            }}
          >
            <span style={{ color: "var(--mm-bg)", fontSize: "32px", fontWeight: 800 }}>Y</span>
            {/* Pro badge */}
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "var(--mm-purple)", border: "2px solid var(--mm-bg)" }}
            >
              <DiamondIcon size={10} color="#fff" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 style={{ color: "var(--mm-text)", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.02em" }}>You</h1>
              <div
                className="px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                style={{ background: "var(--mm-amber-glow)", border: "1px solid var(--mm-border-amber)" }}
              >
                <CrownIcon size={11} color="var(--mm-amber)" />
                <span style={{ color: "var(--mm-amber)", fontSize: "11px", fontWeight: 700 }}>#247 Global</span>
              </div>
              <div
                className="px-2.5 py-1 rounded-lg"
                style={{ background: "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}
              >
                <span style={{ color: "var(--mm-text-2)", fontSize: "11px" }}>#12 Almaty</span>
              </div>
            </div>
            <p style={{ color: "var(--mm-text-2)", fontSize: "13px", marginBottom: "12px" }}>Almaty, Kazakhstan · Member since Jan 2026</p>

            {/* XP bar */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>Level 24 — Strategic Mind</span>
                <span style={{ color: "var(--mm-amber)", fontSize: "11px" }}>7,240 / 10,000 XP</span>
              </div>
              <ProgressBar value={7240} max={10000} color="var(--mm-amber)" />
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {STATS.map(s => (
            <div
              key={s.label}
              className="rounded-2xl p-5 transition-all duration-200 hover:translate-y-[-1px]"
              style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                {s.icon}
                <span style={{ color: "var(--mm-text-3)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
              </div>
              <p style={{ color: s.color, fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "4px" }}>{s.value}</p>
              <p style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{s.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Win rate by difficulty */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}
          >
            <p style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Win Rate by Difficulty</p>
            <div className="flex flex-col gap-4">
              {[
                { label: "Beginner", rate: 96, color: "var(--mm-green)", games: 480 },
                { label: "Advanced", rate: 82, color: "var(--mm-amber)", games: 620 },
                { label: "Expert",   rate: 41, color: "var(--mm-red)",   games: 147 },
              ].map(d => (
                <div key={d.label}>
                  <div className="flex justify-between mb-1.5">
                    <span style={{ color: "var(--mm-text-2)", fontSize: "13px" }}>{d.label}</span>
                    <div className="flex items-center gap-3">
                      <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{d.games} games</span>
                      <span style={{ color: d.color, fontSize: "13px", fontWeight: 700, width: "40px", textAlign: "right" }}>{d.rate}%</span>
                    </div>
                  </div>
                  <ProgressBar value={d.rate} max={100} color={d.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent games */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}
          >
            <p style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Recent Games</p>
            <div className="flex flex-col gap-2">
              {RECENT_GAMES.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: g.result === "won" ? "var(--mm-green)" : "var(--mm-red)" }}
                  />
                  <span style={{ color: "var(--mm-text-2)", fontSize: "12px", flex: 1 }}>{g.diff}</span>
                  <span style={{ color: "var(--mm-amber)", fontSize: "12px", fontWeight: 700 }}>{g.time}</span>
                  <span style={{ color: "var(--mm-blue)", fontSize: "12px" }}>{g.accuracy}%</span>
                  <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{g.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700 }}>Achievements</p>
            <span style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>3 / 6 unlocked</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BADGES.map(b => (
              <div
                key={b.name}
                className="rounded-xl p-4 text-center flex flex-col items-center gap-2"
                style={{
                  background: b.unlocked ? "var(--mm-surface-2)" : "var(--mm-surface-1)",
                  border: `1px solid ${b.unlocked ? "var(--mm-border-2)" : "var(--mm-border)"}`,
                  opacity: b.unlocked ? 1 : 0.4,
                  filter: b.unlocked ? "none" : "grayscale(1)",
                }}
              >
                <span style={{ fontSize: "24px" }}>{b.icon}</span>
                <div>
                  <p style={{ color: "var(--mm-text)", fontSize: "11px", fontWeight: 600 }}>{b.name}</p>
                  <p style={{ color: "var(--mm-text-3)", fontSize: "10px" }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
