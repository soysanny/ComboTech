import type { ReactNode } from "react";
import { PageWrapper } from "./PageWrapper";

export interface AdminPageShellProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

/** Consistent header shell for admin management pages. */
export function AdminPageShell({
  title,
  description,
  children,
}: AdminPageShellProps) {
  return (
    <PageWrapper contained={false} className="space-y-6">
      <div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </PageWrapper>
  );
}
