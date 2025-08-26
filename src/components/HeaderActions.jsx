import { Button, IconButton, Stack } from '@mui/material'
import KeyIcon from '@mui/icons-material/Key'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'

import { Link } from 'react-router-dom'
import config from '@/routes/config'
import useResponsive from '@/hooks/useResponsive'
import DropAvatar from './DropAvatar'
import NotiDrop from './NotiDrop'

const isAuth = false

function HeaderActions() {
  const { isDesktop, isLaptop } = useResponsive()
  if (isDesktop || isLaptop) {
    return (
      <>
        {isDesktop ? (
          <Stack
            sx={{
              '& .MuiButtonBase-root': {
                fontSize: '0.875rem',
                '& .MuiButton-icon': {
                  fontWeight: '100',
                  margin: '0 4px 0 0',
                },
              },
            }}
            direction="row"
            spacing={2}
          >
            <Button
              disableElevation
              startIcon={<KeyIcon />}
              sx={{
                backgroundColor: '#ec971f',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#e08e0b',
                },
              }}
            >
              Kích hoạt thẻ
            </Button>
            {isAuth ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <DropAvatar bgcolor="tertiary.main" width={32} height={32} />
                <NotiDrop />
              </Stack>
            ) : (
              <Button
                component={Link}
                to={config.routes.register}
                disableElevation
                startIcon={<PersonAddAltIcon />}
                sx={{
                  backgroundColor: '#1890ff',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#40a9ff',
                  },
                }}
              >
                Đăng ký
              </Button>
            )}
            <Button
              component={Link}
              to={config.routes.login}
              disableElevation
              startIcon={<ExitToAppIcon />}
              sx={{
                backgroundColor: '#ff4d4f',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#ff7875',
                },
              }}
            >
              {isAuth ? 'Đăng xuất' : 'Đăng nhập'}
            </Button>
          </Stack>
        ) : (
          <Stack
            sx={{
              '& .MuiButtonBase-root': {
                borderRadius: '100%',
                height: '34px',
                width: '34px',
                minWidth: '0',
                padding: '0',
              },
            }}
            direction="row"
            spacing={2}
          >
            <IconButton
              sx={{
                backgroundColor: '#ec971f',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#e08e0b',
                },
              }}
            >
              <KeyIcon fontSize="small" />
            </IconButton>
            {isAuth ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <DropAvatar bgcolor="tertiary.main" width={32} height={32} />
                <NotificationsOutlinedIcon fontSize="medium" />
              </Stack>
            ) : (
              <IconButton
                component={Link}
                to={config.routes.register}
                sx={{
                  backgroundColor: '#1890ff',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#40a9ff',
                  },
                }}
              >
                <PersonAddAltIcon fontSize="small" />
              </IconButton>
            )}

            <IconButton
              component={Link}
              to={config.routes.login}
              sx={{
                backgroundColor: '#ff4d4f',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#ff7875',
                },
              }}
            >
              <ExitToAppIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}
      </>
    )
  }
}

export default HeaderActions
