import { Stack, Typography } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import CountDown from '@/components/CountDown'
import useResponsive from '@/hooks/useResponsive'
import { Fragment } from 'react'

function HeaderTopBar() {
  const { isMobile } = useResponsive()
  const Wrapper = isMobile ? Stack : Fragment
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="center"
      alignItems="center"
      p={1}
      sx={{
        color: '#fff',
        backgroundColor: 'primary.main',
        width: '100%',
        minHeight: (theme) => theme.muiVars.headerTopBarHeight,
      }}
    >
      <Wrapper direction="row" alignItems="center">
        <CalendarMonthIcon />
        <Typography marginRight={{ xs: 0, sm: 8 }} marginLeft={1} my={{ xs: 1, sm: 0 }}>
          Đếm ngược ngày thi tốt nghiệp THPT 2025
        </Typography>
      </Wrapper>
      <CountDown duration={2 * 24 * 60 * 60 * 1000} />
    </Stack>
  )
}

export default HeaderTopBar
