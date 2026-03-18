/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        syne: ["'Syne'", "sans-serif"],
        dm: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        bg: {
          DEFAULT: "var(--bg)",
          2: "var(--bg2)",
          3: "var(--bg3)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface2)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          2: "var(--accent2)",
          3: "var(--accent3)",
        },
        text: {
          DEFAULT: "var(--text)",
          2: "var(--text2)",
          3: "var(--text3)",
        },
        border: {
          DEFAULT: "var(--border)",
          2: "var(--border2)",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease",
        "slide-in": "slideIn 0.3s ease",
        "grad-shift": "gradShift 4s ease infinite",
        "dot-pulse": "dotPulse 2s infinite",
        "pulse-slow": "pulse 1.5s infinite",
        float: "float 3s ease-in-out infinite",
        spin: "spin 0.8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: 0, transform: "translateX(-20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        gradShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        dotPulse: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.5)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(79,126,255,0.15)",
        "glow-light": "0 4px 32px rgba(58,107,255,0.12)",
        modal: "0 24px 80px rgba(0,0,0,0.25)",
        toast: "0 8px 40px rgba(0,0,0,0.2)",
      },
      backdropBlur: {
        nav: "20px",
      },
    },
  },
  plugins: [],
}
