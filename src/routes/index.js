import config from '@/routes/config'
import {
  Home,
  Courses,
  VipDocuments,
  Documents,
  DocumentDetail,
  LiveSchedule,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  CourseDetail,
  Livestream,
  MyCourses,
  CreatedCourses,
  Notifications,
  Ranking,
  NotFound,
  Playground,
} from '@/pages'
import MenuLayout from '@/Layouts/MenuLayout/MenuLayout'
import PlaygroundLayout from '@/Layouts/PlaygroundLayout/PlaygroundLayout'

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
    path: config.routes.documentDetail,
    component: DocumentDetail,
  },
  {
    path: config.routes.liveSchedule,
    component: LiveSchedule,
  },
  {
    path: config.routes.ranking,
    component: Ranking,
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
    protected: true,
  },
  {
    path: config.routes.courseDetail,
    component: CourseDetail,
  },
  {
    path: config.routes.livestream,
    component: Livestream,
  },
  {
    path: config.routes.myCourses,
    component: MyCourses,
    protected: true,
  },
  {
    path: config.routes.createdCourses,
    component: CreatedCourses,
    protected: true,
  },
  {
    path: config.routes.notifications,
    component: Notifications,
    protected: true,
  },
  {
    path: config.routes.ranking,
    component: Ranking,
  },
  {
    path: config.routes.playground,
    component: Playground,
    layout: PlaygroundLayout,
    protected: true,
  },
  {
    path: config.routes.notFound,
    component: NotFound,
  },
]

export default routes
