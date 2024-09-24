/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #1cb5e0 0%, #5665ee 100%)',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
        '6': '6px',
      },
      text:{
        '5':'50px'
      }

    },
  },
  variants: {
    extend: {
      borderWidth: ['hover'],
    },
  },
  plugins: [],
}

