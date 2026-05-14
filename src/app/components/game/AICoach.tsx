import { useState } from "react";
import { SparklesIcon, BrainIcon, FlashIcon } from "hugeicons-react";
import { GameStatus } from "./useGameLogic";
import { useT } from "../../i18n/LocaleProvider";
import type { TranslationKey } from "../../i18n/translations";

type Hint = {
  type: "safe" | "danger" | "strategy";
  messageKey: TranslationKey;
  probability?: number;
  cell?: string;
};

const HINTS: Hint[] = [
  { type: "safe", messageKey: "aiSafeDetected", probability: 97, cell: "C4" },
  { type: "danger", messageKey: "aiHighMine", probability: 89, cell: "F7" },
  { type: "strategy", messageKey: "aiOpenArea" },
  { type: "safe", messageKey: "aiCornerSafe", probability: 94, cell: "A1" },
  { type: "danger", messageKey: "aiAvoidCluster", probability: 82, cell: "D6" },
  { type: "strategy", messageKey: "aiPattern" },
];

type Props = {
  status: GameStatus;
  compact?: boolean;
};

export function AICoach({ status, compact }: Props) {
  const t = useT();
  const [currentHint] = useState<Hint>(HINTS[Math.floor(Math.random() * HINTS.length)]);
  const [expanded, setExpanded] = useState(!compact);

  const hintColor = currentHint.type === "safe" ? "var(--mm-green)" : currentHint.type === "danger" ? "var(--mm-red)" : "var(--mm-amber)";
  const hintGlow = currentHint.type === "safe" ? "var(--mm-green-glow)" : currentHint.type === "danger" ? "var(--mm-red-glow)" : "var(--mm-amber-glow)";
  const extraHints = [
    { type: "safe" as const, probability: 76, cell: "B3" },
    { type: "danger" as const, probability: 64, cell: "E5" },
    { type: "safe" as const, probability: 21, cell: "G2" },
  ];

  if (compact) {
    return (
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--mm-border)", background: "var(--mm-surface-2)" }}>
        <button className="w-full flex items-center justify-between px-4 py-3" onClick={() => setExpanded(e => !e)}>
          <div className="flex items-center gap-2">
            <SparklesIcon size={16} color="var(--mm-amber)" />
            <span style={{ color: "var(--mm-text)", fontSize: "13px" }}>{t("aiCoach")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded-full" style={{ background: "var(--mm-pro-badge-bg)", border: "1px solid var(--mm-pro-badge-border)" }}>
              <span style={{ color: "var(--mm-pro-badge-fg)", fontSize: "11px" }}>PRO</span>
            </div>
            <span style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>{expanded ? "^" : "v"}</span>
          </div>
        </button>
        {expanded && <AICoachContent currentHint={currentHint} hintColor={hintColor} hintGlow={hintGlow} extraHints={extraHints} status={status} />}
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--mm-border)", background: "var(--mm-surface-2)" }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--mm-border)" }}>
        <div className="flex items-center gap-2">
          <BrainIcon size={16} color="var(--mm-amber)" />
          <span style={{ color: "var(--mm-text)", fontSize: "13px", fontWeight: 600 }}>{t("aiCoach")}</span>
        </div>
        <div className="px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "var(--mm-pro-badge-bg)", border: "1px solid var(--mm-pro-badge-border)" }}>
          <FlashIcon size={10} color="var(--mm-pro-badge-fg)" />
          <span style={{ color: "var(--mm-pro-badge-fg)", fontSize: "11px" }}>PRO</span>
        </div>
      </div>
      <AICoachContent currentHint={currentHint} hintColor={hintColor} hintGlow={hintGlow} extraHints={extraHints} status={status} />
    </div>
  );
}

function AICoachContent({ currentHint, hintColor, hintGlow, extraHints, status }: {
  currentHint: Hint;
  hintColor: string;
  hintGlow: string;
  extraHints: { type: "safe" | "danger"; probability: number; cell: string }[];
  status: GameStatus;
}) {
  const t = useT();
  const title = currentHint.type === "safe" ? t("aiSafeMove") : currentHint.type === "danger" ? t("aiMineDetected") : t("aiStrategy");

  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="rounded-lg p-3 flex items-start gap-3" style={{ background: hintGlow, border: `1px solid ${hintColor}30` }}>
        <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: hintColor, boxShadow: `0 0 6px ${hintColor}` }} />
        <div>
          <p style={{ color: hintColor, fontSize: "12px", fontWeight: 600, marginBottom: "2px" }}>{title}</p>
          <p style={{ color: "var(--mm-text)", fontSize: "12px" }}>{t(currentHint.messageKey)}</p>
          {currentHint.cell && <span style={{ color: "var(--mm-text-2)", fontSize: "11px" }}>{t("aiCell")} {currentHint.cell}</span>}
        </div>
        {currentHint.probability && (
          <div className="ml-auto shrink-0">
            <span style={{ color: hintColor, fontSize: "14px", fontWeight: 700 }}>{currentHint.probability}%</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {extraHints.map((h, i) => (
          <div key={i} className="flex-1 rounded-lg p-2 text-center" style={{ background: h.type === "safe" ? "var(--mm-green-glow)" : "var(--mm-red-glow)", border: `1px solid ${h.type === "safe" ? "rgba(76,217,123,0.2)" : "rgba(229,90,90,0.2)"}` }}>
            <div style={{ color: h.type === "safe" ? "var(--mm-green)" : "var(--mm-red)", fontSize: "13px", fontWeight: 700 }}>{h.probability}%</div>
            <div style={{ color: "var(--mm-text-3)", fontSize: "10px" }}>{h.cell}</div>
          </div>
        ))}
      </div>

      {status === "idle" && <p style={{ color: "var(--mm-text-3)", fontSize: "11px", textAlign: "center" }}>{t("aiStartPlaying")}</p>}
    </div>
  );
}
