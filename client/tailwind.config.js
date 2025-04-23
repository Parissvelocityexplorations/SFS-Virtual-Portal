/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#007BFF",    // Deep Sky Blue
        secondary: "#20C997",  // Teal
        accent: "#FF6B6B",     // Coral Orange
        background: "#F8F9FA", // Soft Light Gray
        surface: "#FFFFFF",    // White
        "text-primary": "#343A40",   // Charcoal
        "text-secondary": "#6C757D", // Slate Gray
        divider: "#E9ECEF",    // Light Gray
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