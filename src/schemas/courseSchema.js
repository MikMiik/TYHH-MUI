import * as yup from 'yup'

const courseSchema = yup.object().shape({
  title: yup
    .string()
    .required('Tên khóa học không được để trống')
    .min(5, 'Tên khóa học phải có ít nhất 5 ký tự')
    .max(100, 'Tên khóa học không được vượt quá 100 ký tự'),

  description: yup.string().max(500, 'Mô tả không được vượt quá 500 ký tự').nullable(),

  purpose: yup.string().max(300, 'Mục đích khóa học không được vượt quá 300 ký tự').nullable(),

  content: yup.string().max(1000, 'Nội dung chi tiết không được vượt quá 1000 ký tự').nullable(),

  group: yup.string().max(50, 'Nhóm khóa học không được vượt quá 50 ký tự').nullable(),

  price: yup.number().when('isFree', {
    is: false,
    then: (schema) =>
      schema
        .required('Giá khóa học không được để trống khi không miễn phí')
        .min(0, 'Giá khóa học không được âm')
        .max(50000000, 'Giá khóa học không được vượt quá 50,000,000 VNĐ'),
    otherwise: (schema) => schema.nullable(),
  }),

  discount: yup.number().when('isFree', {
    is: false,
    then: (schema) =>
      schema
        .min(0, 'Giảm giá không được âm')
        .test('discount-less-than-price', 'Giảm giá không được lớn hơn giá gốc', function (value) {
          const { price } = this.parent
          if (!value || !price) return true
          return value <= price
        }),
    otherwise: (schema) => schema.nullable(),
  }),

  isFree: yup.boolean().default(false),

  topicIds: yup
    .array()
    .of(yup.number().positive('ID chủ đề không hợp lệ'))
    .min(1, 'Vui lòng chọn ít nhất một chủ đề')
    .max(5, 'Không được chọn quá 5 chủ đề'),

  thumbnail: yup.string().nullable(),
})

export default courseSchema
