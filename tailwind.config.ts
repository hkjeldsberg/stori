import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/contexts/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        script: ["var(--font-script)", "cursive"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        mint: {
          50: "#eef5ee",
          100: "#d9ead9",
          200: "#c4dfd0",
          300: "#b8d4c5",
          400: "#9dc0ae",
          500: "#86a598",
        },
        coral: {
          400: "#ee9878",
          500: "#e88966",
          600: "#d0714e",
          700: "#b55d3d",
        },
        cream: {
          50: "#fbf8f0",
          100: "#f6f0e2",
          200: "#ecdfc6",
        },
        ink: {
          900: "#2c1d10",
          800: "#3d2817",
          700: "#5a3f26",
          600: "#6b5843",
          500: "#8b7660",
        },
      },
      boxShadow: {
        card: "0 18px 40px rgba(44, 29, 16, 0.10), 0 2px 6px rgba(44, 29, 16, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
