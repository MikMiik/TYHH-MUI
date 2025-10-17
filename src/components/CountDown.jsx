import { useEffect, useState } from 'react'
import { Typography, Stack, Paper } from '@mui/material'

const TimeBox = ({ value, label }) => (
  <Stack>
    <Paper
      variant="outlined"
      sx={{
        width: '32px',
        height: '26px',
        color: (theme) => theme.palette.text.inverse,
        textAlign: 'center',
        backgroundColor: 'transparent',
        borderRadius: '5px',
        border: (theme) => `1px solid ${theme.palette.text.inverse}`,
      }}
    >
      <Typography sx={{ fontWeight: '700', textAlign: 'center', fontSize: '0.875rem', lineHeight: 1.8 }}>
        {value}
      </Typography>
    </Paper>
    <Typography sx={{ fontSize: '0.5rem' }} align="center" variant="caption">
      {label}
    </Typography>
  </Stack>
)

const CountDown = ({ duration }) => {
  const [time, setTime] = useState(duration)
  useEffect(() => {
    const timeID = setTimeout(() => {
      setTime((t) => Math.max(0, t - 1000))
    }, 1000)
    return () => clearTimeout(timeID)
  }, [time])

  // Clamp to zero to avoid negative values
  const remaining = Math.max(0, time)
  const totalSeconds = Math.floor(remaining / 1000)
  const totalMinutes = Math.floor(totalSeconds / 60)
  const totalHours = Math.floor(totalMinutes / 60)
  const days = Math.floor(totalHours / 24)

  const seconds = totalSeconds % 60
  const minutes = totalMinutes % 60
  const hours = totalHours % 24
  return (
    <Stack sx={{ color: (theme) => theme.palette.text.inverse }} direction="row" spacing={0.5} alignItems="center">
      <TimeBox value={days} label="Ngày" />
      <Typography sx={{ transform: 'translateY(-25%)' }} variant="h6">
        :
      </Typography>
      <TimeBox value={hours} label="Giờ" />
      <Typography sx={{ transform: 'translateY(-25%)' }} variant="h6">
        :
      </Typography>
      <TimeBox value={minutes} label="Phút" />
      <Typography sx={{ transform: 'translateY(-25%)' }} variant="h6">
        :
      </Typography>
      <TimeBox value={seconds} label="Giây" />
    </Stack>
  )
}

export default CountDown
