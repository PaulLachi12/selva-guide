/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fondos: crema mate, sin blancos duros
        pap: '#F7F5F0',
        papalt: '#F1EDE5',
        card: '#F7F5F0',
        // Texto: grafito / carbón cálido
        ink: '#222222',
        black: '#171717',
        // Acentos: solo en estados activos o indicadores finos
        forest: '#3A4D3F',
        forest2: '#2F3F34',
        olive: '#2C3E35',
        cream: '#EAE6DF',
        terracotta: '#8A4A3B',
        terracotta2: '#77402F',
        ochre: '#8A4A3B',
        leather: '#5C4033',
        // Líneas y texto secundario
        sand: '#E3DFD5',
        sand2: '#D3CEC2',
        mut: '#66635B',
        // Alias heredados
        gyellow: '#8A4A3B',
        ggreen: '#3A4D3F',
        grayLine: '#E3DFD5',
        slateSoft: '#F1EDE5',
        white: '#FBFBFA',
        brand: {
          50: '#F5F1EA',
          100: '#EBE5D9',
          200: '#D9D0BF',
          300: '#B9AD96',
          400: '#93876F',
          500: '#6F6650',
          600: '#554F3D',
          700: '#3D3A2E',
          800: '#2B2921',
          900: '#1E1D17'
        },
        gray: {
          50: '#F7F5F1',
          100: '#EFEDE7',
          200: '#E2DFD6',
          300: '#CFCBBF',
          400: '#ACA79A',
          500: '#8C877B',
          600: '#6E6A61',
          700: '#524F48',
          800: '#3C3A34',
          900: '#2A2823'
        },
        red: {
          50: '#F7EEEC',
          100: '#EFDED8',
          200: '#E0BDB2',
          300: '#CB9688',
          400: '#B37261',
          500: '#9A5745',
          600: '#8A4A3B',
          700: '#703B30',
          800: '#593027',
          900: '#42231D'
        },
        green: {
          50: '#F0F3EE',
          100: '#DFE6DB',
          200: '#C1CEB9',
          300: '#9CB291',
          400: '#75906D',
          500: '#58724F',
          600: '#476043',
          700: '#3A4D3F',
          800: '#2C3B31',
          900: '#212B24'
        },
        yellow: {
          50: '#F7F1E5',
          100: '#EFE2C8',
          200: '#E0C99A',
          300: '#CBAB6B',
          400: '#B08B45',
          500: '#94722F',
          600: '#795C25',
          700: '#604A1E',
          800: '#493817',
          900: '#352810'
        },
        blue: {
          50: '#EEF1EE',
          100: '#DCE3DC',
          200: '#BBC9BE',
          300: '#94A99B',
          400: '#6E8878',
          500: '#55705E',
          600: '#465E4D',
          700: '#3A4D41',
          800: '#2C3B31',
          900: '#212B26'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', '"EB Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      letterSpacing: {
        rw: '0.14em',
        wide2: '0.18em',
        wide3: '0.24em'
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      borderRadius: {
        none: '0',
        sm: '0px',
        DEFAULT: '1px',
        md: '2px',
        lg: '3px',
        xl: '4px',
        '2xl': '4px',
        '3xl': '6px',
        full: '9999px'
      },
      boxShadow: {
        sm: '0 1px 2px rgba(34, 34, 34, 0.03)',
        DEFAULT: '0 1px 1px rgba(34, 34, 34, 0.03)',
        md: '0 1px 3px rgba(34, 34, 34, 0.05)',
        lg: '0 2px 8px rgba(34, 34, 34, 0.06)',
        xl: '0 4px 16px rgba(34, 34, 34, 0.08)',
        '2xl': '0 8px 24px rgba(34, 34, 34, 0.10)',
        inner: 'inset 0 1px 2px rgba(34, 34, 34, 0.03)'
      }
    }
  },
  plugins: []
};