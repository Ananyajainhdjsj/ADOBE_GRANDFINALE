/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,html}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'adobe-red': '#FF0000',
        'adobe-seaBuckthorn': '#FBB034',
        'adobe-schoolBusYellow': '#FFDD00',
        'adobe-keyLimePie': '#C1D82F',
        'adobe-cerulean': '#00A4E4',
        'adobe-cement': '#8A7967',
        'adobe-nevada': '#6A737B',
        adobe: {
          red: '#FF0000',
          seaBuckthorn: '#FBB034',
          schoolBusYellow: '#FFDD00',
          keyLimePie: '#C1D82F',
          cerulean: '#00A4E4',
          cement: '#8A7967',
          nevada: '#6A737B',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        'myriad': ['"Myriad Pro"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'ripple': 'ripple 0.6s ease-out',
        'subtle-move': 'subtleMove 20s linear infinite',
        'sun-rays': 'sunRays 4s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        ripple: {
          'to': { transform: 'scale(4)', opacity: '0' }
        },
        subtleMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(20px, 20px)' }
        },
        sunRays: {
          '0%, 100%': { transform: 'rotate(0deg) scale(0.8)', opacity: '0.6' },
          '50%': { transform: 'rotate(90deg) scale(1)', opacity: '0.8' }
        },
        twinkle: {
          '0%, 100%': { opacity: '0.7', transform: 'translateY(-50%) scale(1)' },
          '50%': { opacity: '1', transform: 'translateY(-50%) scale(1.2)' }
        }
      },
      boxShadow: {
        'adobe': '0 20px 60px rgba(0, 0, 0, 0.08)',
        'adobe-hover': '0 30px 80px rgba(0, 0, 0, 0.12)',
        'adobe-button': '0 8px 25px rgba(251, 176, 52, 0.3)',
        'adobe-button-hover': '0 12px 35px rgba(0, 164, 228, 0.4)',
      },
      backdropBlur: {
        'adobe': '20px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
