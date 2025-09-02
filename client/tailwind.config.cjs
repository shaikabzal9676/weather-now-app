module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5a4', // teal
        accent: '#7c3aed'   // purple
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};

