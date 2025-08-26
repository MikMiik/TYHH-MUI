import { Avatar, Chip, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
function DocumentListItem({ image, title, date, vip }) {
  return (
    <ListItem alignItems="flex-start" sx={{ borderBottom: '1px solid #eee', px: 0 }}>
      <ListItemAvatar>
        <Avatar variant="square" src={image} sx={{ width: 64, height: 64, mr: 2 }} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              {title}
            </Typography>
            {vip && (
              <Chip label="VIP" size="small" sx={{ bgcolor: '#ffb300', color: '#fff', fontWeight: 700, ml: 1 }} />
            )}
          </Stack>
        }
        secondary={
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
            <AccessTimeIcon fontSize="smaller" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {date}
            </Typography>
          </Stack>
        }
        sx={{ mb: 0 }}
      />
    </ListItem>
  )
}

export default DocumentListItem
