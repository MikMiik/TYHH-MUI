import { extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        scrollBehavior: 'smooth',
        boxSizing: 'border-box',
      },
      body: {
        fontFamily: '"Roboto", sans-serif',
        margin: 0,
        padding: 0,
        color: '#333',
        lineHeight: 1.6,
      },
      '*, *::before, *::after': {
        boxSizing: 'inherit',
      },
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#034c31',
        },
        secondary: {
          light: '#40a9ff',
          main: '#1890ff',
        },
      },
    },
  },
  customVars: {
    headerTopBarHeight: '48px',
    headerBottomBarHeight: '70px',
    btnWidth: '108px',
    btnHeight: '32px',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: () => ({
          padding: '2px 6px',
          textTransform: 'none',
        }),
      },
      variants: [
        {
          props: {
            variant: 'activateKey',
          },
          style: {
            backgroundColor: '#ec971f',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#e08e0b',
            },
          },
        },
        {
          props: {
            variant: 'register',
          },
          style: {
            backgroundColor: '#1890ff',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#40a9ff',
            },
          },
        },
        {
          props: {
            variant: 'login',
          },
          style: {
            backgroundColor: '#ff4d4f',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#ff7875',
            },
          },
        },
      ],
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
