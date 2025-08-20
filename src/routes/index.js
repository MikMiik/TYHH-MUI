import config from '@/routes/config'
import { Home, OnlineLearning, VipDocuments, Documents, LiveSchedule, Login, Register } from '@/pages'
import Test from '@/pages/test'

const routes = [
  {
    path: config.routes.home,
    component: Home,
  },
  {
    path: config.routes.onlineLearning,
    component: OnlineLearning,
  },
  {
    path: config.routes.vipDocuments,
    component: VipDocuments,
  },
  {
    path: config.routes.documents,
    component: Documents,
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
