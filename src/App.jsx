import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from '@/theme'

import AppRoutes from './components/AppRoutes'
import ScrollToTop from './components/ScrollToTop'

import UserProvider from './components/UserProvider'
import store, { persistor } from './store'

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <AppRoutes />
              <UserProvider />
              <ScrollToTop />
            </Router>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </>
  )
}

export default App
