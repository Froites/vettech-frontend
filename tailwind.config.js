/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors (Blue medical theme)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',  // Main primary
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Success colors (Green health theme)
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // Main success
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Warning colors (Amber)
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Main warning
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Error colors (Red)
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // Main error
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Veterinary specific colors
        veterinary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Pet category colors
        pet: {
          dog: '#8b5cf6',      // Purple for dogs
          cat: '#f59e0b',      // Orange for cats
          bird: '#06b6d4',     // Cyan for birds
          rabbit: '#ec4899',   // Pink for rabbits
          other: '#6b7280',    // Gray for others
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'hard': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 15px 25px -5px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.3)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-error': '0 0 20px rgba(239, 68, 68, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-up': 'scaleUp 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    // Formulários estilizados
    require('@tailwindcss/forms')({
      strategy: 'class', // Use class strategy para mais controle
    }),
    
    // Plugin customizado para componentes VetTech
    function({ addComponents, theme }) {
      addComponents({
        // Botões customizados
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.sm'),
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          border: 'none',
          textDecoration: 'none',
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${theme('colors.primary.500')}40`,
          },
          '&:disabled': {
            opacity: '0.6',
            cursor: 'not-allowed',
          },
        },
        '.btn-sm': {
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.xs'),
        },
        '.btn-md': {
          padding: `${theme('spacing.2.5')} ${theme('spacing.4')}`,
          fontSize: theme('fontSize.sm'),
        },
        '.btn-lg': {
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          fontSize: theme('fontSize.base'),
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary.600'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.primary.700'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.glow'),
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        '.btn-success': {
          backgroundColor: theme('colors.success.600'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.success.700'),
            boxShadow: theme('boxShadow.glow-success'),
          },
        },
        '.btn-warning': {
          backgroundColor: theme('colors.warning.500'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.warning.600'),
            boxShadow: theme('boxShadow.glow-warning'),
          },
        },
        '.btn-error': {
          backgroundColor: theme('colors.error.600'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.error.700'),
            boxShadow: theme('boxShadow.glow-error'),
          },
        },
        '.btn-outline': {
          backgroundColor: 'transparent',
          color: theme('colors.gray.700'),
          border: `1px solid ${theme('colors.gray.300')}`,
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.gray.50'),
            borderColor: theme('colors.gray.400'),
          },
        },
        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: theme('colors.gray.700'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.gray.100'),
          },
        },
        
        // Cards customizados
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.soft'),
          border: `1px solid ${theme('colors.gray.200')}`,
          transition: 'all 0.2s ease-in-out',
        },
        '.card-hover': {
          '&:hover': {
            boxShadow: theme('boxShadow.medium'),
            transform: 'translateY(-2px)',
          },
        },
        '.card-interactive': {
          cursor: 'pointer',
          '&:hover': {
            boxShadow: theme('boxShadow.hard'),
            transform: 'translateY(-4px)',
          },
          '&:active': {
            transform: 'translateY(-1px)',
          },
        },
        
        // Inputs customizados
        '.input': {
          width: '100%',
          padding: `${theme('spacing.2.5')} ${theme('spacing.3')}`,
          border: `1px solid ${theme('colors.gray.300')}`,
          borderRadius: theme('borderRadius.md'),
          fontSize: theme('fontSize.sm'),
          backgroundColor: theme('colors.white'),
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 3px ${theme('colors.primary.500')}20`,
          },
          '&::placeholder': {
            color: theme('colors.gray.400'),
          },
        },
        '.input-error': {
          borderColor: theme('colors.error.500'),
          '&:focus': {
            borderColor: theme('colors.error.500'),
            boxShadow: `0 0 0 3px ${theme('colors.error.500')}20`,
          },
        },
        
        // Status badges
        '.status-badge': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
          borderRadius: theme('borderRadius.full'),
          fontSize: theme('fontSize.xs'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.status-scheduled': {
          backgroundColor: theme('colors.blue.100'),
          color: theme('colors.blue.800'),
        },
        '.status-confirmed': {
          backgroundColor: theme('colors.success.100'),
          color: theme('colors.success.800'),
        },
        '.status-completed': {
          backgroundColor: theme('colors.gray.100'),
          color: theme('colors.gray.800'),
        },
        '.status-cancelled': {
          backgroundColor: theme('colors.error.100'),
          color: theme('colors.error.800'),
        },
        
        // Pet species badges
        '.pet-badge-dog': {
          backgroundColor: '#8b5cf640',
          color: '#7c3aed',
        },
        '.pet-badge-cat': {
          backgroundColor: '#f59e0b40',
          color: '#d97706',
        },
        '.pet-badge-bird': {
          backgroundColor: '#06b6d440',
          color: '#0891b2',
        },
        '.pet-badge-rabbit': {
          backgroundColor: '#ec489940',
          color: '#db2777',
        },
        '.pet-badge-other': {
          backgroundColor: '#6b728040',
          color: '#4b5563',
        },
      })
    }
  ],
}