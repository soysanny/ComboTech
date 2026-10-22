"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  /** Controlled 6-digit value. */
  value: string;
  /** Called with the full 6-digit string whenever it changes. */
  onChange: (value: string) => void;
  /** Optional error/validation state styling. */
  error?: boolean;
  /** Disable all inputs. */
  disabled?: boolean;
  /** Accessible label for the OTP input group. */
  ariaLabel?: string;
  /** Id forwarded to the first input for label association. */
  id?: string;
  className?: string;
}

export interface OtpInputRef {
  /** Focus the first input box. */
  focus: () => void;
}

const OTP_LENGTH = 6;

/**
 * Modern 6-digit OTP input component.
 *
 * - Six separate boxes arranged horizontally.
 * - Typing auto-advances to the next box.
 * - Backspace moves to the previous box when empty.
 * - Pasting a 6-digit value fills all boxes.
 * - Mobile friendly with large tap targets.
 */
export const OtpInput = forwardRef<OtpInputRef, OtpInputProps>(
  (
    {
      value,
      onChange,
      error = false,
      disabled = false,
      ariaLabel = "One-time password",
      id,
      className,
    },
    ref,
  ) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const digits = Array.from(
      { length: OTP_LENGTH },
      (_, index) => value[index] ?? "",
    );

    useImperativeHandle(ref, () => ({
      focus: () => {
        const firstEmptyIndex = digits.findIndex((d) => !d);
        const index = firstEmptyIndex === -1 ? OTP_LENGTH - 1 : firstEmptyIndex;
        inputsRef.current[index]?.focus();
      },
    }));

    useEffect(() => {
      // Focus the first empty input whenever the component mounts or becomes enabled.
      if (disabled) return;
      const firstEmptyIndex = digits.findIndex((d) => !d);
      const index = firstEmptyIndex === -1 ? OTP_LENGTH - 1 : firstEmptyIndex;
      inputsRef.current[index]?.focus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled]);

    const updateValue = (newDigits: string[]) => {
      const next = newDigits.join("").slice(0, OTP_LENGTH);
      if (next !== value) {
        onChange(next);
      }
      return next;
    };

    const focusInput = (index: number) => {
      const clamped = Math.max(0, Math.min(OTP_LENGTH - 1, index));
      inputsRef.current[clamped]?.focus();
    };

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      index: number,
    ) => {
      const raw = event.target.value;
      const char = raw.slice(-1);
      if (!/^\d*$/.test(char)) return;

      const newDigits = [...digits];
      newDigits[index] = char;
      const next = updateValue(newDigits);

      if (char && index < OTP_LENGTH - 1) {
        focusInput(index + 1);
      }

      // If the user typed the last digit, keep focus on the last input.
      if (next.length === OTP_LENGTH) {
        focusInput(OTP_LENGTH - 1);
      }
    };

    const handleKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
      index: number,
    ) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        const newDigits = [...digits];

        if (newDigits[index]) {
          newDigits[index] = "";
          updateValue(newDigits);
        } else if (index > 0) {
          newDigits[index - 1] = "";
          updateValue(newDigits);
          focusInput(index - 1);
        }
        return;
      }

      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        focusInput(index - 1);
        return;
      }

      if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
        event.preventDefault();
        focusInput(index + 1);
        return;
      }

      if (event.key === "Delete") {
        event.preventDefault();
        const newDigits = [...digits];
        newDigits[index] = "";
        updateValue(newDigits);
        return;
      }

      // Allow only digits and navigation keys.
      if (
        event.key.length === 1 &&
        !/^\d$/.test(event.key) &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        event.preventDefault();
      }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
      if (!pasted) return;

      const newDigits = [...digits];
      for (let i = 0; i < pasted.length && i < OTP_LENGTH; i++) {
        newDigits[i] = pasted[i];
      }
      updateValue(newDigits);

      const nextEmpty = newDigits.findIndex((d) => !d);
      focusInput(nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      event.target.select();
    };

    return (
      <div
        className={cn("flex justify-center gap-2 sm:gap-3", className)}
        role="group"
        aria-label={ariaLabel}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            id={index === 0 ? id : undefined}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`${ariaLabel} digit ${index + 1} of ${OTP_LENGTH}`}
            onChange={(event) => handleChange(event, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            className={cn(
              "size-11 rounded-lg border bg-white/60 text-center text-lg font-semibold shadow-sm transition-all duration-200 outline-none sm:size-12",
              "focus-visible:border-primary/60 focus-visible:ring-primary/20 focus-visible:bg-white focus-visible:ring-[3px]",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-destructive ring-destructive/20 text-destructive"
                : "border-input text-foreground",
              "dark:bg-white/5",
            )}
          />
        ))}
      </div>
    );
  },
);

OtpInput.displayName = "OtpInput";
