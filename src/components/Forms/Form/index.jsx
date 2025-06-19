import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Children, cloneElement } from 'react'

import TextInput from '../TextInput'
import { TextField } from '@mui/material'

function Form({ schema = {}, defaultValues = {}, formProps, onSubmit, children }) {
  const config = {
    resolver: yupResolver(schema),
    defaultValues,
    ...formProps,
  }
  const formControl = useForm(config)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formControl)

  const allowedComponents = [TextInput, TextField]
  const inputs = Children.toArray(children).map((child) => {
    if (!allowedComponents.includes(child.type)) return child
    return cloneElement(child, {
      register: register(child.props.name),
      message: errors[child.props.name]?.message,
    })
  })
  return <form onSubmit={handleSubmit(onSubmit)}>{inputs}</form>
}

export default Form
