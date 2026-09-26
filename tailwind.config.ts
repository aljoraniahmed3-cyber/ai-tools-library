import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
        },
        dark: {
          50: '#f8f8f8',
          100: '#f3f3f3',
          200: '#e8e8e8',
          300: '#d1d1d1',
          400: '#a1a1a1',
          500: '#707070',
          600: '#404040',
          700: '#2a2a2a',
          800: '#1a1a1a',
          900: '#0f0f0f',
        },
      },
      direction: {
        rtl: 'rtl',
      },
    },
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"]'],
}
export default config
