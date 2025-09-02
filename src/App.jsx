import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from '@/theme/theme'

import AppRoutes from './components/AppRoutes'
import ScrollToTop from './components/ScrollToTop'

import UserProvider from './components/UserProvider'
import store, { persistor } from './store'
import BackTop from './components/BackTop'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
        <ErrorBoundary>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                  <AppRoutes />
                  <UserProvider />
                  <ScrollToTop />
                  <BackTop />
                </Router>
              </ThemeProvider>
            </PersistGate>
          </Provider>
        </ErrorBoundary>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
