import videoImg from '@/assets/images/video-img.png'

import { Card, CardContent, CardMedia, Typography, Button, Stack } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import theme from '@/theme/theme'

function VideoCard({ image, title, course, width, sx }) {
  return (
    <Card
      component={RouterLink}
      to={course?.slug ? `/courses/${course.slug}` : '#'}
      sx={{
        width: width || (sx && sx.width) || theme.muiVars.videoCardWidth,
        borderRadius: 1,
        boxShadow: 2,
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        cursor: 'pointer',
        ...sx,
      }}
    >
      <CardMedia component="img" height="auto" image={image || videoImg} alt={title} sx={{ objectFit: 'cover' }} />
      <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
          {course.title}
        </Typography>
        <Stack direction="column" justifyContent="flex-end" flex={1} spacing={1} sx={{ mt: 'auto' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <PersonOutlinedIcon fontSize="small" />
            <Typography variant="body2" color="secondary" fontWeight={500}>
              {course.teacher?.name?.toUpperCase() || 'Unknown Teacher'}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccountBalanceWalletOutlinedIcon fontSize="small" />
              <Typography variant="body2" color="error.light" fontWeight={500}>
                {course.discount
                  ? `${parseInt(course.discount, 10).toLocaleString('vi-VN')}₫`
                  : course.price
                  ? `${parseInt(course.price, 10).toLocaleString('vi-VN')}₫`
                  : 'Free'}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <VisibilityOutlinedIcon fontSize="smaller" color="action" />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {course.totalView ? course.totalView.toLocaleString('vi-VN') : 0}
              </Typography>
            </Stack>
          </Stack>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, mt: 1 }}
            // Remove onClick, button is now just visual
          >
            Vào học ngay
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default VideoCard
