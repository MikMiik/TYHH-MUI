import { useSelector } from 'react-redux'
import { useLocation, Navigate } from 'react-router-dom'

import config from '@/routes/config'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const currentUser = useSelector((state) => state.auth.currentUser)

  if (!currentUser) {
    const path = encodeURIComponent(location.pathname)
    return <Navigate to={`${config.routes.login}?continue=${path}`} />
  }
  return children
}

export default ProtectedRoute
