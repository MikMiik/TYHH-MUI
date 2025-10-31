import { Routes, Route } from 'react-router-dom'
import { Fragment, Suspense } from 'react'
import LoadingState from './LoadingState'

import routes from '@/routes'
import DefaultLayout from '@/Layouts/DefaultLayout/DefaultLayout'
import MenuLayout from '@/Layouts/MenuLayout/MenuLayout'
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
        const RouteWrapper = route.protected ? ProtectedRoute : Fragment
        const Component = route.component

        // Case A: MenuLayout -> keep DefaultLayout as outer site chrome and mount MenuLayout inside it
        if (Layout === MenuLayout) {
          return (
            <Route key={route.path} element={<DefaultLayout />}>
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
            </Route>
          )
        }

        // Case B: route provides its own layout (e.g. PlaygroundLayout) -> use it as the parent so its Outlet renders
        if (Layout) {
          return (
            <Route key={route.path} element={<Layout />}>
              <Route
                path={route.path}
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
          )
        }

        // Case C: no layout -> default to wrapping with DefaultLayout (site chrome)
        return (
          <Route key={route.path} element={<DefaultLayout />}>
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
