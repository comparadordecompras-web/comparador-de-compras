/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1D4ED8',
        'brand-secondary': '#10B981',
        'brand-light': '#F3F4F6',
        'brand-dark': '#1F2937',
      },
    },
  },
  plugins: [],
}