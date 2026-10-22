"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ImageUrlInput({
  className,
  value = "",
  onChange,
  label,
  placeholder = "Paste image URL...",
  ...props
}: Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> & {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
}) {
  const [previewFailed, setPreviewFailed] = React.useState(false);

  const showPreview = value.length > 0;
  const hasValidUrl = /^https?:\/\/.+\.(png|jpg|jpeg|gif|webp|svg)/i.test(value);

  React.useEffect(() => {
    setPreviewFailed(false);
  }, [value]);

  const inputId = React.useId();

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <Input
        id={inputId}
        type="url"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        {...props}
      />
      {showPreview && (
        <div className="border-border relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border bg-neutral-50 dark:bg-neutral-900">
          {previewFailed || !hasValidUrl ? (
            <p className="text-muted-foreground px-4 text-center text-xs">
              {!hasValidUrl && value.length > 0
                ? "Not a valid image URL"
                : "Preview failed to load"}
            </p>
          ) : (
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-contain"
              onError={() => setPreviewFailed(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export { ImageUrlInput };
