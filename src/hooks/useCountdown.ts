"use client";

import { useEffect, useState } from "react";

export interface UseCountdownOptions {
  /** Initial countdown duration in seconds. */
  seconds: number;
  /** Called when the countdown reaches zero. */
  onComplete?: () => void;
}

export interface UseCountdownReturn {
  /** Whole seconds remaining. */
  remaining: number;
  /** True while the countdown is still running. */
  isRunning: boolean;
  /** True when the countdown has finished. */
  isFinished: boolean;
  /** Restart the countdown with the given duration (defaults to initial seconds). */
  restart: (newSeconds?: number) => void;
}

/**
 * A simple countdown timer that ticks once per second.
 * Useful for OTP resend cooldowns and similar timed UI states.
 */
export function useCountdown({
  seconds,
  onComplete,
}: UseCountdownOptions): UseCountdownReturn {
  const [remaining, setRemaining] = useState(seconds);
  const [isRunning, setIsRunning] = useState(seconds > 0);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remaining, onComplete]);

  const restart = (newSeconds: number = seconds) => {
    setRemaining(Math.max(0, newSeconds));
    setIsRunning(newSeconds > 0);
  };

  return {
    remaining,
    isRunning,
    isFinished: !isRunning && remaining === 0,
    restart,
  };
}
