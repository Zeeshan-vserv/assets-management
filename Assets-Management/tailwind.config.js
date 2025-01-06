/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pop-up-top': 'text-pop-up-top 2s linear infinite alternate both',
      },
      keyframes: {
        'text-pop-up-top': {
          '0%': {
            transform: 'translateY(0)',
            'transform-origin': '50% 50%',
            'text-shadow': 'none',
          },
          '100%': {
            transform: 'translateY(-50px)',
            'transform-origin': '50% 50%',
            'text-shadow': '0 1px 0 #ccc, 0 2px 0 #ccc, 0 3px 0 #ccc, 0 4px 0 #ccc, 0 5px 0 #ccc, 0 6px 0 #ccc, 0 7px 0 #ccc, 0 8px 0 #ccc, 0 9px 0 #ccc, 0 50px 30px rgba(0, 0, 0, .3)',
          },
        },
      }
    },
  },
  plugins: [],
}

