/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          dark: '#0A192F',    // Deep Navy Header/Sidebar
          navy: '#002B49',    // IRCTC / Railway Blue accent
          blue: '#00529B',    // Primary Railway Blue
          lightBlue: '#E6F0FA',
          accent: '#D97706',  // Amber Warning
          red: '#DC2626',     // Critical Red
          green: '#059669',   // Approved / Safe Green
          surface: '#F8FAFC', // Crisp background
          card: '#FFFFFF',
          border: '#E2E8F0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
