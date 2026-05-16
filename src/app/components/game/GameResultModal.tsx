import { BombIcon, CrownIcon } from "hugeicons-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useT } from "../../i18n/LocaleProvider";
import type { GameStatus } from "./useGameLogic";

type GameMode = "classic" | "noFlags" | "timed" | "daily";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: Exclude<GameStatus, "idle" | "playing">;
  mode: GameMode;
  timeLabel: string;
  minesFound?: number;
  onRestart: () => void;
};

export function GameResultModal({ open, onOpenChange, status, mode, timeLabel, minesFound = 0, onRestart }: Props) {
  const t = useT();
  const won = status === "won";
  const isTimed = mode === "timed";
  const title = won ? t("gameResultWonTitle") : t("gameResultLostTitle");
  const description = won
    ? isTimed
      ? `${t("gameResultTimedWin")} ${minesFound} ${t("boardMines")}.`
      : `${t("gameResultWinTime")} ${timeLabel}.`
    : t("gameResultLostDesc");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border p-0 overflow-hidden"
        style={{ background: "var(--mm-modal-bg)", borderColor: "var(--mm-border-2)" }}
      >
        <div className="p-6">
          <DialogHeader className="items-center text-center">
            <div
              className="mb-2 grid h-12 w-12 place-items-center rounded-full"
              style={{ background: won ? "var(--mm-green-glow)" : "var(--mm-red-glow)" }}
            >
              {won ? <CrownIcon size={24} color="var(--mm-green)" /> : <BombIcon size={24} color="var(--mm-red)" />}
            </div>
            <DialogTitle style={{ color: "var(--mm-text)", fontSize: "22px", fontWeight: 800 }}>
              {title}
            </DialogTitle>
            <DialogDescription style={{ color: "var(--mm-text-2)", fontSize: "14px", lineHeight: 1.5 }}>
              {description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 sm:justify-center">
            <Button
              onClick={() => {
                onOpenChange(false);
                onRestart();
              }}
              className="w-full sm:w-auto"
              style={{ background: "var(--mm-action-bg)", color: "var(--mm-action-fg)" }}
            >
              {t("controlsNewGame")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
