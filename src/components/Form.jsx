import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Children, cloneElement } from 'react'
import * as yup from 'yup'
import TextInput from './TextInput'
import { Button, Stack, TextField } from '@mui/material'

function Form({ schema = yup.object({}), defaultValues = {}, formProps, onSubmit, children }) {
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

  const allowedComponents = [TextInput, TextField, Stack]
  const inputs = Children.toArray(children).map((child) => {
    if (allowedComponents.includes(child.type)) {
      if (child.type === Stack) {
        const stackItems = Children.toArray(child.props.children)
        return cloneElement(child, {
          children: stackItems.map((item) => {
            const hasError = !!errors[item.props.name]
            return cloneElement(item, {
              register: register(item.props.name, item.props.registerOptions),
              error: hasError ? true : undefined,
              helperText: hasError ? errors[item.props.name]?.message : undefined,
            })
          }),
        })
      }

      const hasError = !!errors[child.props.name]
      return cloneElement(child, {
        register: register(child.props.name, child.props.registerOptions),
        error: hasError ? true : undefined,
        helperText: hasError ? errors[child.props.name]?.message : undefined,
        // VD: registerOptions={{ valueAsNumber: true, disabled: true }}
        // Validation cũng vô hiệu nếu disabled
        // disabled dùng với hàm watch để check điều kiện field khác được điền trước thì field này mới đc mở
        // VD: watch('otherField') === 'someValue'
      })
    }
    if (
      child.type === Button &&
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
