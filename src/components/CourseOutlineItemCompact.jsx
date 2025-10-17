import GreenCircleStepIcon from './GreenCircleStepIcon'

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded'
import CircularDeterminate from './CircularDeterminate'
import EditDocumentIcon from '@mui/icons-material/EditDocument'
import { Link } from 'react-router-dom'

const CourseOutlineItemCompact = ({ title, livestreams = [], courseSlug }) => {
  const seenCount = livestreams.filter((item) => item.isSeen).length
  const totalCount = livestreams.length
  const completionPercentage = totalCount > 0 ? (seenCount / totalCount) * 100 : 0

  return (
    <Accordion
      square
      disableGutters
      defaultExpanded
      sx={{
        boxShadow: 'none',
        borderRadius: 1,
        overflow: 'hidden',
        '& .MuiAccordionSummary-root': {
          minHeight: 32,
          '& .MuiAccordionSummary-content': {
            margin: '6px 0',
          },
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon fontSize="small" />}
        sx={{
          bgcolor: (theme) => theme.palette.primary.light,
          borderRadius: 1,
          py: 0.5,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.8}>
          <CircularDeterminate size={16} thickness={4} color="primary" progress={completionPercentage} />
          <Typography variant="caption" fontWeight={600} fontSize={13}>
            {title}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <List dense sx={{ py: 0 }}>
          {livestreams.map((item) => (
            <ListItem
              key={item.title}
              sx={{
                py: 0.5,
                px: 1,
                minHeight: 28,
                '&:hover': {
                  bgcolor: (theme) => theme.vars.palette.background.paper,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 24 }}>
                <GreenCircleStepIcon isSeen={item.isSeen} sx={{ width: 12, height: 12 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Link to={`/courses/${courseSlug}/${item.slug}`} style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      fontSize={12}
                      color="primary.main"
                      sx={{
                        cursor: 'pointer',
                        display: 'block',
                        lineHeight: 1.2,
                        ':hover': { textDecoration: 'underline' },
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Link>
                }
                secondary={
                  <Stack component="span" direction="row" alignItems="center" spacing={0.5} mt={0.3}>
                    {Array.isArray(item.documents) && item.documents.length > 0 ? (
                      <Link
                        to={`/documents/${item.documents[0].slug}`}
                        style={{ display: 'inline-flex', alignItems: 'center' }}
                      >
                        <EditDocumentIcon sx={{ color: (theme) => theme.palette.icon.light, fontSize: 10 }} />
                      </Link>
                    ) : (
                      <EditDocumentIcon sx={{ color: (theme) => theme.palette.icon.light, fontSize: 10 }} />
                    )}
                    <Typography
                      component="span"
                      variant="caption"
                      fontSize={10}
                      color={(theme) => theme.palette.text.secondary}
                    >
                      {Array.isArray(item.documents) ? item.documents.length : 0}
                    </Typography>

                    <RemoveRedEyeRoundedIcon sx={{ color: (theme) => theme.palette.icon.light, fontSize: 10 }} />
                    <Typography
                      component="span"
                      variant="caption"
                      fontSize={10}
                      color={(theme) => theme.palette.text.secondary}
                    >
                      {item.view || 0}
                    </Typography>
                  </Stack>
                }
                sx={{
                  '& .MuiListItemText-primary': { mb: 0 },
                  '& .MuiListItemText-secondary': { mt: 0 },
                }}
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  )
}

export default CourseOutlineItemCompact
