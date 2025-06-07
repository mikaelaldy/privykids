/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
      },
      animation: {
        'bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
  safelist: [
    'border-blue-500',
    'bg-blue-50',
    'text-blue-600',
    'border-green-500',
    'bg-green-50',
    'text-green-600',
    'border-yellow-500',
    'bg-yellow-50',
    'text-yellow-600',
    'border-purple-500',
    'bg-purple-50',
    'text-purple-600',
    'border-red-500',
    'bg-red-50',
    'text-red-600',
  ],
};