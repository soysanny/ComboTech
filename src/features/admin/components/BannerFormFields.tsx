"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-xs">{message}</p>;
}

export interface NumberFieldProps {
  id: string;
  label: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  registration: UseFormRegisterReturn;
  className?: string;
}

export function NumberField({
  id,
  label,
  suffix,
  min,
  max,
  step,
  error,
  registration,
  className,
}: NumberFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          className={suffix ? "pr-12" : undefined}
          {...registration}
        />
        {suffix && (
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">
            {suffix}
          </span>
        )}
      </div>
      <FieldError message={error} />
    </div>
  );
}
