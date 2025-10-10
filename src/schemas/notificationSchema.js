import * as Yup from 'yup'

const notificationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Tiêu đề là bắt buộc')
    .min(1, 'Tiêu đề phải có ít nhất 1 ký tự')
    .max(191, 'Tiêu đề không được vượt quá 191 ký tự'),

  message: Yup.string().max(5000, 'Nội dung không được vượt quá 5000 ký tự'),
})

export default notificationSchema
