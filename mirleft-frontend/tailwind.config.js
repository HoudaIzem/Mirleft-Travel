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
          primary: '#006687',  
          secondary: '#005F41', 
          bg: '#FFFDF9',        // البيج الفاتح جداً ديال الـ Cards
          body: '#FAF6F0',      // الخلفية الدافئة ديال السيت كامل
        }
      },
    },
  },
  plugins: [],
}