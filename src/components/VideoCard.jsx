import videoImg from '@/assets/images/video-img.png'

import { Card, CardContent, CardMedia, Typography, Button, Stack } from '@mui/material'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import theme from '@/theme'

function VideoCard({ image, title, teacher, price, onClick }) {
  return (
    <Card
      sx={{
        width: theme.customVars.videoCardWidth,
        height: theme.customVars.videoCardHeight,
        borderRadius: 2,
        boxShadow: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardMedia component="img" height="160" image={image || videoImg} alt={title} sx={{ objectFit: 'cover' }} />
      <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Stack direction="column" justifyContent="flex-end" flex={1} spacing={1} sx={{ mt: 'auto' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <PersonOutlinedIcon fontSize="small" />
            <Typography variant="body2" color="secondary" fontWeight={500}>
              {teacher}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccountBalanceWalletOutlinedIcon fontSize="small" />
            <Typography variant="body2" color="error.light" fontWeight={500}>
              {price}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, mt: 1 }}
            onClick={onClick}
          >
            Vào học ngay
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default VideoCard
