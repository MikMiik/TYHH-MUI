import { Avatar, Chip, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ImageLazy from './ImageLazy'
function DocumentListItem({ doc }) {
  return (
    <ListItem alignItems="flex-start" sx={{ borderBottom: '1px solid #eee', px: 0 }}>
      <ListItemAvatar>
        <ImageLazy src={doc.thumbnail} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Stack component="span" direction="row" alignItems="center" spacing={2}>
            <Typography component="span" variant="subtitle2" fontWeight={700} color="text.primary">
              {doc.title}
            </Typography>
            {doc.vip && (
              <Chip label="VIP" size="small" sx={{ bgcolor: '#ffb300', color: '#fff', fontWeight: 700, ml: 1 }} />
            )}
          </Stack>
        }
        secondary={
          <Stack component="span" direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
            <AccessTimeIcon fontSize="smaller" />
            <Typography component="span" variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : ''}
            </Typography>
          </Stack>
        }
        sx={{ mb: 0, ml: 2 }}
      />
    </ListItem>
  )
}

export default DocumentListItem
