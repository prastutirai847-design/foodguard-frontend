"use client";

import { AlertTriangle, Minus, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardLabels } from "@/data/dashboard-labels";
import type { ConcernLevel } from "@/data/mock-data";

type ProductOverviewProps = {
  labels: DashboardLabels["summary"];
  summary: { high: number; moderate: number; low: number };
  onViewHistory: () => void;
};

const levels: { key: ConcernLevel; icon: typeof AlertTriangle; colors: { card: string; icon: string; text: string } }[] = [
  { key: "high", icon: AlertTriangle, colors: { card: "border-rose-200/60 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20", icon: "text-rose-600 dark:text-rose-400", text: "text-rose-700 dark:text-rose-300" } },
  { key: "moderate", icon: Minus, colors: { card: "border-amber-200/60 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20", icon: "text-amber-600 dark:text-amber-400", text: "text-amber-700 dark:text-amber-300" } },
  { key: "low", icon: CheckCircle, colors: { card: "border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20", icon: "text-emerald-600 dark:text-emerald-400", text: "text-emerald-700 dark:text-emerald-300" } },
];

export function ProductOverview({ labels, summary, onViewHistory }: ProductOverviewProps) {
  const countLabels: Record<ConcernLevel, string> = { high: labels.highCount, moderate: labels.moderateCount, low: labels.lowCount };
  const nameLabels: Record<ConcernLevel, string> = { high: labels.high, moderate: labels.moderate, low: labels.low };

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs sm:p-6">
      <h2 className="mb-4 text-base font-semibold tracking-tight text-foreground">{labels.title}</h2>
      <div className="grid grid-cols-3 gap-3">
        {levels.map(({ key, icon: Icon, colors }) => (
          <div key={key} className={cn("flex flex-col items-center rounded-xl border p-3.5 text-center transition-all", colors.card)}>
            <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-background/60 shadow-2xs">
              <Icon className={cn("size-4", colors.icon)} aria-hidden="true" />
            </div>
            <span className={cn("text-2xl font-bold tracking-tight", colors.text)}>{summary[key]}</span>
            <span className="mt-1 text-xs font-medium text-foreground/80">{nameLabels[key]}</span>
            <span className="text-[11px] text-muted-foreground">{countLabels[key].replace("{count}", String(summary[key]))}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onViewHistory}
        className="mt-4 flex h-11 w-full items-center justify-center rounded-xl border border-border/80 bg-background px-4 text-xs font-semibold text-foreground transition-all hover:bg-muted/70 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {labels.viewButton}
      </button>
    </div>
  );
}
