import { extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        scrollBehavior: 'smooth',
        boxSizing: 'border-box',
      },
      body: {
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
        background: {
          default: '#fff',
          paper: '#f5f5f5',
        },
      },
    },
  },
  customVars: {
    headerHeight: '118px',
    headerTopBarHeight: '48px',
    btnWidth: '108px',
    btnHeight: '32px',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: '2px 4px',
          textTransform: 'none',
          height: theme.customVars.btnHeight,
          width: theme.customVars.btnWidth,
          textShadow: '0 -1px 0 rgba(0,0,0,.12)',
          boxShadow: '0 2px 0 rgba(0, 0, 0, .035)',
        }),
      },
      variants: [
        {
          props: {
            type: 'active',
          },
          style: {
            backgroundColor: '#ec971f',
            width: 120,
            '&:hover': {
              backgroundColor: '##e08e0b',
            },
          },
        },
        {
          props: {
            type: 'register',
          },
          style: {
            backgroundColor: '#1890ff',
            '&:hover': {
              backgroundColor: '#40a9ff',
            },
          },
        },
        {
          props: {
            type: 'login',
          },
          style: {
            backgroundColor: '#ff4d4f',

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
          transition: '0.1s',
          '&:hover': {
            color: '#f56751',
            transition: '0.1s',
          },
        },
      },
    },
  },
})

export default theme
