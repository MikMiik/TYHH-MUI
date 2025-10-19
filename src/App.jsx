import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import theme from '@/theme/theme'

import AppRoutes from './components/AppRoutes'
import ScrollToTop from './components/ScrollToTop'
import ComponentPreloader from './components/ComponentPreloader'

import UserProvider from './components/UserProvider'
import store, { persistor } from './store'
import BackTop from './components/BackTop'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID || ''

function App() {
  return (
    <>
      <InitColorSchemeScript
        attribute="data-mui-color-scheme"
        defaultColorScheme="light"
        storageKey="mui-color-scheme"
      />
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </Router>
              </ThemeProvider>
            </PersistGate>
          </Provider>
        </ErrorBoundary>
        <ComponentPreloader />
      </GoogleOAuthProvider>
    </>
  )
}

export default App
