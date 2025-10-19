import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  useTheme,
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useLikeCommentMutation, useUnlikeCommentMutation } from '@/features/api/commentApi'

const CommentItem = ({
  comment,
  allComments = [],
  livestreamId,
  maxLevel = 2,
  level = 0,
  onReply,
  onDelete,
  onEdit,
  onLike,
  showActions = true,
  sx,
  ...props
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [likesCount, setLikesCount] = useState(comment.likesCount)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editText, setEditText] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [likeComment] = useLikeCommentMutation()
  const [unlikeComment] = useUnlikeCommentMutation()
  const currentUser = useCurrentUser()

  const canEdit = currentUser?.id === comment.commenter.id
  const canDelete = currentUser?.id === comment.commenter.id
  const theme = useTheme()

  const { id, commenter, content, isLiked = false, isEdited = false, createdAt, parent } = comment

  const replies = allComments.filter((comment) => comment.parentId === id)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleReplySubmit = async (e) => {
    e.preventDefault()
    if (replyText.trim() && onReply) {
      onReply(id, replyText.trim())
      setReplyText('')
      setShowReplyForm(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (editText.trim() && onEdit && canEdit) {
      await onEdit(id, editText)
      setEditText('')
      setShowEditForm(false)
    }
  }

  const handleLike = async () => {
    if (onLike && isLiked) {
      await unlikeComment(id)
      setLikesCount((prev) => (prev -= 1))
      onLike(id)
    }
    if (onLike && !isLiked) {
      await likeComment(id)
      setLikesCount((prev) => (prev += 1))
      onLike(id)
    }
  }

  const handleEdit = () => {
    setEditText(content)
    setShowEditForm(true)
    setAnchorEl(null)
  }

  const handleEditCancel = () => {
    setEditText('')
    setShowEditForm(false)
  }

  const handleDeleteConfirm = async () => {
    if (onDelete && canDelete) {
      await onDelete(id)
    }
    setDeleteDialogOpen(false)
    setAnchorEl(null)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box
      id={`comment-${id}`}
      sx={{
        mb: 2,
        ml: level > 0 && level < maxLevel ? level * 6 : 0,
        '&:last-child': { mb: 0 },
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {/* Avatar */}
        <Avatar
          src={`${import.meta.env.VITE_SERVER_URL}${commenter.avatar}`}
          alt={commenter.name}
          sx={{
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
            flexShrink: 0,
          }}
        >
          {commenter.name?.charAt(0)?.toUpperCase()}
        </Avatar>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', flex: 1 }}>
              <Typography variant="body2" fontWeight={600} color="primary">
                {commenter?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(createdAt)}
              </Typography>
              {isEdited && (
                <Typography variant="caption" color="text.secondary" fontStyle="italic">
                  (edited)
                </Typography>
              )}
            </Box>

            {/* Actions Menu */}
            {showActions && (canEdit || canDelete) && (
              <>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 8,
                    sx: {
                      mt: 1,
                      minWidth: 140,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1,
                        fontSize: '0.875rem',
                        gap: 1,
                      },
                    },
                  }}
                >
                  {canEdit && (
                    <MenuItem onClick={handleEdit}>
                      <EditIcon fontSize="small" />
                      Edit
                    </MenuItem>
                  )}
                  {canDelete && (
                    <MenuItem onClick={() => setDeleteDialogOpen(true)} sx={{ color: 'error.main' }}>
                      <DeleteIcon fontSize="small" />
                      Delete
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </Box>

          {/* Comment Text */}
          <Box sx={{ mb: 1.5 }}>
            {parent?.commenter?.name ? (
              <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.625, wordWrap: 'break-word' }}>
                <Typography
                  component="span"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    mr: 0.5,
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={() => {
                    const parentElement = document.getElementById(`comment-${parent.id}`)
                    if (parentElement) {
                      parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      parentElement.style.backgroundColor = theme.palette.comment.highlight
                      setTimeout(() => {
                        parentElement.style.backgroundColor = ''
                      }, 2000)
                    }
                  }}
                >
                  @{parent.commenter.name}
                </Typography>
                {content}
              </Typography>
            ) : typeof content === 'string' ? (
              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  lineHeight: 1.625,
                  wordWrap: 'break-word',
                  '& a': { color: 'primary.main' },
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.625 }}>
                {content}
              </Typography>
            )}
          </Box>

          {/* Actions */}
          {showActions && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Button
                size="small"
                startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={handleLike}
                sx={{
                  minWidth: 'auto',
                  color: isLiked ? 'error.main' : 'text.secondary',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  px: 1,
                  py: 0.5,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                {likesCount >= 0 && likesCount}
              </Button>

              <Button
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => setShowReplyForm(!showReplyForm)}
                sx={{
                  minWidth: 'auto',
                  color: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  px: 1,
                  py: 0.5,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                Reply
              </Button>
            </Box>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <Box
              component="form"
              onSubmit={handleReplySubmit}
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                variant="outlined"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  },
                }}
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setShowReplyForm(false)
                    setReplyText('')
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" size="small" type="submit" disabled={!replyText.trim()}>
                  Reply
                </Button>
              </Stack>
            </Box>
          )}

          {/* Edit Form */}
          {showEditForm && (
            <Box
              component="form"
              onSubmit={handleEditSubmit}
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.light',
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={3}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit your comment..."
                variant="outlined"
                autoFocus
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  },
                }}
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button variant="outlined" size="small" onClick={handleEditCancel}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  type="submit"
                  disabled={!editText.trim() || editText.trim() === content}
                >
                  Save Changes
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this comment? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Replies */}
      {replies.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              allComments={allComments}
              livestreamId={livestreamId}
              level={level + 1}
              maxLevel={maxLevel}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              showActions={showActions}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default CommentItem
