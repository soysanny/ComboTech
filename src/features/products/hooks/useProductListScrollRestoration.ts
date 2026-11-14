"use client";

import { useEffect } from "react";
import {
  clearCatalogReturnTarget,
  getCurrentListHref,
  readCatalogReturnTarget,
} from "../lib/catalogNavigation";

const MAX_RESTORE_ATTEMPTS = 40;
const RESTORE_RETRY_MS = 50;

/**
 * Restores the product list scroll offset after a product detail visit.
 *
 * Restoration only runs when this list is the recorded origin and its content
 * is ready, otherwise ordinary visits still start at the top of the page. The
 * retry loop waits for the full grid to render so the saved offset is reachable.
 */
export function useProductListScrollRestoration(ready: boolean) {
  useEffect(() => {
    if (!ready) return;

    const target = readCatalogReturnTarget();
    if (!target) return;
    if (target.listHref !== getCurrentListHref()) return;

    let cancelled = false;
    let attempts = 0;
    let timer: number | undefined;

    const applyScroll = () => {
      if (cancelled) return;

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );

      if (target.scrollY > maxScroll && attempts < MAX_RESTORE_ATTEMPTS) {
        attempts += 1;
        timer = window.setTimeout(applyScroll, RESTORE_RETRY_MS);
        return;
      }

      window.scrollTo({
        top: Math.min(target.scrollY, maxScroll),
        left: 0,
        behavior: "auto",
      });
      clearCatalogReturnTarget();
    };

    // Let the browser paint the loaded list before measuring its height.
    const frame = window.requestAnimationFrame(() => {
      timer = window.setTimeout(applyScroll, 0);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [ready]);
}
