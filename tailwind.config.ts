import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 is configured primarily through CSS (`@theme` in
 * `src/app/globals.css`). This file exists for tooling that expects a config
 * module and to declare content sources and the class-based dark mode strategy
 * used by the Redux theme slice.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        mobile: "320px",
        tablet: "768px",
        laptop: "1024px",
        desktop: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
