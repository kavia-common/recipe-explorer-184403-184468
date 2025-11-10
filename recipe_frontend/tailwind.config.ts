import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        // Ocean Professional theme anchors
        ocean: {
          primary: "#2563EB", // blue-600
          secondary: "#F59E0B", // amber-500
          error: "#EF4444",
          surface: "#ffffff",
          background: "#f9fafb",
          text: "#111827",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
