import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#1976D2',
          light: '#4791DB',
          dark: '#0D47A1',
        },
        secondary: {
          DEFAULT: '#2E7D32',
          light: '#4CAF50',
        },
        accent: '#FF4081',
        
        // Text colors
        text: {
          primary: '#1E293B',
          secondary: '#475569',
          tertiary: '#64748B',
        },
        
        // UI colors
        divider: '#E2E8F0',
        background: '#F1F5F9',
        surface: '#FFFFFF',
        panel: '#F8FAFC',
        
        // State colors
        error: '#D32F2F',
        warning: '#F59E0B',
        success: '#2E7D32',
        info: '#0288D1',
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      fontSize: {
        xs: '0.75rem',        // 12px
        sm: '0.875rem',       // 14px
        base: '1rem',         // 16px
        lg: '1.125rem',       // 18px
        xl: '1.25rem',        // 20px
        '2xl': '1.5rem',      // 24px
        '3xl': '1.875rem',    // 30px
        '4xl': '2.25rem',     // 36px
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        loose: '1.75',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        xs: '0.125rem',      // 2px
        sm: '0.25rem',       // 4px
        md: '0.5rem',        // 8px
        lg: '0.75rem',       // 12px
        xl: '1rem',          // 16px
        '2xl': '1.5rem',     // 24px
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        focus: '0 0 0 3px rgba(25, 118, 210, 0.5)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionTimingFunction: {
        'in-out-cubic': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '350': '350ms',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spin: 'spin 1s linear infinite',
      },
      spacing: {
        'xxs': '0.125rem',    // 2px
        'xs': '0.25rem',      // 4px
        'sm': '0.5rem',       // 8px
        'md': '1rem',         // 16px
        'lg': '1.5rem',       // 24px
        'xl': '2rem',         // 32px
        '2xl': '3rem',        // 48px
        '3xl': '4rem',        // 64px
      },
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
    },
  },
  plugins: [],
} satisfies Config;
