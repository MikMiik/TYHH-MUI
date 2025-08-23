import { Routes, Route } from 'react-router-dom'

import routes from '@/routes'
import DefaultLayout from '@/Layouts/DefaultLayout/DefaultLayout'

function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) => {
        const Layout = route.layout || false

        const Component = route.component
        return (
          <Route key={route.path} element={<DefaultLayout />}>
            {Layout && <Route path={route.path} element={<Layout />} />}
            <Route path={route.path} element={<Component />} />
          </Route>
        )
      })}
    </Routes>
  )
}

export default AppRoutes
