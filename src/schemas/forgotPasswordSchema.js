import * as yup from 'yup'

const forgotPasswordSchema = yup.object({
  email: yup.string().required('Vui lòng nhập email.').email('Email không hợp lệ.'),
})

export default forgotPasswordSchema
