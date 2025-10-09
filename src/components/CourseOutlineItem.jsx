import GreenCircleStepIcon from './GreenCircleStepIcon'

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded'
import DeleteIcon from '@mui/icons-material/Delete'
import CircularDeterminate from './CircularDeterminate'
import EditDocumentIcon from '@mui/icons-material/EditDocument'
import { Link } from 'react-router-dom'

const CourseOutlineItem = ({ title, livestreams = [], outlineId, onDeleteOutline }) => {
  // Tính phần trăm hoàn thành dựa trên số livestream đã xem
  const seenCount = livestreams.filter((item) => item.isSeen).length
  const totalCount = livestreams.length
  const completionPercentage = totalCount > 0 ? (seenCount / totalCount) * 100 : 0

  const handleDeleteClick = (e) => {
    e.stopPropagation() // Prevent accordion from expanding/collapsing
    if (onDeleteOutline) {
      onDeleteOutline(outlineId, title)
    }
  }

  return (
    <>
      <Accordion
        square
        disableGutters
        defaultExpanded
        sx={{
          boxShadow: 'none',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: 48,
            bgcolor: '#e0e0e0',
            borderRadius: 2,
            position: 'relative',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
            <CircularDeterminate size={20} thickness={5} color="primary" progress={completionPercentage} />
            <Typography variant="subtitle2" fontWeight={600}>
              {title}
            </Typography>
          </Stack>

          {/* Delete Icon */}
          {onDeleteOutline && (
            <Box sx={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)' }}>
              <Tooltip title="Xóa outline">
                <IconButton
                  size="small"
                  onClick={handleDeleteClick}
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': {
                      bgcolor: 'error.main',
                      color: 'white',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Stepper
            orientation="vertical"
            nonLinear
            activeStep={-1}
            sx={{ pl: 2, pr: 0, '& .MuiStepConnector-root, & .MuiStepContent-root': { ml: '10px' } }}
          >
            {livestreams.map((item) => (
              <Step key={item.title} expanded>
                <StepLabel slots={{ stepIcon: (props) => <GreenCircleStepIcon isSeen={item.isSeen} {...props} /> }}>
                  <Link to={`/livestreams/${item.slug}`} style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary.main"
                      sx={{ cursor: 'pointer', ':hover': { textDecoration: 'underline' } }}
                    >
                      {item.title}
                    </Typography>
                  </Link>
                </StepLabel>
                <StepContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {Array.isArray(item.documents) && item.documents.length > 0 ? (
                      <Link
                        to={`/documents/${item.documents[0].slug}`}
                        style={{ display: 'inline-flex', alignItems: 'center' }}
                      >
                        <EditDocumentIcon sx={{ color: '#999', ':hover': { color: '#666' } }} fontSize="smaller" />
                      </Link>
                    ) : (
                      <EditDocumentIcon sx={{ color: '#999', ':hover': { color: '#666' } }} fontSize="smaller" />
                    )}
                    <Typography fontSize={14} color="#888">
                      {Array.isArray(item.documents) ? item.documents.length : 0}
                    </Typography>

                    <RemoveRedEyeRoundedIcon sx={{ color: '#999', ':hover': { color: '#666' } }} fontSize="smaller" />
                    <Typography fontSize={14} color="#888">
                      {item.view || 0}
                    </Typography>
                  </Stack>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default CourseOutlineItem
