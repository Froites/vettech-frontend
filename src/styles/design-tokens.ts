// src/styles/design-tokens.ts - DESIGN SYSTEM VETTECH
export const colors = {
  // 🟢 Primary - Nature Care (Verde)
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac', 
    400: '#4ade80',
    500: '#22c55e',  // Principal
    600: '#16a34a',  // Hover
    700: '#15803d',  // Active/Focus
    800: '#166534',
    900: '#14532d',
  },

  // 🔵 Secondary - Medical Blue (Azul)
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Principal
    600: '#2563eb',  // Hover
    700: '#1d4ed8',  // Active
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // ✅ Success - Verde Esmeralda
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },

  // ⚠️ Warning - Âmbar
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  // ❌ Error - Vermelho
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  // ℹ️ Info - Ciano
  info: {
    50: '#ecfeff',
    100: '#cffafe',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
  },

  // 🔘 Gray - Neutros
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // 📝 Semantic Colors
  background: '#ffffff',
  surface: '#f9fafb',
  border: '#e5e7eb',
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    disabled: '#9ca3af',
  }
};

// 📏 Spacing Scale
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
};

// 📝 Typography Scale
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  fontSize: {
    xs: ['12px', '16px'],
    sm: ['14px', '20px'],
    base: ['16px', '24px'],
    lg: ['18px', '28px'],
    xl: ['20px', '28px'],
    '2xl': ['24px', '32px'],
    '3xl': ['30px', '36px'],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
};

// 🌟 Border Radius
export const borderRadius = {
  none: '0px',
  sm: '2px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
};

// 🌈 Box Shadow
export const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

// 🎭 Animation Durations
export const animation = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
};

// 🎨 Theme Object (para fácil acesso)
export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  boxShadow,
  animation,
};

export default theme;