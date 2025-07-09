// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // This is the crucial missing part.
    // It tells Tailwind to scan all .ts and .tsx files in the src folder.
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // We can add our brand colors here for easy use later.
      colors: {
        'brand-dark': '#0A2647',
        'brand-primary': '#205295',
        'brand-secondary': '#2C74B3',
        'brand-light': '#F8F7F4',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;