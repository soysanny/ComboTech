"use client";

import { Stepper, type StepperProps } from "@/components/ui/stepper";
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_TIMELINE,
  type OrderStatus,
} from "@/constants/orderStatus";

export interface StatusStepperProps
  extends Omit<StepperProps, "steps" | "activeStep"> {
  status: OrderStatus;
  timestamps?: Partial<Record<OrderStatus, string>>;
  cancelledAt?: string;
}

/** Order lifecycle visual stepper. Reused across customer order views. */
export function StatusStepper({
  status,
  timestamps,
  cancelledAt,
  orientation = "vertical",
  className,
  ...props
}: StatusStepperProps) {
  if (status === ORDER_STATUS.cancelled) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive text-sm">
        This order has been cancelled
        {cancelledAt ? ` on ${cancelledAt}` : ""}.
      </div>
    );
  }

  const activeIndex = ORDER_TIMELINE.indexOf(status);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeStep = ORDER_TIMELINE[safeIndex];

  const steps = ORDER_TIMELINE.map((step) => ({
    id: step,
    label: ORDER_STATUS_LABELS[step],
    timestamp: timestamps?.[step],
  }));

  return (
    <Stepper
      steps={steps}
      activeStep={activeStep}
      orientation={orientation}
      className={className}
      {...props}
    />
  );
}
