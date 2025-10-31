const config = {
  routes: {
    home: '/',
    courses: '/courses',
    myCourses: '/my-courses',
    createdCourses: '/created-courses',
    vipDocuments: '/vipdocuments',
    documents: '/documents',
    documentDetail: '/documents/:slug',
    liveSchedule: '/liveschedule',
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    ranking: '/ranking',
    profile: '/profile',
    courseDetail: '/courses/:slug',
    livestream: '/courses/:courseSlug/:slug',
    notifications: '/notifications',
    playground: '/playground',
    notFound: '*',
  },
}

export default config
