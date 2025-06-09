import { Button, Stack } from '@mui/material'
import KeyIcon from '@mui/icons-material/Key'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

import { Link } from 'react-router-dom'
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
            margin: '0 4px 0 0',
          },
        },
      }}
      direction="row"
      spacing={2}
    >
      <Button disableElevation variant="activateKey" startIcon={<KeyIcon />}>
        Kích hoạt thẻ
      </Button>
      <Button
        component={Link}
        to={config.routes.register}
        disableElevation
        variant="register"
        startIcon={<PersonAddAltIcon />}
      >
        Đăng ký
      </Button>
      <Button component={Link} to={config.routes.login} disableElevation variant="login" startIcon={<ExitToAppIcon />}>
        Đăng nhập
      </Button>
    </Stack>
  )
}

export default HeaderActions
