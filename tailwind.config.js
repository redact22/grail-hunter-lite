/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        acid: '#2BF3C0',
        magenta: '#FF3BD4',
        obsidian: {
          950: '#0A0A0F',
          900: '#07070A',
        },
      },
      fontFamily: {
        syncopate: ['system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
