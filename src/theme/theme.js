import { extendTheme } from '@mui/material/styles'

const theme = extendTheme({
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
  },
})

export default theme
