const colors = require('tailwindcss/colors')

module.exports = {
    content: [
        './node_modules/@omit/react-confirm-dialog/dist/index.js'
      ],
    theme: {
      extend: {
        colors: {
          bluetec: '#007BFF',
          greentec: '#00D084',
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))'
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))'
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))'
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))'
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))'
          }
        },
        keyframes: {
          shine: {
            '0%': { backgroundPosition: '200% 0' },
            '25%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '-200% 0' },
          },
          gradientFlow: {
              '0%': { 'background-position':'0% 50%' },
              '50%': { 'background-position': '100% 50%' },
              '100%': { 'background-position': '0% 50%' },
          },
        },
        animation: {
          shine: 'shine 3s ease-out infinite',
          'gradient-flow': 'gradientFlow 10s ease 0s infinite normal none running',
        },
      }
    },
    plugins: [require('tailwindcss-animate')]
  }