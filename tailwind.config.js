/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FBF8FD',
          100: '#F5EEFA',
          200: '#EBDBF5',
          300: '#DABFEA',
          400: '#BE94D9',
          500: '#9E64C0',
          600: '#8447A5',
          700: '#6B3488',
          800: '#52246A',
          900: '#3D1751',
          950: '#260B33',
        },
        cream: {
          50: '#FCFBF9',
          100: '#FAF7F2',
          200: '#F5EFE6',
          300: '#ECE2D3',
        },
        mauve: {
          deep: '#4E205D',
          charcoal: '#2D2531',
          muted: '#716579',
          light: '#A396AB',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #A871CA 0%, #6E328B 100%)',
        'soft-gradient': 'linear-gradient(135deg, #F9F3FD 0%, #FAF7F2 100%)',
        'subtle-lilac': 'linear-gradient(180deg, #F5EDFA 0%, #FCFBF9 100%)',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(94, 43, 122, 0.05)',
        'soft': '0 10px 30px -4px rgba(94, 43, 122, 0.08)',
        'elevated': '0 20px 40px -6px rgba(94, 43, 122, 0.12)',
      }
    },
  },
  plugins: [],
}

