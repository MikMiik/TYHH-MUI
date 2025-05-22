import { useEffect, useState } from 'react'
import { Box, Typography, Stack, Paper } from '@mui/material'

const TimeBox = ({ value, label }) => (
  <Stack>
    <Paper
      variant="outlined"
      sx={{
        width: '32px',
        height: '26px',
        textAlign: 'center',

        borderRadius: '5px',
        border: '1px solid #fff',
      }}
    >
      <Typography variant="subtitle1">{value}</Typography>
    </Paper>
    <Typography sx={{ fontSize: '0.5rem' }} align="center" variant="caption">
      {label}
    </Typography>
  </Stack>
)

const Test = () => {
  return (
    <Stack
      sx={{ margin: 20, padding: 5, backgroundColor: 'green', alignItems: 'start' }}
      direction="row"
      spacing={1}
      alignItems="center"
    >
      <TimeBox value={2} label="Day" />
      <Typography sx={{ lineHeight: 1.2 }} variant="h6" color="warning">
        :
      </Typography>
      <TimeBox value={2} label="Hour" />
      <Typography sx={{ lineHeight: 1.2 }} variant="h6" color="warning">
        :
      </Typography>
      <TimeBox value={2} label="Minutes" />
      <Typography sx={{ lineHeight: 1.2 }} variant="h6" color="warning">
        :
      </Typography>
      <TimeBox value={2} label="Seconds" />
    </Stack>
  )
}

export default Test
