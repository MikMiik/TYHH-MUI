// import styles from "./TextInput.module.scss"

import { TextField } from '@mui/material'

function TextInput({ type = 'text', name, register = () => ({}), message = '', ...rest }) {
  return (
    <>
      <TextField type={type} name={name} {...register} {...rest}></TextField>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </>
  )
}

export default TextInput
