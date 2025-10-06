import { lazy } from 'react'

// Lazy load all pages for better performance
export const Home = lazy(() => import('./Home'))
export const Courses = lazy(() => import('./Courses'))
export const MyCourses = lazy(() => import('./MyCourses'))
export const VipDocuments = lazy(() => import('./VipDocuments'))
export const Documents = lazy(() => import('./Documents'))
export const DocumentDetail = lazy(() => import('./DocumentDetail'))
export const LiveSchedule = lazy(() => import('./LiveSchedule'))
export const Login = lazy(() => import('./Login'))
export const Register = lazy(() => import('./Register'))
export const ForgotPassword = lazy(() => import('./ForgotPassword'))
export const ResetPassword = lazy(() => import('./ResetPassword'))
export const Profile = lazy(() => import('./Profile'))
export const CourseDetail = lazy(() => import('./CourseDetail'))
export const Livestream = lazy(() => import('./Livestream'))
export const NotFound = lazy(() => import('./NotFound'))
