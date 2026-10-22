"use client";

export interface FormErrorProps {
  message?: string;
}

/** Inline field error message with assertive live region. */
export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return (
    <p role="alert" className="text-destructive mt-1 text-sm">
      {message}
    </p>
  );
}
