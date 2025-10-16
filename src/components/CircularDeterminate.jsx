import * as React from 'react'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'

export default function CircularDeterminate({ progress: externalProgress, ...props }) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    // Nếu có external progress thì dùng, không thì tự động fill
    if (externalProgress !== undefined) {
      setProgress(externalProgress)
      return
    }

    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10))
    }, 800)

    return () => {
      clearInterval(timer)
    }
  }, [externalProgress])

  return (
    <Stack spacing={2} direction="row">
      <Stack sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          sx={{
            color: (theme) => theme.palette.text.hint,
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
