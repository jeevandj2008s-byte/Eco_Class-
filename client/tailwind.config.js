/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Calendly Design System Tokens
        ink: {
          DEFAULT: '#0b3558',
          navy: '#0b3558',
          hover: '#08253e',
          light: '#134975'
        },
        signal: {
          DEFAULT: '#006bff',
          blue: '#006bff',
          hover: '#005be0',
          active: '#004ec2'
        },
        slate: {
          gray: '#476788',
          muted: '#5e7d9c'
        },
        mist: {
          DEFAULT: '#a6bbd1',
          gray: '#a6bbd1'
        },
        cloud: {
          DEFAULT: '#f8f9fb',
          canvas: '#f8f9fb'
        },
        paper: {
          DEFAULT: '#ffffff',
          card: '#ffffff'
        },
        pebble: {
          DEFAULT: '#f0f3f8',
          hover: '#e5ebf3'
        },
        hairline: {
          DEFAULT: '#d4e0ed',
          border: '#d4e0ed'
        },
        carbon: '#0a0a0a',
        coral: {
          magenta: '#e55cff'
        },
        sky: {
          cyan: '#0099ff'
        },
        cobalt: {
          DEFAULT: '#004eba',
          deep: '#004eba'
        },
        // Semantic bridge aliases
        aura: {
          dark: '#0b3558',
          card: '#ffffff',
          border: '#d4e0ed',
          primary: '#006bff',
          cyan: '#0099ff',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#e55cff'
        }
      },
      borderRadius: {
        'card': '24px',
        'product': '16px',
        'btn': '8px',
        'input': '8px',
        'badge': '9999px'
      },
      boxShadow: {
        'cal-sm': 'rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 4px 10px 0px, rgba(71, 103, 136, 0.05) 0px 10px 20px 0px',
        'cal-card': 'rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.08) 0px 30px 50px 0px',
        'cal-btn': 'rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.06) 0px 15px 30px 0px',
        'cal-product': 'rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.08) 0px 30px 50px 0px'
      },
      fontFamily: {
        sans: ['Manrope', 'Gilroy', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slideLeft': 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
