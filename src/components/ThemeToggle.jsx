import { IconButton, Tooltip } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useColorScheme } from '@mui/material/styles'

const ThemeToggle = ({ sx, ...props }) => {
  const { mode, setMode } = useColorScheme()

  const handleToggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  if (!mode) {
    return null
  }

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={handleToggle}
        color="inherit"
        sx={{
          ...sx,
          p: 0,
          ml: '10px !important',
        }}
        {...props}
      >
        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle
