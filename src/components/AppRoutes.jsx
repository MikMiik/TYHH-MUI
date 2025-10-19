import { Routes, Route } from 'react-router-dom'
import { Fragment, Suspense } from 'react'
import LoadingState from './LoadingState'

import routes from '@/routes'
import DefaultLayout from '@/Layouts/DefaultLayout/DefaultLayout'
import { NotFound } from '@/pages'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  // Separate the NotFound route from other routes
  const regularRoutes = routes.filter((route) => route.path !== '*')
  const notFoundRoute = routes.find((route) => route.path === '*')

  // Suspense fallback component
  const PageLoadingFallback = () => (
    <LoadingState
      isLoading={true}
      variant="page"
      loadingText="Đang tải trang..."
      containerProps={{ sx: { minHeight: '50vh' } }}
    />
  )

  return (
    <Routes>
      {regularRoutes.map((route) => {
        const Layout = route.layout || false
        const RouteWrapper = route.protected ? ProtectedRoute : Fragment;
        const Component = route.component
        return (
          <Route key={route.path} element={<DefaultLayout />}>
            {Layout ? (
              <Route path={route.path} element={<Layout />}>
                <Route
                  index
                  element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <RouteWrapper>
                        <Component />
                      </RouteWrapper>
                    </Suspense>
                  }
                />
              </Route>
            ) : (
              <Route
                path={route.path}
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <RouteWrapper>
                      <Component />
                    </RouteWrapper>
                  </Suspense>
                }
              />
            )}
          </Route>
        )
      })}

      {/* Catch-all route for 404 - must be last */}
      {notFoundRoute && (
        <Route path="*" element={<DefaultLayout />}>
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      )}
    </Routes>
  )
}

export default AppRoutes
