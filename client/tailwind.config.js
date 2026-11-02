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
        // Strata Dark AI Infrastructure System Tokens
        strata: {
          bg: '#0d0c11',
          surface: '#131219',
          ink: '#ffffff',
          nav: '#b9b8bb',
          muted: '#d3d3d7',
          wordmark: '#bdbdc1',
          teal: '#9ff0ec',
          kicker: '#bdf7ee',
          logo: '#bcbcbf',
          violet: '#6f5adc',
          violetDark: '#4d19b1',
          hairline: 'rgba(255, 255, 255, 0.16)',
          border: 'rgba(255, 255, 255, 0.12)'
        },
        ink: {
          DEFAULT: '#ffffff',
          navy: '#ffffff',
          hover: '#d3d3d7',
          light: '#b9b8bb'
        },
        signal: {
          DEFAULT: '#6f5adc',
          blue: '#6f5adc',
          hover: '#826ff0',
          active: '#5b44c8'
        },
        slate: {
          gray: '#d3d3d7',
          muted: '#b9b8bb'
        },
        mist: {
          DEFAULT: '#b9b8bb',
          gray: '#b9b8bb'
        },
        cloud: {
          DEFAULT: '#0d0c11',
          canvas: '#0d0c11'
        },
        paper: {
          DEFAULT: '#131219',
          card: '#131219'
        },
        pebble: {
          DEFAULT: 'rgba(255, 255, 255, 0.04)',
          hover: 'rgba(255, 255, 255, 0.08)'
        },
        hairline: {
          DEFAULT: 'rgba(255, 255, 255, 0.16)',
          border: 'rgba(255, 255, 255, 0.12)'
        },
        carbon: '#0a0a0a',
        coral: {
          magenta: '#6f5adc'
        },
        sky: {
          cyan: '#9ff0ec'
        },
        cobalt: {
          DEFAULT: '#9ff0ec',
          deep: '#6f5adc'
        },
        // Semantic bridge aliases
        aura: {
          dark: '#0d0c11',
          card: '#131219',
          border: 'rgba(255, 255, 255, 0.12)',
          primary: '#6f5adc',
          cyan: '#9ff0ec',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#6f5adc'
        }
      },
      borderRadius: {
        'card': '24px',
        'product': '18px',
        'btn': '9999px',
        'input': '12px',
        'badge': '9999px'
      },
      boxShadow: {
        'strata-glow': '0 0 25px rgba(111, 90, 220, 0.45)',
        'strata-teal': '0 0 20px rgba(159, 240, 236, 0.35)',
        'strata-card': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08), 0 12px 32px -4px rgba(0, 0, 0, 0.6)',
        'cal-sm': '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'cal-card': '0 12px 32px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'cal-btn': '0 0 25px rgba(111, 90, 220, 0.45)',
        'cal-product': '0 12px 32px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace']
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
