import { extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  // Enable CSS variables for theme switching
  cssVariables: true,
  colorSchemeSelector: 'class', // hoặc 'data'
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        scrollBehavior: 'smooth',
        boxSizing: 'border-box',
      },
      body: ({ theme }) => ({
        fontFamily: theme.typography.fontFamily,
        margin: 0,
        padding: 0,
        color: theme.palette.text.primary,
        lineHeight: 1.6,
      }),
      '*, *::before, *::after': {
        boxSizing: 'inherit',
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 992,
      lg: 1140,
      xl: 1536,
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          light: '#4caf50',
          main: '#034c31',
          dark: '#007a33',
        },
        secondary: {
          light: '#40a9ff',
          main: '#1890ff',
          dark: '#096dd9',
        },
        tertiary: {
          light: '#fa8a75',
          main: '#f56751',
          dark: '#c94c3a',
          contrastText: '#fff',
        },
        icon: {
          light: '#999',
          main: '#666',
          dark: '#333',
        },
        // Common colors found throughout the app
        common: {
          white: '#fff',
          black: '#000',
          transparent: 'transparent',
        },
        // Gray scale colors
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
          // Additional grays found in codebase
          light: '#f1f1f1',
          medium: '#e0e0e0',
          dark: '#c1c1c1',
          darker: '#a8a8a8',
          text: '#888',
          border: '#eee',
          divider: '#d9d9d9',
        },
        // Success colors (Green variants)
        success: {
          light: '#e8f5e9',
          main: '#4caf50',
          dark: '#007a33',
          pale: '#e8f5e8',
          bright: '#66ec83',
          notification: '#8bc58dff',
        },
        // Warning colors (Orange/Amber variants)
        warning: {
          light: '#fff3cd',
          main: '#ec971f',
          dark: '#e08e0b',
          orange: '#F37021',
          amber: '#ffb300',
        },
        // Error colors (Red variants)
        error: {
          light: '#ff7875',
          main: '#ff4d4f',
          dark: '#c94c3a',
        },
        // Info colors (Blue variants)
        info: {
          light: '#e6f7ff',
          main: '#007bff',
          dark: '#0056b3',
          gradient: '#60a1d5',
          navy: '#49708d',
        },
        // Background colors
        background: {
          default: '#ffffff',
          paper: '#ffffff',
          light: '#f8f9fa',
          gradient: {
            green: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 50%, #e1f0e1 100%)',
          },
          dark: '#2a2a2a',
        },
        // Medal/Ranking colors
        medal: {
          gold: '#FFD700',
          goldGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          silver: '#C0C0C0',
          silverGradient: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
          bronze: '#CD7F32',
          bronzeGradient: 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
        },
        // Text colors
        text: {
          primary: '#333333',
          secondary: '#666666',
          disabled: '#999999',
          hint: '#c4c4c4',
          inverse: '#ffffff',
          muted: '#000000a6',
        },
        // Action colors for buttons and interactive elements
        action: {
          hover: 'rgba(0, 0, 0, 0.04)',
          selected: 'rgba(0, 0, 0, 0.08)',
          disabled: 'rgba(0, 0, 0, 0.26)',
          disabledBackground: 'rgba(0, 0, 0, 0.12)',
        },
        // Border colors
        border: {
          light: '#f3f4f6',
          main: '#e0e0e0',
          medium: '#d9d9d9',
          dark: '#c1c1c1',
        },
        // Shadow colors
        shadow: {
          main: '#eaebea',
          light: 'rgba(0, 0, 0, 0.1)',
          medium: 'rgba(0, 0, 0, 0.2)',
        },
        // Comment/notification specific colors
        comment: {
          highlight: '#e3f2fd',
          unread: '#8bc58dff',
        },
        // Video/media specific colors
        video: {
          overlay: '#000',
          background: 'rgba(0, 0, 0, 0.8)',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          light: '#4caf50',
          main: '#034c31',
          dark: '#007a33',
        },
        secondary: {
          light: '#40a9ff',
          main: '#1890ff',
          dark: '#096dd9',
        },
        tertiary: {
          light: '#fa8a75',
          main: '#f56751',
          dark: '#c94c3a',
          contrastText: '#fff',
        },
        icon: {
          light: '#999',
          main: '#666',
          dark: '#333',
        },
        // Common colors
        common: {
          white: '#fff',
          black: '#000',
          transparent: 'transparent',
        },
        // Gray scale colors for dark mode
        gray: {
          50: '#1f2937',
          100: '#374151',
          200: '#4b5563',
          300: '#6b7280',
          400: '#9ca3af',
          500: '#d1d5db',
          600: '#e5e7eb',
          700: '#f3f4f6',
          800: '#f9fafb',
          900: '#ffffff',
          // Additional grays for dark mode
          light: '#4b5563',
          medium: '#374151',
          dark: '#1f2937',
          darker: '#111827',
          text: '#9ca3af',
          border: '#374151',
          divider: '#4b5563',
        },
        // Success colors for dark mode
        success: {
          light: '#065f46',
          main: '#10b981',
          dark: '#34d399',
          pale: '#064e3b',
          bright: '#6ee7b7',
          notification: '#059669',
        },
        // Warning colors for dark mode
        warning: {
          light: '#78350f',
          main: '#f59e0b',
          dark: '#fbbf24',
          orange: '#fb923c',
          amber: '#fcd34d',
        },
        // Error colors for dark mode
        error: {
          light: '#dc2626',
          main: '#ef4444',
          dark: '#f87171',
        },
        // Info colors for dark mode
        info: {
          light: '#1e3a8a',
          main: '#3b82f6',
          dark: '#60a5fa',
          gradient: '#1e40af',
          navy: '#1e3a8a',
        },
        // Background colors for dark mode
        background: {
          default: '#0f172a',
          paper: '#1e293b',
          light: '#334155',
          gradient: {
            green: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          },
          dark: '#000000',
        },
        // Medal colors remain same for dark mode
        medal: {
          gold: '#FFD700',
          goldGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          silver: '#C0C0C0',
          silverGradient: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
          bronze: '#CD7F32',
          bronzeGradient: 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
        },
        // Text colors for dark mode
        text: {
          primary: '#f1f5f9',
          secondary: '#e2e8f0',
          disabled: '#64748b',
          hint: '#475569',
          inverse: '#0f172a',
          muted: '#94a3b8',
        },
        // Action colors for dark mode
        action: {
          hover: 'rgba(255, 255, 255, 0.08)',
          selected: 'rgba(255, 255, 255, 0.12)',
          disabled: 'rgba(255, 255, 255, 0.3)',
          disabledBackground: 'rgba(255, 255, 255, 0.12)',
        },
        // Border colors for dark mode
        border: {
          light: '#334155',
          main: '#475569',
          medium: '#64748b',
          dark: '#94a3b8',
        },
        // Shadow colors for dark mode
        shadow: {
          main: 'rgba(0, 0, 0, 0.4)',
          light: 'rgba(0, 0, 0, 0.2)',
          medium: 'rgba(0, 0, 0, 0.6)',
        },
        // Comment/notification colors for dark mode
        comment: {
          highlight: '#1e40af',
          unread: '#059669',
        },
        // Video/media colors for dark mode
        video: {
          overlay: '#000',
          background: 'rgba(0, 0, 0, 0.9)',
        },
      },
    },
  },
  muiVars: {
    headerTopBarHeight: '48px',
    headerBottomBarHeight: '70px',
    videoCardHeight: '360px',
    videoCardWidth: '249px',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: () => ({
          padding: '4px 8px',
          textTransform: 'none',
        }),
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          textDecoration: 'none',
          color: 'inherit',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            boxShadow: '0 0 0 1000px transparent inset',
            WebkitTextFillColor: 'inherit',
            caretColor: 'inherit',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          mt: 1,
          fontSize: '0.8rem',
        },
      },
    },
  },
})

export default theme
