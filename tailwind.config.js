/** @type {import('tailwindcss').Config} */
export default {
 content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
 theme: {
  extend: {
   colors: {
    'gray-20': '#F7F9FB',
    'gray-50': '#eef2f6',
    'gray-100': '#aabfd4',
    'gray-500': '#31708E',
    'primary-100': '#8FC1E3',
    'primary-300': '#5ca5d6',
    'primary-500': '#338fcc',
    'secondary-400': '#479761',
    'secondary-500': '#418b59',
   },
   backgroundImage: (theme) => ({
    'gradient-yellowred': 'linear-gradient(90deg, #31708E 0%, #479761 100%)',
    'mobile-home': "url('./assets/HomePageGraphic.png')",
   }),
   fontFamily: {
    dmsans: ['DM Sans', 'sans-serif'],
    montserrat: ['Montserrat', 'sans-serif'],
   },
   content: {
    evolvetext: "url('./assets/EvolveText.png')",
    abstractwaves: "url('./assets/AbstractWaves.png')",
    sparkles: "url('./assets/sparkles.png')",
    circles: "url('./assets/circles.png')",
   },
  },
  screens: {
   xs: '480px',
   sm: '768px',
   md: '1060px',
  },
 },
 plugins: [],
};
