import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-out outline-none select-none focus-visible:ring-[3px] focus-visible:ring-offset-2 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(120deg,oklch(0.75_0.15_245),oklch(0.68_0.14_210))] text-slate-950 shadow-[0_10px_28px_-16px_rgba(56,189,248,0.75)] hover:shadow-[0_14px_34px_-14px_rgba(56,189,248,0.9)] hover:brightness-110 active:brightness-95",
        outline:
          "text-foreground hover:text-foreground border border-[var(--surface-border)] bg-[var(--surface-bg)] shadow-[0_10px_30px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md hover:border-[var(--surface-border-hover)] hover:bg-[var(--hover-bg)] aria-expanded:bg-[var(--hover-bg)]",
        secondary:
          "text-foreground border border-[var(--surface-border)] bg-[var(--hover-bg)] shadow-sm backdrop-blur-md hover:bg-[var(--surface-bg-hover)] hover:shadow-sm aria-expanded:bg-[var(--hover-bg)]",
        ghost:
          "text-muted-foreground hover:text-foreground aria-expanded:text-foreground hover:bg-[var(--hover-bg)] aria-expanded:bg-[var(--hover-bg)]",
        destructive:
          "border border-rose-400/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 focus-visible:border-rose-400/40 focus-visible:ring-rose-400/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-3.5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-7 gap-1.5 rounded-[min(var(--radius-md),10px)] px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-[min(var(--radius-md),12px)] px-3 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 px-5 text-base",
        icon: "size-9",
        "icon-xs":
          "size-7 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
