import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8"
        },
        success: "#22c55e",
        danger: "#ef4444",
        warning: "#f59e0b",
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          700: "#334155",
          900: "#0f172a"
        }
      }
    }
  },
  plugins: []
};

export default config;
