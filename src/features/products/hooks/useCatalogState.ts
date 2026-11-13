"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  applyCatalogPatch,
  parseCatalogState,
  removeRemovedCatalogParams,
  serializeCatalogState,
  type CatalogPatch,
  type CatalogState,
} from "../lib/catalogState";

/**
 * URL-backed catalog state. A single state object supplies search, brand,
 * category, sort, and comparison state without pagination.
 */
export function useCatalogState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const [state, setState] = useState<CatalogState>(() =>
    parseCatalogState(new URLSearchParams(searchParamsString)),
  );
  const stateRef = useRef(state);
  const lastUrlRef = useRef(searchParamsString);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (searchParamsString === lastUrlRef.current) return;
    const next = parseCatalogState(new URLSearchParams(searchParamsString));
    lastUrlRef.current = searchParamsString;
    stateRef.current = next;
    setState(next);
  }, [searchParamsString]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    if (!removeRemovedCatalogParams(params)) return;
    const cleaned = params.toString();
    lastUrlRef.current = cleaned;
    router.replace(`${pathname}${cleaned ? `?${cleaned}` : ""}`, {
      scroll: false,
    });
  }, [searchParamsString, pathname, router]);

  const commit = useCallback(
    (patch: CatalogPatch) => {
      const next = applyCatalogPatch(stateRef.current, patch);
      stateRef.current = next;
      setState(next);

      const query = serializeCatalogState(next).toString();
      if (query === lastUrlRef.current) return;
      lastUrlRef.current = query;
      router.replace(`${pathname}${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  return { state, commit };
}
