import { Form, TextInput } from '@/components/Forms'
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import loginSchema from '@/schemas/loginSchema'
import Button from '@/components/Button/index.jsx'
import config from '@/config'
import { getCurrentUser } from '@/features/auth/authAsync'
import authService from '@/services/authService'
import TitleLogin from './components/TitleLogin/TitleLogin.jsx'
import styles from './Login.module.scss'

function Login() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.currentUser)

  if (currentUser) {
    return <Navigate to={params.get('continue') || config.routes.home} />
  }

  const onSubmit = async (data) => {
    try {
      const res = await authService.login(data)
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('refresh_token', res.data.refresh_token)
      dispatch(getCurrentUser())
      navigate(params.get('continue') || config.routes.home)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles.loginBody}>
      <div className={styles.container}>
        <Form
          schema={loginSchema}
          defaultValues={{
            email: '',
            password: '',
          }}
          onSubmit={onSubmit}
        >
          <TitleLogin />
          <TextInput className="loginEmail" name="email" placeholder="Email"></TextInput>
          <TextInput className="loginPassword" name="password" placeholder="Mật khẩu"></TextInput>
          <Button>Đăng nhập</Button>
        </Form>
        <Link to="/register">Đăng kí</Link>
      </div>
    </div>
  )
}

export default Login
