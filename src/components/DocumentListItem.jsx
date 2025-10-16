import { Avatar, Box, Chip, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DownloadIcon from '@mui/icons-material/Download'
import LocalImageLazy from './LocalImageLazy'
import { Link } from 'react-router-dom'

function DocumentListItem({ doc }) {
  return (
    <ListItem alignItems="flex-start" sx={{ borderBottom: `1px solid #eee`, px: 0 }}>
      <ListItemAvatar>
        <Box width={80} height={80} borderRadius={1} overflow="hidden" boxShadow={1}>
          <LocalImageLazy placeholder="/document-placeholder.svg" src={doc.thumbnail} w="100%" h="100%" />
        </Box>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Stack component="span" direction="row" alignItems="center" spacing={2}>
            <Link to={`/documents/${doc.slug}`} style={{ textDecoration: 'none' }}>
              <Typography
                component="span"
                variant="subtitle2"
                fontWeight={700}
                color="primary.main"
                sx={{
                  cursor: 'pointer',
                  ':hover': { textDecoration: 'underline' },
                }}
              >
                {doc.title}
              </Typography>
            </Link>
            {doc.vip && (
              <Chip
                label="VIP"
                size="small"
                sx={{
                  bgcolor: (theme) => theme.palette.warning.amber,
                  color: (theme) => theme.palette.text.white,
                  fontWeight: 700,
                  ml: 1,
                }}
              />
            )}
          </Stack>
        }
        secondary={
          <>
            <Stack component="span" direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
              <AccessTimeIcon fontSize="smaller" />
              <Typography component="span" variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : ''}
              </Typography>
            </Stack>
            <Stack component="span" direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
              <DownloadIcon fontSize="smaller" sx={{ color: 'text.secondary' }} />
              <Typography component="span" variant="body2" color="text.secondary">
                {doc.downloadCount ?? 0}
              </Typography>
            </Stack>
          </>
        }
        sx={{ mb: 0, ml: 2 }}
      />
    </ListItem>
  )
}

export default DocumentListItem
