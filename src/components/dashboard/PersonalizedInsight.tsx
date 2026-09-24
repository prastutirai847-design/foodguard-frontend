"use client";

import { Target, ArrowRight } from "lucide-react";
import type { DashboardLabels } from "@/data/dashboard-labels";
import type { UserPreference } from "@/data/mock-data";

type PersonalizedInsightProps = {
  labels: DashboardLabels["personalized"];
  preferences: UserPreference;
  onEdit: () => void;
};

export function PersonalizedInsight({
  labels,
  preferences,
  onEdit,
}: PersonalizedInsightProps) {
  const hasGoals = Boolean(preferences.goal || preferences.focuses.length > 0);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-border sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Target className="size-4.5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">{labels.title}</h2>
            <p className="text-xs text-muted-foreground">Tailored dietary guidance</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="group inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-muted/70 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {labels.editButton}
          <ArrowRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>

      {hasGoals ? (
        <div className="flex flex-wrap items-center gap-2">
          {preferences.goal && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="text-[11px] font-normal text-muted-foreground">{labels.goalLabel}:</span>
              <span className="capitalize">{preferences.goal}</span>
            </div>
          )}
          {preferences.focuses.map((focus) => (
            <div key={focus} className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/60 px-3 py-1 text-xs font-medium text-foreground">
              <span className="text-[11px] font-normal text-muted-foreground">{labels.focusLabel}:</span>
              <span>{focus}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          No personal dietary limits configured yet. Set allergens or health targets in your profile to highlight concerns automatically on scanned products.
        </p>
      )}
    </div>
  );
}
