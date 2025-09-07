import config from '@/routes/config'
import {
  Home,
  Courses,
  VipDocuments,
  Documents,
  LiveSchedule,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Test,
  Profile,
  CourseDetail,
} from '@/pages'
import MenuLayout from '@/Layouts/MenuLayout.jsx/MenuLayout'

const routes = [
  {
    path: config.routes.home,
    component: Home,
  },
  {
    path: config.routes.topics,
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
    path: config.routes.forgotPassword,
    component: ForgotPassword,
  },
  {
    path: config.routes.resetPassword,
    component: ResetPassword,
  },
  {
    path: config.routes.profile,
    component: Profile,
  },
  {
    path: config.routes.courseDetail,
    component: CourseDetail,
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
