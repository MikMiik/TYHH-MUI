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
        mode: 'light',
        primary: {
          light: '#4f9b79',
          main: '#1f6a4f',
          dark: '#0b3e2a',
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
          button: '#9e9e9e',
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
        gradient: {
          main: 'linear-gradient(140deg, #083b2b 0%, #1f6a4f 50%, #072a1f 100%)',
          intersection:
            'linear-gradient(to bottom, #1f6a4f 0%, #3a7d63 20%, #5a9d7f 40%, #7cb895 60%, #a8d4b8 80%, #d6eadd 100%)',
          secondary: 'linear-gradient(to bottom, #d6eadd 0%, #e8f5e8 5%, #f4faf4 33%, #ffffff 100%)',
        },
        // Background colors
        background: {
          default: '#ffffff',
          paper: '#fefefe39',
          light: '#f8f9fa',
          grey: '#f3f4f6',
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
        // Comment/notification specific colors
        comment: {
          highlight: '#e3f2fd',
          unread: '#8bc58dff',
        },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: {
          light: '#4f9b79',
          main: '#1f6a4f',
          dark: '#0b3e2a',
        },
        secondary: {
          light: '#5b9fd9',
          main: '#3a7fb5',
          dark: '#1f5a8a',
        },
        tertiary: {
          light: '#fa8a75',
          main: '#f56751',
          dark: '#c94c3a',
          contrastText: '#fff',
        },
        icon: {
          light: '#ccc',
          main: '#999',
          dark: '#666',
          button: '#9e9e9e',
        },
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
        gradient: {
          main: 'linear-gradient(140deg, #083b2b 0%, #1f6a4f 50%, #072a1f 100%)',
          intersection: 'linear-gradient(180deg, #0b3f2f 0%,#144e3b 15%,#1b2e29 40%,  #222222 70%,  #2d2d2d 100%)',
          secondary: 'linear-gradient(to bottom, #1a1a1a 0%, #2d2d2d 5%, #3a3a3a 33%, #4a4a4a 100%)',
        },
        // Background colors
        background: {
          default: '#1a1a1a',
          paper: '#242424',
          light: '#2d2d2d',
          grey: '#333333',
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
          primary: '#ffffff',
          secondary: '#cccccc',
          disabled: '#666666',
          hint: '#999999',
          inverse: '#333333',
          muted: '#ffffff66',
        },
        // Comment/notification specific colors
        comment: {
          highlight: '#1e293b',
          unread: '#8bc58dff',
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
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.vars.palette.background.default,
        }),
      },
    },
  },
})

export default theme
