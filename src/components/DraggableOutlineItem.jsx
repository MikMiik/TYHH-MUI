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
  Chip,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import CircularDeterminate from './CircularDeterminate'
import EditDocumentIcon from '@mui/icons-material/EditDocument'
import GreenCircleStepIcon from './GreenCircleStepIcon'
import { Link } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const DraggableOutlineItem = ({
  outline,
  courseSlug,
  index,
  onDeleteOutline,
  onEditOutline,
  onCreateLivestream,
  ...accordionProps
}) => {
  // Setup sortable functionality
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: outline.id.toString(),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Tính phần trăm hoàn thành dựa trên số livestream đã xem
  const livestreams = outline.livestreams || []
  const seenCount = livestreams.filter((item) => item.isSeen).length
  const totalCount = livestreams.length
  const completionPercentage = totalCount > 0 ? (seenCount / totalCount) * 100 : 0

  const handleDeleteClick = (e) => {
    e.stopPropagation() // Prevent accordion from expanding/collapsing
    e.preventDefault() // Additional prevention
    if (onDeleteOutline) {
      onDeleteOutline(outline.id, outline.title)
    }
  }

  const handleEditClick = (e) => {
    e.stopPropagation() // Prevent accordion from expanding/collapsing
    e.preventDefault() // Additional prevention
    if (onEditOutline) {
      onEditOutline(outline)
    }
  }

  const handleCreateLivestreamClick = (e) => {
    e.stopPropagation() // Prevent accordion from expanding/collapsing
    e.preventDefault() // Additional prevention
    if (onCreateLivestream) {
      onCreateLivestream(outline)
    }
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: 'relative',
        transform: isDragging ? 'rotate(5deg)' : 'none',
        boxShadow: isDragging ? 3 : 'none',
        borderRadius: 2,
        overflow: 'hidden',
        border: isDragging ? '2px dashed' : '1px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
      }}
    >
      {/* Action Icons - Create Livestream, Edit and Delete */}
      <Box sx={{ position: 'absolute', right: 8, top: 8, zIndex: 10, pointerEvents: 'auto' }}>
        <Stack direction="row" spacing={1}>
          {/* Create Livestream Icon */}
          {onCreateLivestream && (
            <Tooltip title="Tạo livestream mới">
              <IconButton
                size="small"
                onClick={handleCreateLivestreamClick}
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  pointerEvents: 'auto',
                  '&:hover': {
                    bgcolor: 'success.main',
                    color: 'white',
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Edit Icon */}
          {onEditOutline && (
            <Tooltip title="Chỉnh sửa outline">
              <IconButton
                size="small"
                onClick={handleEditClick}
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  pointerEvents: 'auto',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Delete Icon */}
          {onDeleteOutline && (
            <Tooltip title="Xóa outline">
              <IconButton
                size="small"
                onClick={handleDeleteClick}
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  pointerEvents: 'auto',
                  '&:hover': {
                    bgcolor: 'error.main',
                    color: 'white',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Box>

      <Accordion square disableGutters {...accordionProps}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: 48,
            bgcolor: '#e0e0e0',
            borderRadius: 2,
            position: 'relative',
            '&:hover .drag-handle': {
              opacity: 1,
            },
          }}
        >
          {/* Drag Handle Icon - Only this part is draggable */}
          <Box
            className="drag-handle"
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.3,
              transition: 'opacity 0.2s ease',
              cursor: isDragging ? 'grabbing' : 'grab',
              zIndex: 1,
            }}
            {...attributes}
            {...listeners}
          >
            <DragIndicatorIcon fontSize="small" />
          </Box>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1, ml: 4 }}>
            {/* Order Number */}
            <Chip
              label={outline.order || index + 1}
              size="small"
              color="primary"
              sx={{
                minWidth: 32,
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            />

            <CircularDeterminate size={20} thickness={5} color="primary" progress={completionPercentage} />
            <Typography variant="subtitle2" fontWeight={600}>
              {outline.title}
            </Typography>

            {/* Livestream count */}
            <Chip label={`${livestreams.length} buổi`} size="small" variant="outlined" sx={{ ml: 'auto' }} />
          </Stack>
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
                  <Link to={`/courses/${courseSlug}/${item.slug}`} style={{ textDecoration: 'none' }}>
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
    </Box>
  )
}

export default DraggableOutlineItem
