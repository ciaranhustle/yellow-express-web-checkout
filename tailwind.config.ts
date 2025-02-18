import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--primary))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        accent: "rgb(var(--accent))",
      },
      fontFamily: {
        "gt-walsheim-pro": ["var(--font-gt-walsheim-pro)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
