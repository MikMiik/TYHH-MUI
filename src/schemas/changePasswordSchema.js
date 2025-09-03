import * as yup from 'yup'

const changePasswordSchema = yup.object({
  oldPassword: yup.string().required('Vui lòng nhập mật khẩu cũ.'),
  newPassword: yup.string().required('Vui lòng nhập mật khẩu mới.'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp.'),
})

export default changePasswordSchema
