module.exports = {
  content: [
    './_drafts/**/*.html',
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_posts/*.md',
    './*.md',
    './*.html',
  ],
  theme: {
    extend: {
      colors: {
        'ro-blue': {
          50: "#DADDFB",
          100: "#B5BCF7",
          200: "#6775EF",
          300: "#1E32E7",
          400: "#111F9C",
          500: "#091153",
          600: "#070D40",
          700: "#050A33",
          800: "#030620",
          900: "#020412",
          950: "#010209"
        },

        'ro-nav': '#091153',

        "ro-pink": "#DA1881"
      }

    },
  },
  plugins: []
}