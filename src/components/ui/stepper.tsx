"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  label: string;
  description?: string;
  timestamp?: string;
}

export interface StepperProps extends React.ComponentProps<"ol"> {
  steps: Step[];
  activeStep: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

function Stepper({
  steps,
  activeStep,
  orientation = "vertical",
  className,
  ...props
}: StepperProps) {
  const activeIndex = steps.findIndex((s) => s.id === activeStep);
  const isHorizontal = orientation === "horizontal";

  return (
    <ol
      data-slot="stepper"
      data-orientation={orientation}
      className={cn(
        "flex list-none",
        isHorizontal
          ? "flex-row items-start justify-between gap-2"
          : "flex-col",
        className,
      )}
      {...props}
    >
      {steps.map((step, index) => {
        const isCompleted = index < activeIndex;
        const isCurrent = step.id === activeStep;
        const isPending = index > activeIndex;
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.id}
            className={cn(
              "relative flex",
              isHorizontal
                ? "flex-1 flex-col items-center text-center"
                : "items-start gap-4 px-1 py-1",
            )}
          >
            {/* Connector line to next step */}
            {!isLast && (
              <div
                className={cn(
                  "bg-muted absolute transition-colors",
                  isHorizontal
                    ? "top-3 left-[calc(50%+1rem)] h-0.5 w-[calc(100%-2rem)]"
                    : "top-8 left-[0.875rem] h-[calc(100%-0.5rem)] w-0.5",
                )}
                aria-hidden="true"
              />
            )}

            {/* Step indicator */}
            <div
              className={cn(
                "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                isCompleted &&
                  "border-success bg-success text-success-foreground",
                isCurrent &&
                  "border-primary bg-primary text-primary-foreground",
                isPending && "border-muted bg-background text-muted-foreground",
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              {isCompleted ? (
                <Check className="size-4" aria-hidden />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            {/* Label + description */}
            <div
              className={cn(
                "min-w-0",
                isHorizontal ? "mt-2 max-w-[8rem] sm:max-w-[10rem]" : "flex-1",
              )}
            >
              <p
                className={cn(
                  "text-sm font-semibold",
                  isPending ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                  {step.description}
                </p>
              )}
              {step.timestamp && (
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {step.timestamp}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { Stepper };
