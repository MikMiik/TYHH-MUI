import * as yup from 'yup'

const registerSchema = yup.object().shape({
  name: yup.string().required('Tên không được để trống'),
  username: yup
    .string()
    .required('Tên tài khoản không được để trống')
    .min(3, 'Tên tài khoản phải có ít nhất 3 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/, 'Tên tài khoản chỉ có thể chứa chữ cái, số và dấu gạch dưới'),
  email: yup.string().required('Email không được để trống').email('Định dạng email không hợp lệ'),
  phone: yup
    .string()
    .matches(/^(?:\+84|0)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ')
    .required('Bắt buộc nhập số điện thoại'),
  password: yup
    .string()
    .required('Mật khẩu không được để trống')
    .test('password', 'Mật khẩu phải đáp ứng tất cả các yêu cầu', function (value) {
      const errors = []

      if (!value) return true

      if (value.length < 8) errors.push('ít nhất 8 ký tự')

      if (!/[0-9]/.test(value)) errors.push('một số')

      if (!/[a-z]/.test(value)) errors.push('một chữ cái thường')

      if (!/[A-Z]/.test(value)) {
        errors.push('một chữ cái hoa')
      }

      if (!/[^\w]/.test(value)) errors.push('một ký tự đặc biệt')

      if (errors.length > 0) {
        return this.createError({
          message: `Mật khẩu yêu cầu: ${errors.join(', ')}`,
        })
      }
      return true
    }),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu không khớp'),
})

export default registerSchema
