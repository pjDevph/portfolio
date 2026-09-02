import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090D14",
        panel: "#0F1623",
        panel2: "#141C2A",
        line: "#243044",
        text: "#F8FAFC",
        muted: "#94A3B8",
        dim: "#64748B",
        cyan: "#38BDF8",
        violet: "#818CF8",
        success: "#34D399"
      },
      boxShadow: {
        soft: "0 12px 40px rgba(0,0,0,.24)"
      }
    }
  },
  plugins: []
};
export default config;
