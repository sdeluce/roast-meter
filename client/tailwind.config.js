/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f6bb77',
          400: '#f19440',
          500: '#ed751a',
          600: '#de5c10',
          700: '#b94610',
          800: '#943914',
          900: '#783114',
        }
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};