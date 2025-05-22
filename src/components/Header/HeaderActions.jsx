import { Button, Stack } from '@mui/material'
import KeyIcon from '@mui/icons-material/Key'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import CustomLink from '../CustomLink'
import config from '@/config'

function HeaderActions() {
  return (
    <Stack
      sx={{
        '& .MuiButtonBase-root': {
          fontSize: '0.875rem',
          marginLeft: 1,
          '& .MuiButton-icon': {
            fontWeight: '100',
            margin: '0 2px',
          },
        },
      }}
      direction="row"
      spacing={2}
    >
      <Button disableElevation variant="contained" type="active" startIcon={<KeyIcon />}>
        Kích hoạt thẻ
      </Button>
      <Button disableElevation variant="contained" type="register" startIcon={<PersonAddAltIcon />}>
        <CustomLink sx={{ '&:hover': { color: 'inherit' } }} to={config.routes.register}>
          Đăng ký
        </CustomLink>
      </Button>
      <Button disableElevation variant="contained" type="login" startIcon={<ExitToAppIcon />}>
        <CustomLink sx={{ '&:hover': { color: 'inherit' } }} to={config.routes.login}>
          Đăng nhập
        </CustomLink>
      </Button>
    </Stack>
  )
}

export default HeaderActions
