/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        'averta': ['AvertaStd-Regular', 'sans-serif'],
        'averta-semibold': ['AvertaStd-Semibold', 'sans-serif']
      }
    },
  },
  plugins: [],
};
