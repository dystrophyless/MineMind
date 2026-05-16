import { FlashIcon } from "hugeicons-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useT } from "../../i18n/LocaleProvider";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DailyAttemptModal({ open, onOpenChange }: Props) {
  const t = useT();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border"
        style={{ background: "var(--mm-modal-bg)", borderColor: "var(--mm-border-2)" }}
      >
        <DialogHeader className="items-center text-center">
          <div className="mb-2 grid h-11 w-11 place-items-center rounded-full" style={{ background: "var(--mm-amber-glow)" }}>
            <FlashIcon size={22} color="var(--mm-amber)" />
          </div>
          <DialogTitle style={{ color: "var(--mm-text)", fontSize: "20px", fontWeight: 800 }}>
            {t("dailyAttemptAlreadyUsedTitle")}
          </DialogTitle>
          <DialogDescription style={{ color: "var(--mm-text-2)", fontSize: "14px", lineHeight: 1.5 }}>
            {t("dailyAttemptAlreadyUsed")}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
