"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { SITE, SOCIAL_LINKS, type SocialLink } from "@/constants/site";
import { SocialIcon } from "@/components/icons/social-icons";
import { cn } from "@/lib/utils";

const CHANNEL_COLORS: Record<SocialLink["key"], string> = {
  facebook: "bg-[#1877F2]",
  telegram: "bg-[#229ED9]",
  whatsapp: "bg-[#25D366]",
  wechat: "bg-[#07C160]",
  tiktok: "bg-[#010101]",
};

const CHANNELS = SOCIAL_LINKS.filter((social) => social.key !== "tiktok");

/** One clean contact button that expands into the supported channels. */
export function FloatingContactButtons() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-2"
    >
      {open && (
        <div
          id="contact-channels"
          className="animate-fade-in flex flex-col items-end gap-2 motion-reduce:animate-none"
        >
          {CHANNELS.map((channel) => (
            <a
              key={channel.key}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="bg-card hover:bg-muted inline-flex min-h-10 items-center gap-2.5 rounded-full border py-1.5 pr-3.5 pl-1.5 text-sm font-medium shadow-md transition-colors"
            >
              <span
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-full text-white",
                  CHANNEL_COLORS[channel.key],
                )}
              >
                <SocialIcon name={channel.key} className="size-3.5" />
              </span>
              {channel.label}
            </a>
          ))}
          <a
            href={SITE.phoneHref}
            onClick={() => setOpen(false)}
            className="bg-card hover:bg-muted inline-flex min-h-10 items-center gap-2.5 rounded-full border py-1.5 pr-3.5 pl-1.5 text-sm font-medium shadow-md transition-colors"
          >
            <span className="bg-primary text-primary-foreground inline-flex size-7 items-center justify-center rounded-full">
              <Phone className="size-3.5" />
            </span>
            Call {SITE.phoneDisplay}
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-controls="contact-channels"
        aria-label={open ? "Close contact options" : "Open contact options"}
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex size-12 items-center justify-center rounded-full shadow-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </button>
    </div>
  );
}
