import { TextField } from '@mui/material'

function TextInput({ type = 'text', name, register = () => ({}), error, helperText, ...rest }) {
  return (
    <>
      <TextField type={type} name={name} {...register} {...rest} error={error} helperText={helperText}></TextField>
      {/* truyền vào object: socials.facebook, socials.twitter */}
      {/* truyền vào mảng: phoneNumbers.0, phoneNumbers.1 */}
    </>
  )
}

export default TextInput
