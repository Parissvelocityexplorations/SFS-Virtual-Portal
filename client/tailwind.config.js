/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1976D2",
          light: "#4791DB",
          dark: "#0D47A1",
        },
        secondary: {
          DEFAULT: "#2E7D32",
          light: "#4CAF50",
          dark: "#1B5E20",
        },
        "text-primary": "#1E293B",
        "text-secondary": "#475569",
        "text-tertiary": "#64748B",
        divider: "#E2E8F0",
        background: "#F1F5F9",
        surface: "#FFFFFF",
        panel: "#F8FAFC",
        error: "#D32F2F",
        warning: "#F59E0B",
        success: "#2E7D32",
        info: "#0288D1",
        accent: "#FF4081",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};