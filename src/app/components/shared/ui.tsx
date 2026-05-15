import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  loading?: boolean;
  tooltip?: string;
};

export function Button({ className, variant = "primary", loading = false, tooltip, children, ...props }: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 px-4 py-2 text-sm font-bold transition active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "border-border bg-accent text-surface shadow-tactile hover:brightness-105",
        variant === "secondary" && "border-border bg-elevated text-text shadow-tactile hover:bg-surface",
        variant === "ghost" && "border-transparent bg-transparent text-text hover:border-border hover:bg-elevated",
        variant === "icon" && "h-11 w-11 border-border bg-elevated p-0 text-text shadow-tactile",
        className
      )}
      title={tooltip}
      aria-label={tooltip}
      {...props}
    >
      {loading ? <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent" /> : children}
    </button>
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={cx("rounded-md border-2 border-border bg-surface p-4 shadow-tactile", className)} {...props} />;
}

export function StatBadge({ label, value, className }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-md border-2 border-border bg-elevated px-3 py-2", className)}>
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-text">{value}</p>
    </div>
  );
}

export function AIHintBadge({ label, probability }: { label: string; probability: number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border-2 border-border bg-elevated px-3 py-2">
      <span className="text-sm font-bold text-text">{label}</span>
      <span className="rounded-md bg-accent px-2 py-1 text-xs font-bold text-surface">{probability}%</span>
    </div>
  );
}

export function ProUpgradeBadge({ features, title }: { title: string; features: string[] }) {
  return (
    <Card className="bg-elevated">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-text">{title}</h3>
        <span className="rounded-md border-2 border-border bg-warning px-2 py-1 text-xs font-bold text-surface">PRO</span>
      </div>
      <ul className="mt-3 space-y-2 text-sm font-medium text-muted">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </Card>
  );
}

export function LeaderboardRow({
  rank,
  name,
  time,
  current
}: {
  rank: number;
  name: string;
  time: string;
  current?: boolean;
}) {
  return (
    <div
      className={cx(
        "grid grid-cols-[44px_1fr_64px] items-center gap-2 rounded-md border-2 border-border px-3 py-2 text-sm",
        current ? "bg-accent text-surface" : "bg-elevated text-text"
      )}
    >
      <strong>#{rank}</strong>
      <span className="truncate font-bold">{name}</span>
      <span>{time}</span>
    </div>
  );
}
