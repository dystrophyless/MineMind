import { useState } from "react";
import { CrownIcon, MedalFirstPlaceIcon, MedalSecondPlaceIcon, MedalThirdPlaceIcon, GlobeIcon, StarIcon, FireIcon } from "hugeicons-react";

const GLOBAL_PLAYERS = [
  { rank: 1,  name: "NovakD",    city: "Belgrade", country: "🇷🇸", wins: 1842, winRate: 98, bestTime: "0:41", accuracy: 98, streak: 32, isMe: false },
  { rank: 2,  name: "AliyaM",    city: "Almaty",   country: "🇰🇿", wins: 1720, winRate: 96, bestTime: "0:47", accuracy: 96, streak: 21, isMe: false },
  { rank: 3,  name: "KimJH",     city: "Seoul",    country: "🇰🇷", wins: 1650, winRate: 95, bestTime: "0:52", accuracy: 95, streak: 18, isMe: false },
  { rank: 4,  name: "MariaG",    city: "Madrid",   country: "🇪🇸", wins: 1580, winRate: 94, bestTime: "0:54", accuracy: 94, streak: 14, isMe: false },
  { rank: 5,  name: "AhmedK",    city: "Cairo",    country: "🇪🇬", wins: 1510, winRate: 93, bestTime: "0:58", accuracy: 93, streak: 12, isMe: false },
  { rank: 6,  name: "YukiT",     city: "Tokyo",    country: "🇯🇵", wins: 1480, winRate: 92, bestTime: "1:01", accuracy: 92, streak: 9,  isMe: false },
  { rank: 7,  name: "SvenB",     city: "Stockholm",country: "🇸🇪", wins: 1410, winRate: 91, bestTime: "1:04", accuracy: 91, streak: 7,  isMe: false },
  { rank: 247, name: "You",      city: "Almaty",   country: "🇰🇿", wins: 342,  winRate: 82, bestTime: "1:24", accuracy: 94, streak: 7,  isMe: true  },
];

const ALMATY_PLAYERS = [
  { rank: 1,  name: "AliyaM",   wins: 1720, winRate: 96, bestTime: "0:47", isMe: false },
  { rank: 2,  name: "TimurA",   wins: 980,  winRate: 89, bestTime: "1:12", isMe: false },
  { rank: 3,  name: "DanaK",    wins: 870,  winRate: 87, bestTime: "1:18", isMe: false },
  { rank: 4,  name: "BekzodN",  wins: 760,  winRate: 85, bestTime: "1:21", isMe: false },
  { rank: 5,  name: "ZaraO",    wins: 680,  winRate: 83, bestTime: "1:23", isMe: false },
  { rank: 12, name: "You",       wins: 342,  winRate: 82, bestTime: "1:24", isMe: true  },
];

type Tab = "global" | "city" | "daily";

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <MedalFirstPlaceIcon size={18} color="#F5C060" />;
  if (rank === 2) return <MedalSecondPlaceIcon size={18} color="#A8A4B8" />;
  if (rank === 3) return <MedalThirdPlaceIcon size={18} color="#C07010" />;
  return <span style={{ color: "var(--mm-text-3)", fontSize: "13px", fontWeight: 700, width: "18px", textAlign: "center", display: "inline-block" }}>#{rank}</span>;
}

export function Leaderboard() {
  const [tab, setTab] = useState<Tab>("global");

  return (
    <div className="min-h-screen" style={{ background: "var(--mm-bg)" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <CrownIcon size={24} color="var(--mm-amber)" />
          <h1 style={{ color: "var(--mm-text)", fontSize: "32px", fontWeight: 800, letterSpacing: "-0.03em" }}>Leaderboard</h1>
        </div>
        <p style={{ color: "var(--mm-text-2)", fontSize: "14px", marginBottom: "24px" }}>
          Compete with the best minds worldwide
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <StarIcon size={14} color="var(--mm-amber)" />, label: "Your global rank", value: "#247" },
            { icon: <GlobeIcon size={14} color="var(--mm-blue)" />, label: "Almaty rank", value: "#12" },
            { icon: <FireIcon size={14} color="var(--mm-red)" />, label: "Current streak", value: "7 days" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
              <div className="flex items-center gap-1.5 mb-1">{s.icon}<span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{s.label}</span></div>
              <p style={{ color: "var(--mm-text)", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 rounded-xl p-1 mb-6"
          style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)", width: "fit-content" }}
        >
          {(["global", "city", "daily"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="rounded-lg px-5 py-2 transition-all duration-200 capitalize"
              style={{
                background: tab === t ? "var(--mm-amber)" : "transparent",
                color: tab === t ? "var(--mm-bg)" : "var(--mm-text-2)",
                fontSize: "13px",
                fontWeight: tab === t ? 700 : 500,
                fontFamily: "var(--font-mabry)",
                boxShadow: tab === t ? "0 2px 10px var(--mm-amber-glow-strong)" : "none",
              }}
            >
              {t === "city" ? "🌆 Almaty" : t === "global" ? "🌍 Global" : "⚡ Daily"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--mm-border)" }}>
          {/* Table header */}
          <div
            className="grid px-4 py-3"
            style={{
              gridTemplateColumns: "60px 1fr 80px 80px 80px 80px",
              background: "var(--mm-surface-2)",
              borderBottom: "1px solid var(--mm-border)",
            }}
          >
            {["Rank", "Player", "Wins", "Win%", "Best", "Acc."].map(h => (
              <span key={h} style={{ color: "var(--mm-text-3)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {(tab === "global" ? GLOBAL_PLAYERS : tab === "city" ? ALMATY_PLAYERS : GLOBAL_PLAYERS.slice(0, 5)).map((p, i) => (
            <div key={p.rank}>
              {p.isMe && i > 0 && (
                <div className="px-4 py-2" style={{ background: "var(--mm-surface-1)" }}>
                  <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>· · · {p.rank - (ALMATY_PLAYERS[ALMATY_PLAYERS.length - 2]?.rank || 5)} positions below ···</span>
                </div>
              )}
              <div
                className="grid px-4 py-3.5 items-center"
                style={{
                  gridTemplateColumns: "60px 1fr 80px 80px 80px 80px",
                  background: p.isMe ? "rgba(232,160,32,0.06)" : i % 2 === 0 ? "var(--mm-surface-1)" : "var(--mm-bg)",
                  borderBottom: "1px solid var(--mm-border)",
                  borderLeft: p.isMe ? "3px solid var(--mm-amber)" : "3px solid transparent",
                }}
              >
                <div className="flex items-center">
                  <RankIcon rank={p.rank} />
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: p.isMe ? "var(--mm-amber)" : "var(--mm-surface-3)",
                      border: `1px solid ${p.isMe ? "var(--mm-amber)" : "var(--mm-border)"}`,
                    }}
                  >
                    <span style={{ color: p.isMe ? "var(--mm-bg)" : "var(--mm-text-2)", fontSize: "12px", fontWeight: 700 }}>
                      {p.name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: p.isMe ? "var(--mm-amber)" : "var(--mm-text)", fontSize: "13px", fontWeight: p.isMe ? 700 : 500 }}>
                        {p.name}
                        {p.isMe && " (You)"}
                      </span>
                      {(p as any).streak >= 20 && <FireIcon size={12} color="var(--mm-red)" />}
                    </div>
                    <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{p.city} {(p as any).country || ""}</span>
                  </div>
                </div>
                <span style={{ color: "var(--mm-text)", fontSize: "13px", fontWeight: 600 }}>{p.wins.toLocaleString()}</span>
                <span style={{ color: "var(--mm-green)", fontSize: "13px", fontWeight: 600 }}>{p.winRate}%</span>
                <span style={{ color: "var(--mm-amber)", fontSize: "13px", fontWeight: 700 }}>{p.bestTime}</span>
                <span style={{ color: "var(--mm-blue)", fontSize: "13px" }}>{p.accuracy}%</span>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: "var(--mm-text-3)", fontSize: "12px", textAlign: "center", marginTop: "16px" }}>
          Rankings update every 10 minutes · 98,441 active players
        </p>
      </div>
    </div>
  );
}
