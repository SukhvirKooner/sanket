import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          500: "#1a3a5c",
          700: "#153456",
          800: "#0f2a4a",
          900: "#0B1F3A",
        },
        saffron: {
          DEFAULT: "#FF9933",
          dark: "#E07A1A",
        },
        "india-green": {
          DEFAULT: "#138808",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        hindi: ["var(--font-devanagari)", "Noto Sans Devanagari", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
