import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Children, cloneElement } from 'react'

import TextInput from './TextInput'
import { TextField } from '@mui/material'

function Form({ schema = {}, defaultValues = {}, formProps, onSubmit, children }) {
  const config = {
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onBlur',
    ...formProps,
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm(config)

  const onError = (error) => {
    console.log('Form submission error:', error)
  }

  const allowedComponents = [TextInput, TextField]
  const inputs = Children.toArray(children).map((child) => {
    if (allowedComponents.includes(child.type)) {
      return cloneElement(child, {
        register: register(child.props.name, child.props.registerOptions),
        error: !!errors[child.props.name],
        helperText: errors[child.props.name]?.message,
        // VD: registerOptions={{ valueAsNumber: true, disabled: true }}
        // Validation cũng vô hiệu nếu disabled
        // disabled dùng với hàm watch để check điều kiện field khác được điền trước thì field này mới đc mở
        // VD: watch('otherField') === 'someValue'
      })
    }
    if (
      child.type === 'button' &&
      (child.props.type === 'submit' || !child.props.type) // mặc định là submit nếu không có type
    ) {
      return cloneElement(child, {
        disabled: !isDirty || isSubmitting,
      })
    }
    return child
  })
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      {inputs}
    </form>
  )
}

export default Form
