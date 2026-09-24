"use client";

import { useState } from "react";
import { ArrowLeft, Clock, Barcode as BarcodeIcon, Tag, Building2 } from "lucide-react";
import Link from "next/link";
import type { ProductCategory } from "@/data/mock-data";
import { CATEGORY_LABELS } from "@/data/mock-data";

type ProductHeaderProps = {
  name: string;
  brand: string;
  category: ProductCategory;
  barcode: string;
  scanDate: string;
  imageUrl?: string;
  backButton: string;
  scanDateLabel: string;
};

export function ProductHeader({
  name,
  brand,
  category,
  barcode,
  scanDate,
  imageUrl,
  backButton,
  scanDateLabel,
}: ProductHeaderProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex flex-col gap-3.5">
      <Link
        href="/scan"
        className="group inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
        {backButton}
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Product image container with clean outline */}
        <div className="flex size-22 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/80 bg-card p-1.5 shadow-xs">
          {imageUrl && !imageFailed ? (
            <img
              src={imageUrl}
              alt={name}
              className="size-full rounded-xl object-contain"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex size-full items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="text-xl font-bold tracking-tight">
                {initials || "?"}
              </span>
            </div>
          )}
        </div>

        {/* Product metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {brand && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card px-2.5 py-0.5 text-[11px] font-medium text-foreground shadow-2xs">
                <Building2 className="size-3 text-muted-foreground" aria-hidden="true" />
                {brand}
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground shadow-2xs">
                <Tag className="size-3 text-muted-foreground" aria-hidden="true" />
                {CATEGORY_LABELS[category] ?? category}
              </span>
            )}
          </div>

          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {barcode && (
              <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                <BarcodeIcon className="size-3.5" aria-hidden="true" />
                {barcode}
              </span>
            )}
            <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="size-3" aria-hidden="true" />
              <span>{scanDateLabel}: {scanDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
