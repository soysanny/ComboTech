"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";

export interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

/** Network error state with a retry affordance placed close to the message. */
export function NetworkError({ onRetry, message }: NetworkErrorProps) {
  return (
    <EmptyState
      icon={<WifiOff className="size-8" aria-hidden />}
      title="Connection problem"
      description={
        message ??
        "We couldn't reach the server. Check your connection and try again."
      }
      action={
        onRetry ? (
          <Button onClick={onRetry} variant="outline">
            Retry
          </Button>
        ) : undefined
      }
    />
  );
}
