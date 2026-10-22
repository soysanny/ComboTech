"use client";

import { Phone } from "lucide-react";
import { SITE, SOCIAL_LINKS, type SocialLink } from "@/constants/site";
import { SocialIcon } from "@/components/icons/social-icons";

const BRAND_COLORS: Record<SocialLink["key"], string> = {
  facebook: "bg-[#1877F2]",
  telegram: "bg-[#229ED9]",
  whatsapp: "bg-[#25D366]",
  wechat: "bg-[#07C160]",
  tiktok: "bg-[#010101]",
};

/** Fixed vertical contact rail (CC Computer style floating buttons). */
export function FloatingContactButtons() {
  // Centered in the area below the sticky header/ticker (offset = half header height).
  return (
    <div className="fixed top-[calc(50%+3rem)] right-0 z-30 hidden -translate-y-1/2 flex-col gap-1.5 pr-2 lg:flex">
      {SOCIAL_LINKS.filter((s) => s.key !== "tiktok").map((social) => (
        <a
          key={social.key}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          title={social.label}
          className={`${BRAND_COLORS[social.key]} inline-flex size-9 items-center justify-center rounded-full text-white shadow-md transition-transform duration-200 hover:scale-110`}
        >
          <SocialIcon name={social.key} className="size-4.5" />
        </a>
      ))}
      <a
        href={SITE.phoneHref}
        aria-label={`Call ${SITE.phoneDisplay}`}
        title={`Call ${SITE.phoneDisplay}`}
        className="bg-primary text-primary-foreground inline-flex size-9 items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-110"
      >
        <Phone className="size-4" />
      </a>
    </div>
  );
}
