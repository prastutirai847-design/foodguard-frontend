"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Minus,
  SkipForward,
  Scale,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  FileText,
} from "lucide-react";
import type { LegalMetrologyResult, ComplianceStatus } from "@/services/regulatory/legal-metrology";

type LegalMetrologySectionProps = {
  result: LegalMetrologyResult | null;
};

const STATUS_CONFIG: Record<
  ComplianceStatus,
  { color: string; bg: string; Icon: typeof CheckCircle2; label: string }
> = {
  COMPLIANT: {
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    Icon: CheckCircle2,
    label: "Compliant",
  },
  NON_COMPLIANT: {
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    Icon: XCircle,
    label: "Non-Compliant",
  },
  REVIEW_REQUIRED: {
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    Icon: AlertTriangle,
    label: "Review Required",
  },
  NOT_APPLICABLE: {
    color: "text-muted-foreground",
    bg: "bg-muted border-border",
    Icon: Minus,
    label: "Not Applicable",
  },
};

function StatusBadge({ status }: { status: ComplianceStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.REVIEW_REQUIRED;
  const Icon = config.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.bg} ${config.color}`}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}

function CheckItem({ check }: { check: LegalMetrologyResult["checks"][0] }) {
  const isPass = check.result === "PASS";
  const isFail = check.result === "FAIL";
  const isReview = check.result === "REVIEW";

  const resultColor = isPass
    ? "text-emerald-600 dark:text-emerald-400"
    : isFail
      ? "text-rose-600 dark:text-rose-400"
      : isReview
        ? "text-amber-600 dark:text-amber-400"
        : "text-muted-foreground";

  const Icon = isPass
    ? CheckCircle2
    : isFail
      ? XCircle
      : isReview
        ? AlertTriangle
        : check.result === "SKIPPED"
          ? SkipForward
          : Minus;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-background/50 p-2.5">
      <Icon className={`mt-0.5 size-4 shrink-0 ${resultColor}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">{check.rule}</span>
          <span className={`text-[11px] font-semibold ${resultColor}`}>{check.result}</span>
        </div>
        <p className="mt-0.5 text-xs text-foreground">{check.requirement}</p>
        {check.note && (
          <p className="mt-1 text-[11px] text-muted-foreground">{check.note}</p>
        )}
      </div>
    </div>
  );
}

function ViolationItem({ violation }: { violation: LegalMetrologyResult["violations"][0] }) {
  const isHigh = violation.severity === "HIGH";
  const isMedium = violation.severity === "MEDIUM";

  const severityColor = isHigh
    ? "text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/20"
    : isMedium
      ? "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20"
      : "text-muted-foreground bg-muted border-border";

  return (
    <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-50/40 p-3 dark:border-rose-900/40 dark:bg-rose-950/20">
      <AlertOctagon className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${severityColor}`}>
            {violation.severity}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">{violation.rule}</span>
        </div>
        <p className="mt-1 text-xs text-foreground">{violation.message}</p>
        {violation.source_id && (
          <p className="mt-1 text-[11px] text-muted-foreground">Source: {violation.source_id}</p>
        )}
      </div>
    </div>
  );
}

function ReviewItem({ item }: { item: LegalMetrologyResult["review_items"][0] }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-50/40 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">{item.code}</span>
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
            {item.severity}
          </span>
        </div>
        <p className="mt-1 text-xs text-foreground">{item.message}</p>
      </div>
    </div>
  );
}

export function LegalMetrologySection({ result }: LegalMetrologySectionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!result) return null;

  const passedChecks = result.checks.filter((c) => c.result === "PASS").length;
  const failedChecks = result.checks.filter((c) => c.result === "FAIL").length;
  const reviewChecks = result.checks.filter((c) => c.result === "REVIEW").length;
  const totalChecks = result.checks.length;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Scale className="size-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Legal Metrology Check
              </h3>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                India
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Packaged Commodities Rules, 2011
            </p>
          </div>
        </div>
        <StatusBadge status={result.status} />
      </div>

      {/* Summary stats */}
      <div className="mb-4 grid grid-cols-4 gap-2.5">
        <div className="rounded-xl border border-border/60 bg-muted/40 p-2.5 text-center">
          <div className="text-lg font-bold text-foreground">{totalChecks}</div>
          <div className="text-[11px] text-muted-foreground">Total Checks</div>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-2.5 text-center dark:bg-emerald-950/20">
          <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{passedChecks}</div>
          <div className="text-[11px] text-muted-foreground">Passed</div>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-50/50 p-2.5 text-center dark:bg-rose-950/20">
          <div className="text-lg font-bold text-rose-700 dark:text-rose-400">{failedChecks}</div>
          <div className="text-[11px] text-muted-foreground">Failed</div>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-50/50 p-2.5 text-center dark:bg-amber-950/20">
          <div className="text-lg font-bold text-amber-700 dark:text-amber-400">{reviewChecks}</div>
          <div className="text-[11px] text-muted-foreground">Review</div>
        </div>
      </div>

      {/* Detected Product info */}
      {result.product && (
        <div className="mb-4 rounded-xl border border-border/70 bg-muted/30 p-3.5">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Detected Packaging Declarations
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            {result.product.product_name && (
              <span className="font-medium text-foreground">{result.product.product_name}</span>
            )}
            {result.product.net_quantity && (
              <span className="text-muted-foreground">
                Net Qty: <strong className="text-foreground">{result.product.net_quantity.value} {result.product.net_quantity.unit}</strong>
              </span>
            )}
            {result.product.mrp && (
              <span className="text-muted-foreground">
                MRP: <strong className="text-foreground">₹{result.product.mrp.value}</strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Violations */}
      {result.violations.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Violations ({result.violations.length})
          </h4>
          <div className="space-y-2">
            {result.violations.map((v, i) => (
              <ViolationItem key={i} violation={v} />
            ))}
          </div>
        </div>
      )}

      {/* Review items */}
      {result.review_items.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Review Items ({result.review_items.length})
          </h4>
          <div className="space-y-2">
            {result.review_items.map((item, i) => (
              <ReviewItem key={i} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Expandable checks */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex w-full items-center justify-between border-t border-border/60 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>
          {expanded ? "Hide" : "Show"} statutory checks breakdown ({totalChecks})
        </span>
        {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>

      {expanded && (
        <div className="mt-2.5 max-h-96 space-y-1.5 overflow-y-auto pr-1">
          {result.checks.map((check, i) => (
            <CheckItem key={i} check={check} />
          ))}
        </div>
      )}

      {/* Sources */}
      {result.sources.length > 0 && (
        <div className="mt-3 border-t border-border/60 pt-3">
          <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="size-3" />
            Legal Authorities
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {result.sources.map((src, i) => (
              <span key={i} className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                {src.source_id}: {src.title?.substring(0, 45)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      {result.disclaimer && (
        <p className="mt-3 text-[11px] italic text-muted-foreground/80">{result.disclaimer}</p>
      )}
    </div>
  );
}
