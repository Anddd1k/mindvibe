import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mv: {
          bg: "#0a0a0a",
          panel: "#101010",
          border: "#1f1f1f",
          text: "#eaeaea",
          muted: "#9a9a9a",
          lime: "#c8ff00"
        }
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      letterSpacing: {
        tightish: "-0.02em"
      }
    }
  },
  plugins: []
} satisfies Config;

