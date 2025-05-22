import * as yup from "yup"

const loginSchema = yup.object().shape({
    email: yup.string().required("Trường bắt buộc không được để trống"),
    password: yup.string().required("Trường bắt buộc không được để trống"),
})

export default loginSchema
