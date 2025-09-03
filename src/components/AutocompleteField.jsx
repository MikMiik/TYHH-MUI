import { Autocomplete, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'

function AutocompleteField({
  name,
  control,
  label,
  options = [],
  getOptionLabel = (option) => option?.name || '',
  isOptionEqualToValue = (option, value) => option?.id === value?.id,
  loading = false,
  error,
  helperText,
  size = 'medium',
  fullWidth = false,
  noOptionsText = 'Không có lựa chọn',
  loadingText = 'Đang tải...',
  // valueAs: 'object' (default) -> store full option object in form
  // valueAs: 'string' -> store option[valueKey] (e.g. name) in form
  valueAs = 'object',
  // the key to use when valueAs === 'string'
  valueKey = 'name',
  ...props
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          // Map stored form value -> autocomplete option/object
          options={options}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          loading={loading}
          size={size}
          noOptionsText={noOptionsText}
          loadingText={loadingText}
          onChange={(_, value) => {
            // When valueAs === 'string', send option[valueKey] (or empty string) to form
            if (valueAs === 'string') {
              field.onChange(value ? value[valueKey] : '')
            } else {
              field.onChange(value)
            }
          }}
          value={
            // if stored value is primitive (string) and valueAs === 'string', find the matching option
            valueAs === 'string' ? options.find((o) => o?.[valueKey] === field.value) || null : field.value || null
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              size={size}
              fullWidth={fullWidth}
              error={error}
              helperText={helperText}
              sx={{
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                  transition: 'border-color .3s ease',
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'secondary.light',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'secondary.light',
                  boxShadow: '0 0 0 2px rgba(24, 144, 255, .2)',
                  borderWidth: '1px',
                  outline: '0',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'secondary.main',
                },
                '& .MuiInputLabel-root.MuiFormLabel-filled': {
                  color: 'secondary.main',
                },
              }}
            />
          )}
          {...props}
        />
      )}
    />
  )
}

export default AutocompleteField
