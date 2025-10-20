import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Stepper,
  IconButton,
  Tooltip,
  Box,
  Chip,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import CircularDeterminate from './CircularDeterminate'
import DraggableLivestreamItem from './DraggableLivestreamItem'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useReorderLivestreamsMutation } from '@/features/api/livestreamApi'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'

const DraggableOutlineItem = ({
  outline,
  courseSlug,
  index,
  onDeleteOutline,
  onEditOutline,
  onCreateLivestream,
  isDragDisabled = false,
  activeAction = false,
  isEnrolled = false,
  isTeacher = false,
  hasActiveKey = false,
  ...accordionProps
}) => {
  const [reorderedLivestreams, setReorderedLivestreams] = useState(outline.livestreams || [])
  const [reorderLivestreams] = useReorderLivestreamsMutation()

  // Sync with outline changes
  useEffect(() => {
    setReorderedLivestreams(outline.livestreams || [])
  }, [outline.livestreams])

  // Setup sortable functionality for outline
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: outline.id.toString(),
    disabled: isDragDisabled,
  })

  // Setup sensors for livestream drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Tính phần trăm hoàn thành dựa trên số livestream đã xem
  const livestreams = reorderedLivestreams
  const seenCount = livestreams.filter((item) => item.isSeen).length
  const totalCount = livestreams.length
  const completionPercentage = totalCount > 0 ? (seenCount / totalCount) * 100 : 0

  // Handle livestream drag end
  const handleLivestreamDragEnd = async (event) => {
    // Disable drag if drag is disabled
    if (isDragDisabled) {
      return
    }

    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = reorderedLivestreams.findIndex((item) => item.id === active.id)
    const newIndex = reorderedLivestreams.findIndex((item) => item.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newLivestreams = arrayMove(reorderedLivestreams, oldIndex, newIndex)
      setReorderedLivestreams(newLivestreams)

      // Call API to update order
      try {
        const orders = newLivestreams.map((livestream, index) => ({
          id: livestream.id,
          order: index + 1,
        }))

        await reorderLivestreams({
          courseOutlineId: outline.id,
          orders,
        }).unwrap()

        toast.success('Sắp xếp livestream thành công!')
      } catch (error) {
        console.error('Error reordering livestreams:', error)
        // Revert order on error
        setReorderedLivestreams(outline.livestreams || [])
        const errorMessage = error?.data?.message || 'Có lỗi xảy ra khi sắp xếp livestream'
        toast.error(errorMessage)
      }
    }
  }

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
      {activeAction && (
        <Box sx={{ position: 'absolute', right: 40, top: 8, zIndex: 10, pointerEvents: 'auto' }}>
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
      )}

      <Accordion square disableGutters {...accordionProps}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: 48,
            background: (theme) => theme.vars.palette.primary.light,
            borderRadius: 2,
            position: 'relative',
            '&:hover .drag-handle': {
              opacity: 1,
            },
          }}
        >
          {/* Drag Handle Icon - Only this part is draggable */}
          {!isDragDisabled && (
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
          )}

          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1, ml: isDragDisabled ? 1 : 4 }}>
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

        <AccordionDetails sx={{ p: 0, background: (theme) => theme.vars.palette.background.paper }}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLivestreamDragEnd}>
            <SortableContext items={livestreams.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <Stepper
                orientation="vertical"
                nonLinear
                activeStep={-1}
                sx={{ pl: 2, pr: 0, '& .MuiStepConnector-root, & .MuiStepContent-root': { ml: '10px' } }}
              >
                {livestreams.map((item) => (
                  <DraggableLivestreamItem
                    key={item.id}
                    livestream={item}
                    courseSlug={courseSlug}
                    isDragDisabled={isDragDisabled}
                    isEnrolled={isEnrolled}
                    isTeacher={isTeacher}
                    hasActiveKey={hasActiveKey}
                    onDeleteLivestream={(deletedId) => {
                      setReorderedLivestreams((prev) => prev.filter((item) => item.id !== deletedId))
                    }}
                  />
                ))}
              </Stepper>
            </SortableContext>
          </DndContext>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default DraggableOutlineItem
