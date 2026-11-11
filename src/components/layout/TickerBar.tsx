import { SITE } from "@/constants/site";

/** Scrolling announcement bar (CC Computer style marquee). */
export function TickerBar() {
  return (
    <div className="pause-on-hover overflow-hidden bg-[linear-gradient(90deg,oklch(0.45_0.14_250),oklch(0.5_0.14_285),oklch(0.45_0.12_210))] text-white">
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
