"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ProductGalleryProps {
  images: string[];
  alt: string;
}

/** Product image gallery with thumbnail navigation. */
export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());

  const safeImages = images.length > 0 ? images : [];

  return (
    <div className="space-y-4">
      <div className="surface-glass aspect-square overflow-hidden rounded-2xl">
        {safeImages[selected] && !failed.has(selected) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={safeImages[selected]}
            alt={alt}
            className="h-full w-full object-contain p-6"
            onError={() => setFailed((prev) => new Set(prev).add(selected))}
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-6xl font-bold">
            {alt.charAt(0)}
          </div>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelected(index)}
              className={cn(
                "surface-inset relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--surface-border)] transition-all",
                selected === index
                  ? "ring-primary ring-2"
                  : "opacity-70 hover:opacity-100",
              )}
              aria-label={`View image ${index + 1}`}
              aria-pressed={selected === index}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
