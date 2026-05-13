import { BrainIcon, FlashIcon, CrownIcon, StarIcon, ArrowRightBigIcon, ChartUpIcon } from "hugeicons-react";

type Props = {
  onPlay: () => void;
  onDaily: () => void;
};

const MINI_BOARD = [
  [0, 1, -1, 1, 0],
  [1, 2, 2, 2, 1],
  [-1, 2, -2, 2, -1],
  [1, 2, 2, 2, 1],
  [0, 1, -1, 1, 0],
];

function MiniCell({ val }: { val: number }) {
  if (val === -1) {
    return (
      <div className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: "linear-gradient(145deg, #2A2D40, #1E2035)", boxShadow: "var(--cell-closed-shadow)", border: "1px solid var(--mm-border-amber)" }}>
        <span style={{ color: "var(--mm-amber)", fontSize: "14px" }}>🚩</span>
      </div>
    );
  }
  if (val === -2) {
    return (
      <div className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #3D1B1B, #2A1010)", border: "1px solid rgba(229,90,90,0.3)" }}>
        <span style={{ color: "var(--mm-red)", fontSize: "14px" }}>💣</span>
      </div>
    );
  }
  if (val === 0) {
    return (
      <div className="w-10 h-10 rounded-lg"
        style={{ background: "linear-gradient(145deg, #2A2D40, #1E2035)", boxShadow: "var(--cell-closed-shadow)", border: "1px solid var(--mm-border)" }} />
    );
  }
  const colors: Record<number, string> = { 1: "#6B9FEF", 2: "#4CD97B", 3: "#E55A5A", 4: "#9B72EF" };
  return (
    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0D1020, #111428)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ color: colors[val] || "#EDE8DE", fontSize: "14px", fontWeight: 700 }}>{val}</span>
    </div>
  );
}

const FEATURES = [
  { icon: <BrainIcon size={20} color="var(--mm-amber)" />, title: "AI Coach", desc: "Real-time probability analysis and strategic hints powered by machine learning" },
  { icon: <FlashIcon size={20} color="var(--mm-blue)" />, title: "Daily Challenges", desc: "Same board for everyone, new every day. Compete globally for the best time" },
  { icon: <CrownIcon size={20} color="var(--mm-purple)" />, title: "Leaderboards", desc: "City and global rankings. Rise through the ranks and claim your throne" },
  { icon: <ChartUpIcon size={20} color="var(--mm-green)" />, title: "Deep Stats", desc: "Win rate, accuracy, streaks, heatmaps. Understand every move you make" },
];

const STATS = [
  { value: "2.4M+", label: "Games Played" },
  { value: "98K", label: "Active Players" },
  { value: "99.8%", label: "Uptime" },
  { value: "#1", label: "Strategy Minesweeper" },
];

export function LandingPage({ onPlay, onDaily }: Props) {
  return (
    <div className="min-h-screen" style={{ background: "var(--mm-bg)" }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,160,32,0.12) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 80% 50%, rgba(107,159,239,0.07) 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: "var(--mm-amber-glow)", border: "1px solid var(--mm-border-amber)" }}
            >
              <FlashIcon size={12} color="var(--mm-amber)" />
              <span style={{ color: "var(--mm-amber)", fontSize: "12px", fontWeight: 600 }}>Daily Challenge Live Now</span>
            </div>

            <h1
              className="mb-4"
              style={{ color: "var(--mm-text)", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              Minesweeper,{" "}
              <span style={{ color: "var(--mm-amber)" }}>rebuilt</span>
              <br />for strategic minds
            </h1>

            <p style={{ color: "var(--mm-text-2)", fontSize: "clamp(15px, 2vw, 18px)", lineHeight: 1.7, maxWidth: "500px", marginBottom: "32px" }}>
              Daily challenges, probability training, AI hints, and competitive leaderboards.
              Minesweeper like you've never played it before.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={onPlay}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, var(--mm-amber), var(--mm-amber-dim))",
                  color: "var(--mm-bg)",
                  fontSize: "15px",
                  fontWeight: 700,
                  fontFamily: "var(--font-mabry)",
                  boxShadow: "0 6px 24px var(--mm-amber-glow-strong)",
                }}
              >
                Play Now
                <ArrowRightBigIcon size={16} color="var(--mm-bg)" />
              </button>
              <button
                onClick={onDaily}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{
                  background: "var(--mm-surface-2)",
                  color: "var(--mm-text)",
                  fontSize: "15px",
                  fontWeight: 600,
                  fontFamily: "var(--font-mabry)",
                  border: "1px solid var(--mm-border-2)",
                }}
              >
                <FlashIcon size={16} color="var(--mm-amber)" />
                Try Daily Challenge
              </button>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {["#E8A020", "#6B9FEF", "#4CD97B", "#9B72EF"].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2" style={{ background: c, borderColor: "var(--mm-bg)" }} />
                ))}
              </div>
              <span style={{ color: "var(--mm-text-2)", fontSize: "13px" }}>
                <strong style={{ color: "var(--mm-text)" }}>98,000+</strong> players worldwide
              </span>
            </div>
          </div>

          {/* Right: Board preview + stats card */}
          <div className="flex-1 flex flex-col items-center gap-6 w-full max-w-sm lg:max-w-none">
            <div className="relative">
              {/* Board preview */}
              <div
                className="rounded-2xl p-4 inline-block"
                style={{
                  background: "linear-gradient(135deg, #0A0C14, #0D1020)",
                  border: "1px solid var(--mm-border-2)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px rgba(232,160,32,0.08)",
                }}
              >
                <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                  {MINI_BOARD.flat().map((val, i) => (
                    <MiniCell key={i} val={val} />
                  ))}
                </div>
              </div>

              {/* Floating AI hint badge */}
              <div
                className="absolute -right-4 top-6 rounded-xl px-3 py-2.5 shadow-2xl"
                style={{
                  background: "var(--mm-surface-2)",
                  border: "1px solid var(--mm-green-glow)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--mm-green)", boxShadow: "0 0 6px var(--mm-green)" }} />
                  <span style={{ color: "var(--mm-green)", fontSize: "11px", fontWeight: 600 }}>Safe move</span>
                  <span style={{ color: "var(--mm-green)", fontSize: "13px", fontWeight: 800 }}>94%</span>
                </div>
              </div>

              {/* Floating streak badge */}
              <div
                className="absolute -left-4 bottom-6 rounded-xl px-3 py-2.5 shadow-2xl"
                style={{
                  background: "var(--mm-surface-2)",
                  border: "1px solid var(--mm-border-amber)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "14px" }}>🔥</span>
                  <div>
                    <div style={{ color: "var(--mm-amber)", fontSize: "13px", fontWeight: 800 }}>7 streak</div>
                    <div style={{ color: "var(--mm-text-3)", fontSize: "10px" }}>Days active</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats dashboard preview */}
            <div
              className="w-full rounded-2xl p-4"
              style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: "var(--mm-text)", fontSize: "13px", fontWeight: 600 }}>Your Dashboard</span>
                <span style={{ color: "var(--mm-amber)", fontSize: "11px" }}>Rank #247</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[["82%", "Win Rate"], ["1:24", "Best Time"], ["94%", "Accuracy"]].map(([v, l], i) => (
                  <div key={i} className="rounded-lg p-2 text-center" style={{ background: "var(--mm-surface-2)" }}>
                    <div style={{ color: "var(--mm-text)", fontSize: "16px", fontWeight: 700 }}>{v}</div>
                    <div style={{ color: "var(--mm-text-3)", fontSize: "10px" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global stats bar */}
      <div style={{ borderTop: "1px solid var(--mm-border)", borderBottom: "1px solid var(--mm-border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.value} className="text-center">
              <div style={{ color: "var(--mm-amber)", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 style={{ color: "var(--mm-text)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "12px" }}>
            Not your grandpa's Minesweeper
          </h2>
          <p style={{ color: "var(--mm-text-2)", fontSize: "16px" }}>Built for players who want more than luck.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
              style={{ background: "var(--mm-surface-1)", border: "1px solid var(--mm-border)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "var(--mm-surface-3)", border: "1px solid var(--mm-border)" }}>
                {f.icon}
              </div>
              <h3 style={{ color: "var(--mm-text)", fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ color: "var(--mm-text-3)", fontSize: "13px", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="mx-6 mb-20 rounded-3xl p-12 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A1428, #0D0F17, #0A1A14)",
          border: "1px solid var(--mm-border-amber)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 0%, var(--mm-amber-glow) 0%, transparent 70%)" }} />
        <div className="relative">
          <h2 style={{ color: "var(--mm-text)", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "12px" }}>
            Ready to outsmart every mine?
          </h2>
          <p style={{ color: "var(--mm-text-2)", fontSize: "16px", marginBottom: "32px" }}>
            Join 98,000+ players. Free forever, no sign-up required.
          </p>
          <button
            onClick={onPlay}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg, var(--mm-amber), var(--mm-amber-dim))",
              color: "var(--mm-bg)",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "var(--font-mabry)",
              boxShadow: "0 6px 32px var(--mm-amber-glow-strong)",
            }}
          >
            Start Playing Free
            <ArrowRightBigIcon size={18} color="var(--mm-bg)" />
          </button>
        </div>
      </section>
    </div>
  );
}
