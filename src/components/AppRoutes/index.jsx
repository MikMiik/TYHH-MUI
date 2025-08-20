import { Routes, Route } from 'react-router-dom'

import routes from '@/routes'
import DefaultLayout from '@/Layouts/DefaultLayout'

function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) => {
        const Layout = route.layout || DefaultLayout
        const Component = route.component
        return (
          <Route key={route.path} element={<Layout />}>
            <Route path={route.path} element={<Component />} />
          </Route>
        )
      })}
    </Routes>
  )
}

export default AppRoutes
