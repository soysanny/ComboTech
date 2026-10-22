/**
 * Responsive breakpoints (px) shared between JS media-query hooks and design.
 * Mirrors the product spec: 320 / 768 / 1024 / 1440.
 */
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export const MEDIA_QUERIES = {
  mobile: `(min-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px)`,
  laptop: `(min-width: ${BREAKPOINTS.laptop}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
} as const;
