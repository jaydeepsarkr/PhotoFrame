/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F3ECE0',
          300: '#E8DEC8',
        },
        charcoal: {
          800: '#262523',
          900: '#191817',
          950: '#11100F',
        },
        gold: {
          50: '#FBF8F1',
          100: '#F5EFE0',
          200: '#EADBC0',
          300: '#DEC296',
          400: '#D0A66B',
          500: '#C5934C',
          600: '#B07B38',
          700: '#8F602D',
          800: '#754E29',
          900: '#604124',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px -4px rgba(25, 24, 23, 0.06), 0 2px 8px -2px rgba(25, 24, 23, 0.04)',
        'elevated': '0 16px 40px -8px rgba(25, 24, 23, 0.12), 0 4px 12px -2px rgba(25, 24, 23, 0.06)',
        'frame': '0 25px 50px -12px rgba(0, 0, 0, 0.35), inset 0 2px 6px rgba(255, 255, 255, 0.25)',
      }
    },
  },
  plugins: [],
}
