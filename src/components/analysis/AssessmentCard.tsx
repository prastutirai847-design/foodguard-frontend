import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import type { AssessmentLevel } from "@/data/analysis-data";

type AssessmentCardProps = {
  level: AssessmentLevel;
  label: string;
  description: string;
  score: number;
  showScore?: boolean;
};

const CONFIG: Record<
  AssessmentLevel,
  {
    icon: typeof CheckCircle2;
    bg: string;
    iconColor: string;
    borderColor: string;
    labelColor: string;
    badgeBg: string;
  }
> = {
  low: {
    icon: CheckCircle2,
    bg: "bg-emerald-50/50 dark:bg-emerald-950/25",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200/70 dark:border-emerald-900/50",
    labelColor: "text-emerald-800 dark:text-emerald-300",
    badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  moderate: {
    icon: AlertCircle,
    bg: "bg-amber-50/50 dark:bg-amber-950/25",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200/70 dark:border-amber-900/50",
    labelColor: "text-amber-800 dark:text-amber-300",
    badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  high: {
    icon: AlertTriangle,
    bg: "bg-rose-50/50 dark:bg-rose-950/25",
    iconColor: "text-rose-600 dark:text-rose-400",
    borderColor: "border-rose-200/70 dark:border-rose-900/50",
    labelColor: "text-rose-800 dark:text-rose-300",
    badgeBg: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
  insufficient: {
    icon: HelpCircle,
    bg: "bg-muted/40 dark:bg-muted/20",
    iconColor: "text-muted-foreground",
    borderColor: "border-border/80",
    labelColor: "text-foreground",
    badgeBg: "bg-muted text-muted-foreground border-border",
  },
};

export function AssessmentCard({
  level,
  label,
  description,
  score,
  showScore = true,
}: AssessmentCardProps) {
  const config = CONFIG[level] ?? CONFIG.insufficient;
  const Icon = config.icon;

  const scoreColor =
    score >= 4.0
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 2.0
        ? "text-amber-600 dark:text-amber-400"
        : "text-rose-600 dark:text-rose-400";

  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border ${config.borderColor} ${config.bg} p-4.5 shadow-2xs transition-all sm:p-5`}
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card shadow-xs ring-1 ring-border/50">
        <Icon className={`size-5.5 ${config.iconColor}`} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Safety Assessment
          </span>
          <span className={`inline-flex items-center rounded-full border px-2 py-0.2 text-[10px] font-semibold ${config.badgeBg}`}>
            {level.toUpperCase()}
          </span>
        </div>
        <h2 className={`mt-0.5 text-base font-bold tracking-tight ${config.labelColor}`}>
          {label}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {showScore && (
        <div className="flex shrink-0 flex-col items-end pl-2">
          <span className={`text-2xl font-bold tracking-tight ${scoreColor}`}>
            {score.toFixed(1)}
          </span>
          <span className="text-[10px] text-muted-foreground">/ 5.0</span>
        </div>
      )}
    </div>
  );
}
