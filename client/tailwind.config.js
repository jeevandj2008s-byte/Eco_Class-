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
          violet: '#006bff',
          violetDark: '#0050c7',
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
          DEFAULT: '#006bff',
          blue: '#006bff',
          hover: '#1a7aff',
          active: '#0058d6'
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
          deep: '#006bff'
        },
        // Semantic bridge aliases
        aura: {
          dark: '#0d0c11',
          card: '#131219',
          border: 'rgba(255, 255, 255, 0.12)',
          primary: '#006bff',
          cyan: '#9ff0ec',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#006bff'
        }
      },
      borderRadius: {
        'card': '14px',
        'product': '12px',
        'btn': '8px',
        'input': '8px',
        'badge': '6px'
      },
      boxShadow: {
        'strata-glow': '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'strata-teal': '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'strata-card': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08), 0 12px 32px -4px rgba(0, 0, 0, 0.6)',
        'cal-sm': '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'cal-card': '0 12px 32px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'cal-btn': '0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'cal-product': '0 12px 32px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        classic: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
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
