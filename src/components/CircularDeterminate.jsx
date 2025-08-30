import * as React from 'react'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'

export default function CircularDeterminate(props) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10))
    }, 800)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Stack spacing={2} direction="row">
      <Stack sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          sx={{
            color: '#f5f5f5',
            position: 'absolute',
            left: 0,
          }}
          {...props}
        />

        <CircularProgress
          variant="determinate"
          value={progress}
          sx={{
            position: 'relative',
          }}
          {...props}
        />
      </Stack>
    </Stack>
  )
}
