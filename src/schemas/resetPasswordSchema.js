import * as yup from 'yup'

const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới.')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'
    ),
  confirmPassword: yup
    .string()
    .required('Vui lòng nhập xác nhận mật khẩu.')
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp.'),
})

export default resetPasswordSchema
