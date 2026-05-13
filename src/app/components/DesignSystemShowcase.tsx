import type { ReactNode } from "react";
import { BombIcon, RacingFlagIcon, DiamondIcon, FlashIcon } from "hugeicons-react";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-10">
      <p style={{ color: "var(--mm-text-3)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "16px" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function CellDemo({ type }: { type: "closed" | "open-empty" | "open-1" | "open-2" | "open-3" | "flagged" | "mine" | "safe-hint" | "danger-hint" }) {
  const size = "w-10 h-10 rounded-lg flex items-center justify-center";
  switch (type) {
    case "closed":
      return <div className={size} style={{ background: "linear-gradient(145deg, #2A2D40, #1E2035)", boxShadow: "var(--cell-closed-shadow)", border: "1px solid var(--mm-border)" }} />;
    case "open-empty":
      return <div className={size} style={{ background: "linear-gradient(135deg, #0A0C14, #0F1220)", boxShadow: "var(--cell-open-shadow)", border: "1px solid rgba(255,255,255,0.04)" }} />;
    case "open-1":
      return <div className={size} style={{ background: "linear-gradient(135deg, #0D1020, #111428)", boxShadow: "var(--cell-open-shadow)", color: "#6B9FEF", fontSize: "14px", fontWeight: 800 }}>1</div>;
    case "open-2":
      return <div className={size} style={{ background: "linear-gradient(135deg, #0D1020, #111428)", boxShadow: "var(--cell-open-shadow)", color: "#4CD97B", fontSize: "14px", fontWeight: 800 }}>2</div>;
    case "open-3":
      return <div className={size} style={{ background: "linear-gradient(135deg, #0D1020, #111428)", boxShadow: "var(--cell-open-shadow)", color: "#E55A5A", fontSize: "14px", fontWeight: 800 }}>3</div>;
    case "flagged":
      return <div className={size} style={{ background: "linear-gradient(145deg, #2A2240, #1C1830)", boxShadow: "var(--cell-closed-shadow), 0 0 8px var(--mm-amber-glow)", border: "1px solid var(--mm-border-amber)" }}><RacingFlagIcon size={15} color="#E8A020" /></div>;
    case "mine":
      return <div className={size} style={{ background: "linear-gradient(135deg, #3D1B1B, #2A1010)", border: "1px solid rgba(229,90,90,0.3)", boxShadow: "0 0 8px rgba(229,90,90,0.4)" }}><BombIcon size={15} color="#E55A5A" /></div>;
    case "safe-hint":
      return <div className={size} style={{ background: "linear-gradient(145deg, #1A2E22, #162418)", boxShadow: "var(--cell-closed-shadow), 0 0 10px var(--mm-green-glow)", border: "1px solid rgba(76,217,123,0.25)" }} />;
    case "danger-hint":
      return <div className={size} style={{ background: "linear-gradient(145deg, #2A2220, #201A18)", boxShadow: "var(--cell-closed-shadow), 0 0 10px var(--mm-red-glow)", border: "1px solid rgba(229,90,90,0.25)" }} />;
    default:
      return null;
  }
}

const CELL_TYPES = [
  { type: "closed", label: "Closed" },
  { type: "open-empty", label: "Empty" },
  { type: "open-1", label: "One" },
  { type: "open-2", label: "Two" },
  { type: "open-3", label: "Three" },
  { type: "flagged", label: "Flagged" },
  { type: "mine", label: "Mine" },
  { type: "safe-hint", label: "AI Safe" },
  { type: "danger-hint", label: "AI Danger" },
] as const;

function ProbBadge({ value, type }: { value: number; type: "safe" | "danger" | "neutral" }) {
  const color = type === "safe" ? "var(--mm-green)" : type === "danger" ? "var(--mm-red)" : "var(--mm-amber)";
  const bg = type === "safe" ? "var(--mm-green-glow)" : type === "danger" ? "var(--mm-red-glow)" : "var(--mm-amber-glow)";
  const border = type === "safe" ? "rgba(76,217,123,0.25)" : type === "danger" ? "rgba(229,90,90,0.25)" : "var(--mm-border-amber)";
  return (
    <div className="px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5" style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span style={{ color, fontSize: "13px", fontWeight: 700 }}>{value}%</span>
    </div>
  );
}

export function DesignSystemShowcase() {
  return (
    <div className="min-h-screen" style={{ background: "var(--mm-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--mm-amber), var(--mm-amber-dim))", boxShadow: "0 4px 16px var(--mm-amber-glow-strong)" }}
            >
              <span style={{ color: "var(--mm-bg)", fontSize: "20px" }}>⬡</span>
            </div>
            <div>
              <h1 style={{ color: "var(--mm-text)", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em" }}>MineMind Design System</h1>
              <p style={{ color: "var(--mm-text-3)", fontSize: "13px" }}>Components, tokens, and patterns</p>
            </div>
          </div>
        </div>

        {/* Colors */}
        <Section title="Color Tokens">
          <div className="flex flex-wrap gap-3">
            {[
              { name: "Amber", color: "#E8A020" },
              { name: "Amber Light", color: "#F5C060" },
              { name: "Green", color: "#4CD97B" },
              { name: "Red", color: "#E55A5A" },
              { name: "Blue", color: "#6B9FEF" },
              { name: "Purple", color: "#9B72EF" },
              { name: "Cyan", color: "#50D8D0" },
              { name: "Surface 1", color: "#13161F" },
              { name: "Surface 2", color: "#1A1E2E" },
              { name: "Surface 3", color: "#222740" },
            ].map(c => (
              <div key={c.name} className="flex flex-col gap-2">
                <div className="w-16 h-16 rounded-xl" style={{ background: c.color, border: "1px solid rgba(255,255,255,0.1)" }} />
                <span style={{ color: "var(--mm-text-3)", fontSize: "10px", textAlign: "center" }}>{c.name}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Game cells */}
        <Section title="Game Cells">
          <div className="flex flex-wrap gap-4">
            {CELL_TYPES.map(c => (
              <div key={c.type} className="flex flex-col items-center gap-2">
                <CellDemo type={c.type} />
                <span style={{ color: "var(--mm-text-3)", fontSize: "10px" }}>{c.label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons">
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 rounded-xl transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, var(--mm-amber), var(--mm-amber-dim))", color: "var(--mm-bg)", fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-mabry)", boxShadow: "0 4px 16px var(--mm-amber-glow-strong)" }}>
              Primary
            </button>
            <button className="px-6 py-3 rounded-xl transition-all hover:brightness-110"
              style={{ background: "var(--mm-surface-2)", color: "var(--mm-text)", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-mabry)", border: "1px solid var(--mm-border-2)" }}>
              Secondary
            </button>
            <button className="px-6 py-3 rounded-xl transition-all hover:bg-opacity-10"
              style={{ background: "transparent", color: "var(--mm-amber)", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-mabry)", border: "1px solid var(--mm-border-amber)" }}>
              Ghost
            </button>
            <button className="px-6 py-3 rounded-xl transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, var(--mm-purple), #7B52EF)", color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-mabry)", boxShadow: "0 4px 16px rgba(155,114,239,0.35)" }}>
              <DiamondIcon size={14} color="#fff" style={{ display: "inline", marginRight: "6px" }} />
              Pro
            </button>
            <button className="px-6 py-3 rounded-xl transition-all"
              style={{ background: "var(--mm-surface-2)", color: "var(--mm-text-3)", fontSize: "14px", fontFamily: "var(--font-mabry)", border: "1px solid var(--mm-border)", cursor: "not-allowed", opacity: 0.5 }}>
              Disabled
            </button>
          </div>
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <div className="flex flex-wrap gap-4">
            <div className="rounded-2xl p-5 w-56" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
              <p style={{ color: "var(--mm-text-3)", fontSize: "11px", marginBottom: "8px" }}>DEFAULT CARD</p>
              <p style={{ color: "var(--mm-text)", fontSize: "20px", fontWeight: 800 }}>82%</p>
              <p style={{ color: "var(--mm-text-2)", fontSize: "12px" }}>Win rate this week</p>
            </div>
            <div className="rounded-2xl p-5 w-56" style={{ background: "var(--mm-amber-glow)", border: "1px solid var(--mm-border-amber)" }}>
              <div className="flex items-center gap-2 mb-2">
                <FlashIcon size={14} color="var(--mm-amber)" />
                <p style={{ color: "var(--mm-amber)", fontSize: "11px", fontWeight: 700 }}>AMBER CARD</p>
              </div>
              <p style={{ color: "var(--mm-text)", fontSize: "20px", fontWeight: 800 }}>Daily #20260513</p>
              <p style={{ color: "var(--mm-text-2)", fontSize: "12px" }}>Today's challenge</p>
            </div>
            <div className="rounded-2xl p-5 w-56" style={{ background: "linear-gradient(135deg, #1A1428, #120E20)", border: "1px solid rgba(155,114,239,0.25)" }}>
              <div className="flex items-center gap-2 mb-2">
                <DiamondIcon size={14} color="var(--mm-purple)" />
                <p style={{ color: "var(--mm-purple)", fontSize: "11px", fontWeight: 700 }}>PRO CARD</p>
              </div>
              <p style={{ color: "var(--mm-text)", fontSize: "16px", fontWeight: 700 }}>Upgrade to Pro</p>
              <p style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>Custom skins · AI hints</p>
            </div>
          </div>
        </Section>

        {/* Difficulty tabs */}
        <Section title="Difficulty Selector">
          <div className="rounded-xl p-1 inline-flex gap-1" style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}>
            {["Beginner", "Advanced", "Expert", "Daily"].map((d, i) => (
              <button
                key={d}
                className="rounded-lg px-4 py-2"
                style={{
                  background: i === 1 ? "var(--mm-amber)" : "transparent",
                  color: i === 1 ? "var(--mm-bg)" : "var(--mm-text-3)",
                  fontSize: "12px",
                  fontWeight: i === 1 ? 700 : 500,
                  fontFamily: "var(--font-mabry)",
                  boxShadow: i === 1 ? "0 2px 8px var(--mm-amber-glow-strong)" : "none",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </Section>

        {/* Probability badges */}
        <Section title="Probability Badges">
          <div className="flex flex-wrap gap-3">
            <ProbBadge value={97} type="safe" />
            <ProbBadge value={82} type="safe" />
            <ProbBadge value={64} type="neutral" />
            <ProbBadge value={31} type="danger" />
            <ProbBadge value={89} type="danger" />
          </div>
        </Section>

        {/* Leaderboard row */}
        <Section title="Leaderboard Row">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--mm-border)", maxWidth: "500px" }}
          >
            {[
              { rank: 1, name: "NovakD", city: "Belgrade", time: "0:47", acc: 98, isMe: false },
              { rank: 2, name: "AliyaM", city: "Almaty", time: "0:52", acc: 96, isMe: false },
              { rank: 247, name: "You", city: "Almaty", time: "1:24", acc: 94, isMe: true },
            ].map(p => (
              <div
                key={p.rank}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  background: p.isMe ? "rgba(232,160,32,0.06)" : "var(--mm-surface-1)",
                  borderBottom: "1px solid var(--mm-border)",
                  borderLeft: p.isMe ? "3px solid var(--mm-amber)" : "3px solid transparent",
                }}
              >
                <span style={{ color: "var(--mm-text-3)", fontSize: "13px", fontWeight: 700, width: "32px" }}>#{p.rank}</span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: p.isMe ? "var(--mm-amber)" : "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}
                >
                  <span style={{ color: p.isMe ? "var(--mm-bg)" : "var(--mm-text-2)", fontSize: "11px", fontWeight: 700 }}>{p.name[0]}</span>
                </div>
                <div className="flex-1">
                  <span style={{ color: p.isMe ? "var(--mm-amber)" : "var(--mm-text)", fontSize: "13px", fontWeight: p.isMe ? 700 : 500 }}>{p.name}</span>
                  <span style={{ color: "var(--mm-text-3)", fontSize: "11px", marginLeft: "6px" }}>{p.city}</span>
                </div>
                <span style={{ color: "var(--mm-amber)", fontSize: "13px", fontWeight: 700 }}>{p.time}</span>
                <span style={{ color: "var(--mm-blue)", fontSize: "12px" }}>{p.acc}%</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Stat badges */}
        <Section title="Stat Badges">
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Streak", value: "7 🔥", color: "var(--mm-amber)" },
              { label: "Accuracy", value: "94%", color: "var(--mm-blue)" },
              { label: "Win Rate", value: "82%", color: "var(--mm-green)" },
              { label: "Rank", value: "#247", color: "var(--mm-purple)" },
            ].map(b => (
              <div
                key={b.label}
                className="rounded-xl px-4 py-2.5 flex items-center gap-2"
                style={{ background: "var(--mm-surface-2)", border: "1px solid var(--mm-border)" }}
              >
                <div>
                  <p style={{ color: "var(--mm-text-3)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{b.label}</p>
                  <p style={{ color: b.color, fontSize: "16px", fontWeight: 800 }}>{b.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Nav bar preview */}
        <Section title="Navigation Bar">
          <div
            className="rounded-2xl flex items-center justify-between px-5 py-3"
            style={{ background: "rgba(13,15,23,0.85)", backdropFilter: "blur(20px)", border: "1px solid var(--mm-border)" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--mm-amber), var(--mm-amber-dim))" }}>
                <span style={{ color: "#0D0F17", fontSize: "14px" }}>⬡</span>
              </div>
              <span style={{ color: "var(--mm-text)", fontSize: "14px", fontWeight: 700 }}>Mine<span style={{ color: "var(--mm-amber)" }}>Mind</span></span>
            </div>
            <div className="flex gap-1">
              {["Daily", "Leaderboard", "Stats"].map((l, i) => (
                <button key={l} className="px-3 py-1.5 rounded-lg" style={{ background: i === 0 ? "var(--mm-amber-glow)" : "transparent", color: i === 0 ? "var(--mm-amber)" : "var(--mm-text-3)", fontSize: "12px", border: i === 0 ? "1px solid var(--mm-border-amber)" : "1px solid transparent" }}>{l}</button>
              ))}
            </div>
            <button className="px-4 py-2 rounded-lg" style={{ background: "var(--mm-amber)", color: "var(--mm-bg)", fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-mabry)" }}>
              Play Now
            </button>
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography — Mabry Pro">
          <div className="flex flex-col gap-3" style={{ background: "var(--mm-surface-1)", padding: "24px", borderRadius: "16px", border: "1px solid var(--mm-border)" }}>
            {[
              { size: "40px", weight: 800, text: "MineMind", label: "Heading 1 · 40px / 800" },
              { size: "28px", weight: 700, text: "Strategic Minesweeper", label: "Heading 2 · 28px / 700" },
              { size: "20px", weight: 700, text: "Daily Challenge Leaderboard", label: "Heading 3 · 20px / 700" },
              { size: "15px", weight: 500, text: "Left-click to reveal · Right-click to flag", label: "Body · 15px / 500" },
              { size: "12px", weight: 400, text: "Rankings update every 10 minutes · 98,441 active players", label: "Caption · 12px / 400" },
            ].map(t => (
              <div key={t.label}>
                <p style={{ color: "var(--mm-text)", fontSize: t.size, fontWeight: t.weight, lineHeight: 1.2 }}>{t.text}</p>
                <p style={{ color: "var(--mm-text-3)", fontSize: "10px", marginTop: "2px" }}>{t.label}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
