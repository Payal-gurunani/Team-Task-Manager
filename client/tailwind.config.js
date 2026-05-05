/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dde6ff',
          200: '#c2d0ff',
          300: '#9db0ff',
          400: '#7485ff',
          500: '#4f58ff',
          600: '#3a37f5',
          700: '#2f29de',
          800: '#2724b4',
          900: '#25258e',
          950: '#161554',
        },
        surface: {
          0: '#ffffff',
          50: '#f8f8fc',
          100: '#f0f0f8',
          200: '#e4e4f0',
          300: '#d0d0e4',
          800: '#1e1e2e',
          900: '#15151f',
          950: '#0d0d15',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(79, 88, 255, 0.15)',
        'glow-lg': '0 0 40px rgba(79, 88, 255, 0.2)',
      }
    },
  },
  plugins: [],
}
