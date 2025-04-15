/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#E1306C',
          hover: '#D01F5D',
        },
        secondary: {
          DEFAULT: '#00F2EA',
          hover: '#00D6CF',
        },
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
        },
        content: {
          DEFAULT: '#2F3542',
          light: '#4B5563',
          muted: '#6B7280',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F5F6FA',
          tertiary: '#E5E7EB',
        },
        gradient: {
          start: '#8B5CF6',
          end: '#E1306C',
        },
      },
      fontSize: {
        'display': ['48px', '1.2'],
        'h1': ['40px', '1.25'],
        'h2': ['32px', '1.3'],
        'h3': ['24px', '1.4'],
        'body': ['16px', '1.5'],
        'small': ['14px', '1.5'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8B5CF6 0%, #E1306C 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #00F2EA 0%, #3B82F6 100%)',
      },
    },
  },
  plugins: [],
}