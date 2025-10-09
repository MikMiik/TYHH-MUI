import * as Yup from 'yup'

export const createLivestreamSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự')
    .required('Tiêu đề là bắt buộc'),
  courseId: Yup.number().positive('Course ID không hợp lệ').required('Course ID là bắt buộc'),
  courseOutlineId: Yup.number().positive('Course Outline ID không hợp lệ').required('Course Outline ID là bắt buộc'),
  order: Yup.number().positive('Thứ tự phải là số dương').integer('Thứ tự phải là số nguyên').nullable(),
})

export const updateLivestreamSchema = Yup.object({
  title: Yup.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự').max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
  order: Yup.number().positive('Thứ tự phải là số dương').integer('Thứ tự phải là số nguyên').nullable(),
  url: Yup.string()
    .nullable()
    .matches(/^(https?:\/\/|\/)/, 'URL phải là đường dẫn hợp lệ hoặc relative path'),
})

export const reorderLivestreamsSchema = Yup.object({
  courseOutlineId: Yup.number().positive('Course Outline ID không hợp lệ').required('Course Outline ID là bắt buộc'),
  orders: Yup.array()
    .of(
      Yup.object({
        id: Yup.number().positive('Livestream ID không hợp lệ').required('Livestream ID là bắt buộc'),
        order: Yup.number()
          .positive('Thứ tự phải là số dương')
          .integer('Thứ tự phải là số nguyên')
          .required('Thứ tự là bắt buộc'),
      })
    )
    .min(1, 'Phải có ít nhất 1 livestream để sắp xếp')
    .required('Danh sách thứ tự là bắt buộc'),
})
