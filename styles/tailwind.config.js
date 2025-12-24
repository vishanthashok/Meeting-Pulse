/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pulse': {
          'green': '#00D46A',
          'yellow': '#FFB800',
          'red': '#FF3B30',
          'dark': '#0A0E1B',
          'gray': {
            50: '#F7F8FA',
            100: '#E8EBF0',
            200: '#C6CBD4',
            300: '#9BA3B0',
            400: '#6B7280',
            500: '#4B5563',
            600: '#374151',
            700: '#1F2937',
            800: '#111827',
            900: '#0A0E1B',
          }
        }
      },
      fontFamily: {
        'display': ['Clash Display', 'system-ui', 'sans-serif'],
        'body': ['Satoshi', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounceSoft 2s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(145, 100%, 56%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355, 100%, 60%, 0.2) 0px, transparent 50%)',
        'gradient-dark': 'radial-gradient(at 40% 20%, hsla(145, 100%, 56%, 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355, 100%, 60%, 0.05) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}
