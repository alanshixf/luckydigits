import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true,
      prefix: "LKC",
      themes: {
        "lkc-light": {
          extend: "light", // <- inherit default values from light theme
          colors: {
            background: "#e3e6e6",
            foreground: "#1f1f1f",
            primary: {
              50: "#DFFCDD",
              100: "#DFFCDD",
              200: "#BDF9BF",
              300: "#98EEA4",
              400: "#7ADE91",
              500: "#50C878",
              600: "#3AAC6B",
              700: "#28905F",
              800: "#197452",
              900: "#0F604A",
              DEFAULT: "#50C878",
              foreground: "#1f1f1f",
            },
            secondary: {
              100: "#D2E9FE",
              200: "#A6D0FD",
              300: "#79B3FB",
              400: "#5898F8",
              500: "#226FF4",
              600: "#1855D1",
              700: "#113FAF",
              800: "#0A2C8D",
              900: "#061E75",
              DEFAULT: "#226FF4",
              foreground: "#1f1f1f",
            },
            danger: {
              100: "#FFE6D6",
              200: "#FFC7AE",
              300: "#FFA186",
              400: "#FF7D68",
              500: "#FF4136",
              600: "#DB272C",
              700: "#B71B2C",
              800: "#93112A",
              900: "#7A0A29",
              DEFAULT: "#FF4136",
              foreground: "#1f1f1f",
            },
            warning: {
              100: "#FFFACC",
              200: "#FFF499",
              300: "#FFEC66",
              400: "#FFE43F",
              500: "#FFD700",
              600: "#DBB500",
              700: "#B79400",
              800: "#937500",
              900: "#7A5F00",
            },
          },
        },
      },
    }),
  ],
};
export default config;
