import React, { useEffect, useState } from 'react'
import { Box, Typography, Stack, Paper } from '@mui/material'

const TimeBox = ({ value, label }) => (
  <Paper elevation={3} sx={{ padding: 1.5, minWidth: 60, textAlign: 'center', borderRadius: 2 }}>
    <Typography variant="h5" color="white">
      {value}
    </Typography>
    <Typography variant="caption" color="white">
      {label}
    </Typography>
  </Paper>
)

const Test = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 35,
    hours: 3,
    minutes: 50,
    seconds: 45,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) seconds--
        else {
          seconds = 59
          if (minutes > 0) minutes--
          else {
            minutes = 59
            if (hours > 0) hours--
            else {
              hours = 23
              if (days > 0) days--
            }
          }
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Box sx={{ backgroundColor: '#064d36', padding: 2, borderRadius: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TimeBox value={timeLeft.days} label="Day" />
        <Typography variant="h5" color="white">
          :
        </Typography>
        <TimeBox value={timeLeft.hours} label="Hour" />
        <Typography variant="h5" color="white">
          :
        </Typography>
        <TimeBox value={timeLeft.minutes} label="Minutes" />
        <Typography variant="h5" color="white">
          :
        </Typography>
        <TimeBox value={timeLeft.seconds} label="Seconds" />
      </Stack>
    </Box>
  )
}

export default Test
