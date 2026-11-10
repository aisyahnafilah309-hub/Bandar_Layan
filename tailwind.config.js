/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#002548',
        'primary-container': '#123B66',
        'on-primary': '#FFFFFF',
        'on-primary-container': '#83A6D7',
        'secondary': '#0051D5',
        'secondary-container': '#316BF3',
        'on-secondary': '#FFFFFF',
        'tertiary': '#002A25',
        'tertiary-container': '#00423B',
        'tertiary-fixed': '#71F8E4',
        'tertiary-fixed-dim': '#4FDBC8',
        'background': '#F8F9FF',
        'surface': '#F8F9FF',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#EFF4FF',
        'surface-container': '#E5EEFF',
        'surface-container-high': '#DCE9FF',
        'surface-container-highest': '#D3E4FE',
        'on-surface': '#0B1C30',
        'on-surface-variant': '#43474F',
        'outline': '#737780',
        'outline-variant': '#C3C6D0',
        'error': '#BA1A1A',
        'error-container': '#FFDAD6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'gutter': '24px',
        'gutter-mobile': '16px',
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 37, 72, 0.05), 0 1px 2px -1px rgba(0, 37, 72, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 37, 72, 0.05), 0 2px 4px -2px rgba(0, 37, 72, 0.05)',
        'modal': '0 20px 25px -5px rgba(0, 37, 72, 0.1), 0 8px 10px -6px rgba(0, 37, 72, 0.1)',
      }
    },
  },
  plugins: [],
}
