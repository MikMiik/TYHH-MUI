import * as yup from "yup"

const registerSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid email format"),
    password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
    username: yup
        .string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    displayName: yup.string(),
    // .min(3, "Display name must be at least 3 characters")
    // .max(20, "Display name must be at most 20 characters")
    // .matches(
    //   /^[a-zA-Z0-9_]+$/,
    //   "Display name can only contain letters, numbers, and underscores"
    // ),
    dateOfBirth: yup
        .date()
        .required("Date of birth is required")
        .typeError("Invalid date format")
        .transform((_value, originalValue) => {
            const date = new Date(originalValue)
            return isNaN(date.getTime()) ? null : date
        })
        .max(new Date(), "Date of birth cannot be in the future"),
})

export default registerSchema
