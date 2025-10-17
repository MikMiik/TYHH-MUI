import { Stack, Typography } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import CountDown from '@/components/CountDown'
import useResponsive from '@/hooks/useResponsive'
import { Fragment } from 'react'
import { useMemo } from 'react'

function HeaderTopBar() {
  const { isMobile } = useResponsive()
  const { duration, targetYear } = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    // target June 10 of next year if today is after or on June 10 of this year
    const targetThisYear = new Date(year, 5, 10, 0, 0, 0) // month is 0-based -> 5 = June
    let target = targetThisYear
    if (now >= targetThisYear) {
      target = new Date(year + 1, 5, 10, 0, 0, 0)
    }
    return { duration: Math.max(0, target.getTime() - now.getTime()), targetYear: target.getFullYear() }
  }, [])
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="center"
      alignItems="center"
      p={1}
      sx={{
        color: (theme) => theme.palette.text.inverse,
        background: (theme) => theme.palette.gradient.main,
        width: '100%',
        minHeight: (theme) => theme.muiVars.headerTopBarHeight,
      }}
    >
      {isMobile ? (
        <Stack direction="row" alignItems="center">
          <CalendarMonthIcon />
          <Typography marginRight={{ xs: 0, sm: 8 }} marginLeft={1} my={{ xs: 1, sm: 0 }}>
            Đếm ngược ngày thi tốt nghiệp THPT {targetYear}
          </Typography>
        </Stack>
      ) : (
        <Fragment>
          <CalendarMonthIcon />
          <Typography marginRight={{ xs: 0, sm: 8 }} marginLeft={1} my={{ xs: 1, sm: 0 }}>
            Đếm ngược ngày thi tốt nghiệp THPT {targetYear}
          </Typography>
        </Fragment>
      )}
      {/* Duration: milliseconds until next 10 June */}
      <CountDown duration={duration} />
    </Stack>
  )
}

export default HeaderTopBar
