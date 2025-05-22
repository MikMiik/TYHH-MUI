import { Box, Typography } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import CountDown from '@/components/Header/CountDown'

function HeaderTopBar() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        backgroundColor: 'primary.main',
        width: '100%',
        height: (theme) => theme.customVars.headerTopBarHeight,
      }}
    >
      <CalendarMonthIcon />
      <Typography marginRight={8} marginLeft={1}>
        Đếm ngược ngày thi tốt nghiệp THPT 2025
      </Typography>
      <CountDown duration={2 * 24 * 60 * 60 * 1000} />
    </Box>
  )
}

export default HeaderTopBar
