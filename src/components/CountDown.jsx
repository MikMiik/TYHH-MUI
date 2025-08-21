import { useEffect, useState } from 'react'
import { Typography, Stack, Paper } from '@mui/material'

const TimeBox = ({ value, label }) => (
  <Stack>
    <Paper
      variant="outlined"
      sx={{
        width: '32px',
        height: '26px',
        color: '#fff',
        textAlign: 'center',
        backgroundColor: 'transparent',
        borderRadius: '5px',
        border: '1px solid #fff',
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
      setTime(time - 1000)
    }, 1000)
    return () => clearTimeout(timeID)
  }, [time])
  let totalSeconds = parseInt(Math.floor(time / 1000))
  let totalMinutes = parseInt(Math.floor(totalSeconds / 60))
  let totalHours = parseInt(Math.floor(totalMinutes / 1000))
  let days = parseInt(Math.floor(totalHours / 24))

  let seconds = parseInt(totalSeconds % 60)
  let minutes = parseInt(totalMinutes % 60)
  let hours = parseInt(totalHours % 24)
  return (
    <Stack sx={{ color: '#fff' }} direction="row" spacing={0.5} alignItems="center">
      <TimeBox value={days} label="Day" />
      <Typography sx={{ transform: 'translateY(-25%)' }} variant="h6">
        :
      </Typography>
      <TimeBox value={hours} label="Hour" />
      <Typography sx={{ transform: 'translateY(-25%)' }} variant="h6">
        :
      </Typography>
      <TimeBox value={minutes} label="Minutes" />
      <Typography sx={{ transform: 'translateY(-25%)' }} variant="h6">
        :
      </Typography>
      <TimeBox value={seconds} label="Seconds" />
    </Stack>
  )
}

export default CountDown
