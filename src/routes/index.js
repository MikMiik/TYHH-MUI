import config from '@/config'
import { Home, OnlineLearning, VipDocuments, Documents, LiveSchedule, Login, Register } from '@/pages'
import DefaultLayout from '@/Layouts/DefaultLayout'
import Test from '@/pages/test'
import MuiLayout from '@/Layouts/MuiLayout'

const routes = [
  {
    path: config.routes.home,
    component: Home,
    layout: MuiLayout,
  },
  {
    path: config.routes.onlineLearning,
    component: OnlineLearning,
    layout: MuiLayout,
  },
  {
    path: config.routes.vipDocuments,
    component: VipDocuments,
    layout: MuiLayout,
  },
  {
    path: config.routes.documents,
    component: Documents,
    layout: MuiLayout,
  },
  {
    path: config.routes.liveSchedule,
    component: LiveSchedule,
    layout: MuiLayout,
  },
  {
    path: config.routes.login,
    component: Login,
    layout: MuiLayout,
  },
  {
    path: config.routes.register,
    component: Register,
    layout: MuiLayout,
  },
  {
    path: config.routes.notFound,
  },
  {
    path: config.routes.test,
    component: Test,
    layout: MuiLayout,
  },
]

export default routes
