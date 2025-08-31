import { TextField, InputAdornment, IconButton } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from 'react'

function TextInput({ type = 'text', name, register = () => ({}), error, helperText, ...rest }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
  return (
    <TextField
      type={inputType}
      name={name}
      {...register}
      {...rest}
      error={error}
      helperText={helperText}
      slotProps={{
        input: {
          endAdornment: isPassword ? (
            <InputAdornment position="end absolute">
              <IconButton
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onClick={() => setShowPassword((v) => !v)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  )
}

export default TextInput
