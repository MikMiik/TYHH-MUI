import * as yup from 'yup'
import changePasswordSchema from './changePasswordSchema'

const profileBase = yup.object().shape({
  username: yup.string().required('Tài khoản không được để trống').min(3, 'Tài khoản phải có ít nhất 3 ký tự'),
  email: yup.string().required('Thư điện tử không được để trống').email('Định dạng email không hợp lệ'),
  name: yup.string().required('Họ và tên không được để trống'),
  phone: yup
    .string()
    .matches(/^(?:\+84|0)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ')
    .required('Bắt buộc nhập số điện thoại'),
  facebook: yup.string().url('Link Facebook không hợp lệ').nullable(),
  yearOfBirth: yup
    .string()
    .matches(/^[0-9]{4}$/, 'Năm sinh phải có 4 chữ số')
    .nullable(),
  city: yup.string().nullable(),
  school: yup.string().nullable(),
})

/**
 * profileSchema(changePassword = false)
 * - If changePassword is true, returns a schema that requires password fields as well
 * - Otherwise returns only the profile base schema
 */
const profileSchema = (changePassword = false) => {
  if (changePassword) {
    return profileBase.concat(changePasswordSchema)
  }
  return profileBase
}

export default profileSchema
