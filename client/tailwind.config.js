/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2CAFE3",    // Blue - Buttons, highlights, icons, links
        secondary: "#33C048",  // Green - Submit buttons
        "text-primary": "#666666",   // Dark Gray - Text, icons
        divider: "#E5E5E5",    // Light Gray - Borders, section dividers, panel backgrounds
        background: "#F5F9FB", // Pale Blue - Main page background
        surface: "#FFFFFF",    // White - Main form panel backgrounds and inputs
        link: "#0071BC",       // Link Blue - Used in hyperlinks
        "text-secondary": "#6C757D", // Slate Gray - Hints, captions, disabled form labels
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