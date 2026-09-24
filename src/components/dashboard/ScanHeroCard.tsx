"use client";

import { ScanLine } from "lucide-react";
import type { DashboardLabels } from "@/data/dashboard-labels";

type ScanHeroCardProps = {
  labels: DashboardLabels["scan"];
  onScan: () => void;
};

export function ScanHeroCard({ labels, onScan }: ScanHeroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/6 via-card to-card p-6 shadow-xs transition-all hover:border-primary/30 sm:p-8">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
        <div className="mb-4 sm:mb-0 sm:mr-6">
          <div className="mx-auto flex size-15 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 shadow-xs sm:mx-0">
            <ScanLine className="size-7.5" aria-hidden="true" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary mb-1.5">
            Quick Identification
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {labels.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {labels.subtitle}
          </p>
        </div>
        <div className="mt-5 sm:mt-0 sm:ml-6">
          <button
            type="button"
            onClick={onScan}
            className="group inline-flex h-12 items-center gap-2.5 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <ScanLine className="size-4.5 transition-transform group-hover:scale-110" aria-hidden="true" />
            {labels.scanButton}
          </button>
        </div>
      </div>
    </div>
  );
}
