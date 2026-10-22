import { SITE } from "@/constants/site";

/** Scrolling announcement bar (CC Computer style marquee). */
export function TickerBar() {
  return (
    <div className="pause-on-hover overflow-hidden bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.65_0.16_190))] text-white">
      <div className="animate-marquee flex w-max items-center">
        {[0, 1].map((copy) => (
          <span
            key={copy}
            className="px-8 py-2 text-xs font-medium tracking-wide whitespace-nowrap"
          >
            {SITE.ticker}
          </span>
        ))}
      </div>
    </div>
  );
}
