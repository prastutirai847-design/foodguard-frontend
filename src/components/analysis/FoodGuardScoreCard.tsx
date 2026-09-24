"use client";

import {
  Info,
  CheckCircle2,
  AlertCircle,
  Apple,
  FlaskConical,
  ShieldAlert,
  Cog,
  ShieldCheck,
} from "lucide-react";
import type { FoodGuardScoreResult } from "@/data/analysis-data";

type FoodGuardScoreCardProps = {
  foodguardScore: FoodGuardScoreResult;
  confidenceLabel: string;
};

const COMPONENT_META: Record<
  string,
  { label: string; Icon: typeof Apple; description: string }
> = {
  nutrient: {
    label: "RDA / Nutrients",
    Icon: Apple,
    description: "Macronutrient balance & salt/sugar limits",
  },
  ingredient_profile: {
    label: "Ingredient Profiling",
    Icon: FlaskConical,
    description: "Quality of primary raw ingredients",
  },
  ingredient_concern: {
    label: "Ingredients of Concern",
    Icon: ShieldAlert,
    description: "Additives, preservatives & allergens",
  },
  processing: {
    label: "Processing Level",
    Icon: Cog,
    description: "Ultra-processed (NOVA) index assessment",
  },
};

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  available: {
    bg: "bg-emerald-500/10 border-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  derived: {
    bg: "bg-blue-500/10 border-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
  },
  insufficient: {
    bg: "bg-amber-500/10 border-amber-500/20",
    text: "text-amber-700 dark:text-amber-400",
  },
};

function getScoreBarColor(score: number): string {
  if (score >= 4) return "bg-emerald-500";
  if (score >= 3) return "bg-green-500";
  if (score >= 2) return "bg-amber-500";
  if (score >= 1) return "bg-orange-500";
  return "bg-rose-500";
}

export function FoodGuardScoreCard({
  foodguardScore,
  confidenceLabel,
}: FoodGuardScoreCardProps) {
  const {
    final_score,
    rating,
    confidence,
    components,
    positive_factors,
    negative_factors,
    explanation,
  } = foodguardScore;

  const scoreColor =
    final_score >= 4
      ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
      : final_score >= 3
        ? "text-green-600 dark:text-green-400 border-green-500/30 bg-green-500/5"
        : final_score >= 2
          ? "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5"
          : "text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/5";

  const ratingBadgeColor =
    final_score >= 4
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      : final_score >= 3
        ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
        : final_score >= 2
          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
          : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7.5 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="size-4" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            FoodGuard Health Score
          </h3>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ratingBadgeColor}`}
        >
          {rating}
        </span>
      </div>

      {/* Main score hero dial */}
      <div className="mb-5 flex flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/20 py-5">
        <div
          className={`flex size-24 items-center justify-center rounded-full border-4 ${scoreColor} shadow-inner`}
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold tracking-tight">
              {final_score.toFixed(1)}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">/ 5.0</span>
          </div>
        </div>

        {/* Confidence pill */}
        <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground shadow-2xs">
          <Info className="size-3.5" aria-hidden="true" />
          <span>
            {confidenceLabel}:{" "}
            <strong className="text-foreground">{Math.round(confidence * 100)}%</strong>
          </span>
        </div>
      </div>

      {/* Four component scores */}
      <div className="mb-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Component Scores
          </h4>
          <span className="text-[11px] text-muted-foreground">Weighted out of 5</span>
        </div>
        <div className="space-y-2.5">
          {Object.entries(components).map(([key, comp]) => {
            const meta = COMPONENT_META[key];
            if (!meta) return null;
            const Icon = meta.Icon;
            const statusConfig = STATUS_BADGE[comp.status] ?? STATUS_BADGE.insufficient;

            return (
              <div
                key={key}
                className="rounded-xl border border-border/60 bg-background/60 p-3 transition-colors hover:border-border"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="size-3.5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{meta.label}</p>
                      <p className="text-[10px] text-muted-foreground">{meta.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded border px-1.5 py-0.2 text-[10px] font-medium uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      {comp.status}
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {comp.score.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(comp.score)}`}
                    style={{ width: `${(comp.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Positive and negative factors */}
      {(positive_factors.length > 0 || negative_factors.length > 0) && (
        <div className="mb-4 space-y-3 border-t border-border/60 pt-4">
          {positive_factors.length > 0 && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/30 p-3 dark:bg-emerald-950/20">
              <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Key Positives ({positive_factors.length})
              </h4>
              <ul className="space-y-1">
                {positive_factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/80">
                    <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {negative_factors.length > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-50/30 p-3 dark:bg-amber-950/20">
              <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Areas for Attention ({negative_factors.length})
              </h4>
              <ul className="space-y-1">
                {negative_factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/80">
                    <AlertCircle className="mt-0.5 size-3 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Explanation summary */}
      {explanation && (
        <div className="rounded-xl border border-border/70 bg-muted/40 p-3.5">
          <p className="whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
