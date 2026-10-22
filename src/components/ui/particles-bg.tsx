"use client";

import { useEffect, useId } from "react";
import { cn } from "@/lib/utils";

export interface ParticlesColors {
  particles: string;
  lines: string;
  accent: string;
}

export interface ParticlesBgProps {
  className?: string;
  /** Render the built-in blue gradient background. Disable to layer over your own. */
  background?: boolean;
  /** Particle count. */
  quantity?: number;
  /** Force a color theme instead of auto-detecting from the document. */
  theme?: "auto" | "dark" | "light";
  /** Override the default particle / line / accent colors. */
  colors?: ParticlesColors;
}

const DARK_COLORS: ParticlesColors = {
  particles: "#00f5ff",
  lines: "#00d9ff",
  accent: "#0096c7",
};

const LIGHT_COLORS: ParticlesColors = {
  particles: "#0277bd",
  lines: "#0288d1",
  accent: "#039be5",
};

function isDarkDocument() {
  const html = document.documentElement;
  return (
    html.classList.contains("dark") ||
    html.getAttribute("data-theme") === "dark"
  );
}

/** Destroy only the particles.js instances bound to `containerId`. */
function destroyInstance(containerId: string) {
  const dom = window.pJSDom;
  if (dom?.length) {
    window.pJSDom = dom.filter((instance) => {
      if (instance.pJS?.canvas?.el?.parentElement?.id === containerId) {
        instance.pJS.fn.vendors.destroypJS();
        return false;
      }
      return true;
    });
  }

  document
    .querySelector(`#${CSS.escape(containerId)} > .particles-js-canvas-el`)
    ?.remove();
}

/**
 * Interactive particle background powered by particles.js. Particles link to
 * the cursor (grab) and spawn more on click (push). Re-initializes when the
 * document theme changes.
 */
export function ParticlesBg({
  className,
  background = true,
  quantity = 140,
  theme = "auto",
  colors,
}: ParticlesBgProps) {
  const containerId = `particles-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | undefined;

    const init = () => {
      if (!window.particlesJS) return;

      const palette =
        colors ??
        (theme === "dark" || (theme === "auto" && isDarkDocument())
          ? DARK_COLORS
          : LIGHT_COLORS);

      destroyInstance(containerId);

      window.particlesJS(containerId, {
        particles: {
          number: {
            value: quantity,
            density: { enable: true, value_area: 800 },
          },
          color: { value: palette.particles },
          shape: {
            type: "circle",
            stroke: { width: 0.5, color: palette.accent },
          },
          opacity: {
            value: 0.7,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0.3 },
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: true, speed: 2, size_min: 1 },
          },
          line_linked: {
            enable: true,
            distance: 160,
            color: palette.lines,
            opacity: 0.4,
            width: 1.2,
          },
          move: { enable: true, speed: 2, random: true, out_mode: "bounce" },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
          modes: {
            grab: { distance: 220, line_linked: { opacity: 0.8 } },
            push: { particles_nb: 4 },
            repulse: { distance: 180, duration: 0.4 },
          },
        },
        retina_detect: true,
      });
    };

    import("particles.js").then(() => {
      if (cancelled) return;
      init();

      observer = new MutationObserver(init);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme"],
      });
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      destroyInstance(containerId);
    };
  }, [containerId, quantity, theme, colors]);

  return (
    <div
      id={containerId}
      aria-hidden
      className={cn(
        "absolute inset-0 h-full w-full transition-colors duration-500",
        background &&
          "bg-gradient-to-tr from-[#e3f2fd] via-[#90caf9] to-[#64b5f6] dark:from-[#000814] dark:via-[#003566] dark:to-[#0077b6]",
        className,
      )}
    />
  );
}

export default ParticlesBg;
