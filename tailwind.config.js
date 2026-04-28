/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        headline: ['Work Sans', 'sans-serif'],
      },
      colors: {
        surface: '#fcf9f8',
        'surface-dim': '#dcd9d9',
        'surface-bright': '#fcf9f8',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f6f3f2',
        'surface-container': '#f0eded',
        'surface-container-high': '#eae7e7',
        'surface-container-highest': '#e5e2e1',
        'on-surface': '#1b1c1c',
        'on-surface-variant': '#414754',
        outline: '#727785',
        'outline-variant': '#c1c6d6',
        primary: '#005bbf',
        'primary-container': '#1a73e8',
        'on-primary-container': '#ffffff',
        secondary: '#ac2c57',
        'secondary-container': '#fe6c96',
        error: '#ba1a1a',
      },
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
}