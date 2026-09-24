"use client";

import { Package, Building2, Barcode } from "lucide-react";
import type { IdentifiedProduct } from "@/types/identification";

type CandidatesListProps = {
  title: string;
  candidates: IdentifiedProduct[];
  pickLabel: string;
  onPick: (product: IdentifiedProduct) => void;
};

export function CandidatesList({ title, candidates, pickLabel, onPick }: CandidatesListProps) {
  if (candidates.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
      {candidates.map((candidate) => (
        <button
          key={candidate.id || candidate.barcode}
          type="button"
          onClick={() => onPick(candidate)}
          className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 text-left shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
        >
          {candidate.imageUrl ? (
            <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/50 p-1">
              <img
                src={candidate.imageUrl}
                alt={candidate.name}
                className="size-full rounded-lg object-contain"
              />
            </span>
          ) : (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Package className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{candidate.name}</p>
            <p className="mt-0.5 flex items-center gap-2 text-xs leading-relaxed text-muted-foreground">
              {candidate.brand && (
                <span className="inline-flex items-center gap-1">
                  <Building2 className="size-3.5" aria-hidden="true" />
                  {candidate.brand}
                </span>
              )}
              {candidate.barcode && (
                <span className="inline-flex items-center gap-1 font-mono">
                  <Barcode className="size-3.5" aria-hidden="true" />
                  {candidate.barcode}
                </span>
              )}
            </p>
          </div>
          <span className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
            {pickLabel}
          </span>
        </button>
      ))}
    </div>
  );
}
