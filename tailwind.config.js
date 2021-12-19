const withAnimations = require('animated-tailwindcss')

module.exports = withAnimations({
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
})
