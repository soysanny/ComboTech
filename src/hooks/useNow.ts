"use client";

import { useSyncExternalStore } from "react";

let cachedNow = Date.now();

function subscribe(callback: () => void): () => void {
  const interval = setInterval(() => {
    cachedNow = Date.now();
    callback();
  }, 1000);
  return () => clearInterval(interval);
}

function getSnapshot(): number {
  // Return the cached timestamp so the snapshot is stable between ticks.
  // The subscribe callback updates cachedNow every second.
  return cachedNow;
}

function getServerSnapshot(): number {
  return cachedNow;
}

/**
 * Returns the current timestamp that updates once per second.
 * The value is cached so getSnapshot returns a stable reference between
  ticks and avoids React's infinite-loop warning.
 */
export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
