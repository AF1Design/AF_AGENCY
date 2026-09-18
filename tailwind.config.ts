import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        af: {
          yellow: "#FFE500",
          "yellow-hover": "#F0D700",
          "yellow-light": "#FFF58A",
          dark: "#060709",
          "dark-alt": "#0B0D12",
          card: "rgba(14, 17, 23, 0.8)",
          "card-solid": "#0E1117",
          "card-hover": "rgba(22, 26, 36, 0.95)",
          border: "rgba(255, 255, 255, 0.12)",
          "border-yellow": "rgba(255, 229, 0, 0.45)",
          gray: "#D1D5DB", // لون نص عالي التباين والوضوح على شاشات الهواتف
          muted: "#9CA3AF",
          light: "#F9FAFB",
        },
      },
      fontFamily: {
        sans: ["'Cairo'", "'Plus Jakarta Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        cairo: ["'Cairo'", "sans-serif"],
        english: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        jakarta: ["'Plus Jakarta Sans'", "sans-serif"],
        syne: ["'Syne'", "sans-serif"],
      },
      boxShadow: {
        "yellow-glow": "0 0 35px -5px rgba(255, 229, 0, 0.4)",
        "yellow-glow-lg": "0 0 60px -5px rgba(255, 229, 0, 0.65)",
        "card-glow": "0 25px 50px -12px rgba(0, 0, 0, 0.85)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(3deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.25", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.1)" },
        },
      },
      animation: {
        float: "float 4.5s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
