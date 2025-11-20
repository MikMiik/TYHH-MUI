import { useState } from 'react'
import {
  Step,
  StepLabel,
  StepContent,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  EditDocument as EditDocumentIcon,
  RemoveRedEyeRounded as RemoveRedEyeRoundedIcon,
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import GreenCircleStepIcon from './GreenCircleStepIcon'
import EditLivestreamModal from './EditLivestreamModal'
import { useDeleteLivestreamMutation } from '@/features/api/livestreamApi'
import { toast } from 'react-toastify'

const DraggableLivestreamItem = ({ 
  livestream, 
  courseSlug, 
  onDeleteLivestream, 
  isDragDisabled = false,
  isEnrolled = false,
  isTeacher = false,
  hasActiveKey = false
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLivestream, { isLoading: isDeleting }] = useDeleteLivestreamMutation()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: livestream.id,
    disabled: isDragDisabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleEditClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setEditModalOpen(true)
  }

  const handleDeleteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteLivestream(livestream.id).unwrap()
      toast.success('Xóa livestream thành công!')
      setDeleteDialogOpen(false)
      onDeleteLivestream?.(livestream.id)
    } catch (error) {
      console.error('Error deleting livestream:', error)
      const errorMessage = error?.data?.message || 'Có lỗi xảy ra khi xóa livestream'
      toast.error(errorMessage)
    }
  }

  const handleLivestreamClick = (e) => {
    // Allow access if user is enrolled, is a teacher, or has activeKey
    if (!isEnrolled && !isTeacher && !hasActiveKey) {
      e.preventDefault()
      e.stopPropagation()
      toast.warning('Vui lòng đăng ký khóa học để xem livestream này')
    }
  }

  return (
    <>
      <Step
        key={livestream.id}
        expanded
        ref={setNodeRef}
        style={style}
        sx={{
          position: 'relative',
          '&:hover .livestream-actions': {
            opacity: 1,
          },
        }}
      >
        <StepLabel
          slots={{
            stepIcon: (props) => <GreenCircleStepIcon isSeen={livestream.isSeen} {...props} />,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            {/* Drag Handle */}
            {!isDragDisabled && (
              <Box
                className="drag-handle"
                sx={{
                  opacity: 0.3,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  transition: 'opacity 0.2s ease',
                  '&:hover': { opacity: 1 },
                }}
                {...attributes}
                {...listeners}
              >
                <DragIndicatorIcon fontSize="small" />
              </Box>
            )}

            {/* Livestream Title */}
            <Link 
              to={`/courses/${courseSlug}/${livestream.slug}`} 
              style={{ textDecoration: 'none', flex: 1 }}
              onClick={handleLivestreamClick}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="primary.main"
                sx={{
                  cursor: 'pointer',
                  ':hover': { textDecoration: 'underline' },
                  flex: 1,
                }}
              >
                {livestream.title}
              </Typography>
            </Link>

            {/* Action Buttons */}
          {isTeacher &&(<Stack
            direction="row"
            spacing={0.5}
            className="livestream-actions"
            sx={{
              opacity: 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <Tooltip title="Chỉnh sửa livestream">
              <IconButton
                size="small"
                onClick={handleEditClick}
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xóa livestream">
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
          </Stack>)}
          </Box>
        </StepLabel>

        <StepContent>
          <Stack direction="row" alignItems="center" spacing={1}>
            {Array.isArray(livestream.documents) && livestream.documents.length > 0 ? (
              <Link
                to={`/documents/${livestream.documents[0].slug}`}
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <EditDocumentIcon
                  sx={{
                    color: (theme) => theme.palette.icon.light,
                    ':hover': { color: (theme) => theme.palette.icon.main },
                  }}
                  fontSize="smaller"
                />
              </Link>
            ) : (
              <EditDocumentIcon
                sx={{
                  color: (theme) => theme.palette.icon.light,
                  ':hover': { color: (theme) => theme.palette.icon.main },
                }}
                fontSize="smaller"
              />
            )}
            <Typography fontSize={14} color={(theme) => theme.palette.text.secondary}>
              {Array.isArray(livestream.documents) ? livestream.documents.length : 0}
            </Typography>

            <RemoveRedEyeRoundedIcon
              sx={{
                color: (theme) => theme.palette.icon.light,
                ':hover': { color: (theme) => theme.palette.icon.main },
              }}
              fontSize="smaller"
            />
            <Typography fontSize={14} color={(theme) => theme.palette.text.secondary}>
              {livestream.view || 0}
            </Typography>
          </Stack>
        </StepContent>
      </Step>

      {/* Edit Modal */}
      <EditLivestreamModal open={editModalOpen} onClose={() => setEditModalOpen(false)} livestream={livestream} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa livestream "{livestream.title}"? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={isDeleting}>
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DraggableLivestreamItem
