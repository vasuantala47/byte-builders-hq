import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#080B11",
        surface: {
          50: "#1A253A",
          100: "#141D2E",
          200: "#0E1522",
          300: "#0A0F18",
          DEFAULT: "#0E1522",
        },
        border: {
          subtle: "#1C273C",
          DEFAULT: "#24324D",
          bright: "#384B70",
        },
        accent: {
          DEFAULT: "#00F0FF",
          glow: "rgba(0, 240, 255, 0.15)",
          hover: "#38F4FF",
          muted: "rgba(0, 240, 255, 0.1)",
        },
        amber: {
          DEFAULT: "#F59E0B",
          glow: "rgba(245, 158, 11, 0.15)",
        },
        emerald: {
          DEFAULT: "#10B981",
          glow: "rgba(16, 185, 129, 0.15)",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      backgroundImage: {
        "circuit-grid":
          "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.04) 1px, transparent 0)",
        "circuit-grid-dense":
          "linear-gradient(to right, rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.03) 1px, transparent 1px)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
