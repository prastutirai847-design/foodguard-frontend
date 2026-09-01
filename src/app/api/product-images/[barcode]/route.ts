import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const IMAGES_DIR = join(process.cwd(), "product-viewer", "images");
const EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png", ".gif", ".svg"];

/**
 * Public base URL for the barcoded product images hosted on Cloudflare R2.
 * When set, requests are redirected to `<R2_PUBLIC_IMAGES_URL>/<barcode>.webp`
 * (object names follow the `product-viewer/images/<barcode>.<ext>` layout that
 * was previously served from the local filesystem). Falls back to local file
 * serving for local development when this is not configured.
 */
const R2_PUBLIC_IMAGES_URL = (process.env.R2_PUBLIC_IMAGES_URL || "").replace(/\/+$/, "");

const MIME_MAP: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ barcode: string }> },
) {
  const { barcode } = await params;

  if (!barcode || barcode.length < 3) {
    return NextResponse.json({ error: "Invalid barcode" }, { status: 400 });
  }

  // Serve from Cloudflare R2 when configured (production/CDN).
  if (R2_PUBLIC_IMAGES_URL) {
    return NextResponse.redirect(
      `${R2_PUBLIC_IMAGES_URL}/${encodeURIComponent(barcode)}.webp`,
      302,
    );
  }

  // Try each extension
  for (const ext of EXTENSIONS) {
    const filepath = join(IMAGES_DIR, `${barcode}${ext}`);
    if (existsSync(filepath)) {
      try {
        const data = readFileSync(filepath);
        return new NextResponse(data, {
          status: 200,
          headers: {
            "Content-Type": MIME_MAP[ext] ?? "application/octet-stream",
            "Cache-Control": "public, max-age=86400, immutable",
          },
        });
      } catch {
        continue;
      }
    }
  }

  return NextResponse.json({ error: "Image not found" }, { status: 404 });
}
