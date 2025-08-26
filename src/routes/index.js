import config from '@/routes/config'
import { Home, Courses, VipDocuments, Documents, LiveSchedule, Login, Register, Test } from '@/pages'
import MenuLayout from '@/Layouts/MenuLayout.jsx/MenuLayout'

const routes = [
  {
    path: config.routes.home,
    component: Home,
  },
  {
    path: config.routes.courses,
    component: Courses,
    layout: MenuLayout,
  },
  {
    path: config.routes.vipDocuments,
    component: VipDocuments,
    layout: MenuLayout,
  },
  {
    path: config.routes.documents,
    component: Documents,
    layout: MenuLayout,
  },
  {
    path: config.routes.liveSchedule,
    component: LiveSchedule,
  },
  {
    path: config.routes.login,
    component: Login,
  },
  {
    path: config.routes.register,
    component: Register,
  },
  {
    path: config.routes.notFound,
  },
  {
    path: config.routes.test,
    component: Test,
  },
]

export default routes
