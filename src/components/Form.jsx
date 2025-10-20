import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Children, cloneElement } from 'react'
import * as yup from 'yup'
import TextInput from './TextInput'
import AutocompleteField from './AutocompleteField'
import { Button, FormControlLabel, Stack, TextField, Box, Checkbox } from '@mui/material'

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
    control,
    formState: { errors, isSubmitting },
  } = useForm(config)

  const onError = (error) => {
    console.log('Form submission error:', error)
  }

  const allowedComponents = [TextInput, TextField, Stack, Box, FormControlLabel, AutocompleteField]

  // Recursive function to handle nested components and register inputs
  const processChild = (child) => {
    if (!child || typeof child !== 'object') return child

    // Handle containers (Stack, Box) - process their children recursively
    if (child.type === Stack || child.type === Box) {
      const containerChildren = Children.toArray(child.props.children)
      return cloneElement(child, {
        children: containerChildren.map(processChild),
      })
    }

    // Handle FormControlLabel with Checkbox
    if (child.type === FormControlLabel && child.props.control?.type === Checkbox) {
      const checkboxName = child.props.name || child.props.control?.props?.name
      if (checkboxName) {
        const hasError = !!errors[checkboxName]
        return cloneElement(child, {
          control: cloneElement(child.props.control, {
            ...register(checkboxName),
          }),
          error: hasError,
          // You can add error styling here if needed
        })
      }
    }

    // Handle input components (TextInput, TextField, AutocompleteField)
    if (allowedComponents.includes(child.type) && child.props.name) {
      const hasError = !!errors[child.props.name]

      // Special handling for AutocompleteField
      if (child.type === AutocompleteField) {
        return cloneElement(child, {
          control,
          error: hasError ? true : undefined,
          helperText: hasError ? errors[child.props.name]?.message : undefined,
        })
      }

      // Regular handling for other input components
      return cloneElement(child, {
        register: register(child.props.name, child.props.registerOptions),
        error: hasError ? true : undefined,
        helperText: hasError ? errors[child.props.name]?.message : undefined,
      })
      // VD: registerOptions={{ valueAsNumber: true, disabled: true }}
      // Validation cũng vô hiệu nếu disabled
      // disabled dùng với hàm watch để check điều kiện field khác được điền trước thì field này mới đc mở
      // VD: watch('otherField') === 'someValue'
    }

    // Handle submit buttons
    if (child.type === Button && (child.props.type === 'submit' || !child.props.type)) {
      return cloneElement(child, {
        disabled: isSubmitting,
      })
    }

    return child
  }

  const inputs = Children.toArray(children).map(processChild)
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate autoComplete="on">
      {inputs}
    </form>
  )
}

export default Form
