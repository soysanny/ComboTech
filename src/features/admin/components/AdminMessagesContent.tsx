"use client";

import { Mail, Phone } from "lucide-react";
import { AdminPageShell } from "@/components/layout/AdminPageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAdminMessages } from "../hooks/useAdmin";
import { formatDateTime } from "@/utils/formatDate";

export function AdminMessagesContent() {
  const { data, isLoading, isError, error } = useAdminMessages();
  const messages = data?.data ?? [];

  return (
    <AdminPageShell
      title="Contact Messages"
      description="Inquiries submitted through the storefront contact form."
    >
      {isLoading ? (
        <Skeleton className="h-60 w-full" />
      ) : isError ? (
        <EmptyState
          title="Failed to load messages"
          description={error?.message ?? "Something went wrong."}
          action={
            <Button onClick={() => window.location.reload()}>Try again</Button>
          }
        />
      ) : messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Customer inquiries will appear here."
        />
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <Card key={message.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <p className="font-semibold">{message.name}</p>
                  <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                    <a
                      href={`mailto:${message.email}`}
                      className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
                    >
                      <Mail className="size-3.5" />
                      {message.email}
                    </a>
                    {message.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="size-3.5" />
                        {message.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {message.subject}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {formatDateTime(message.createdAt)}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{message.message}</p>
            </Card>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
