import { useState } from 'react'
import { Box, Typography, TextField, Button, Paper, Skeleton, Stack, Link, CircularProgress } from '@mui/material'
import CommentItem from './CommentItem'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useCreateCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation } from '@/features/api/commentApi'

const CommentSection = ({
  livestreamId,
  commentsData,
  count,
  loading = false,
  isAuthenticated = false,
  sx,
  ...props
}) => {
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState(commentsData || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentCount, setCommentCount] = useState(count || 0)
  const [createComment] = useCreateCommentMutation()
  const [updateComment] = useUpdateCommentMutation()
  const [deleteComment] = useDeleteCommentMutation()

  const currentUser = useCurrentUser()

  if (loading) {
    return (
      <Box
        component="section"
        sx={{
          mt: 6,
          borderTop: '1px solid',
          borderColor: 'divider',
          pt: 4,
          ...sx,
        }}
        {...props}
      >
        <Typography variant="h5" component="h2" gutterBottom fontWeight={700}>
          Comments
        </Typography>
        <Stack spacing={3}>
          {Array.from({ length: 3 }, (_, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1.5 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    )
  }

  if (!comments && !loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6">Comments not found</Typography>
      </Box>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await createComment({
        userId: currentUser?.id,
        commentableType: 'livestream',
        commentableId: livestreamId,
        content: newComment,
      }).unwrap()
      setComments((prev) => [res, ...prev])
      setCommentCount((prev) => prev + 1)
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReplyComment = async (parentId, content) => {
    const newReply = await createComment({
      userId: currentUser?.id,
      parentId,
      commentableType: 'livestream',
      commentableId: livestreamId,
      content,
    }).unwrap()
    setComments((prev) => [newReply, ...prev])
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ id: commentId })
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
      setCommentCount((prev) => prev - 1)
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  const handleEditComment = async (commentId, newContent) => {
    try {
      await updateComment({
        id: commentId,
        data: { content: newContent, isEdited: true },
      })
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              content: newContent,
              isEdited: true,
            }
          }
          return comment
        })
      )
    } catch (error) {
      console.error('Failed to edit comment:', error)
    }
  }

  const handleLikeComment = async (commentId) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likesCount: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    )
  }

  const rootComments = comments.filter((comment) => comment?.parentId === null)

  return (
    <Box
      component="section"
      sx={{
        mt: 6,
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: 4,
        ...sx,
      }}
      {...props}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" fontWeight={700} color="text.primary">
          Comments ({commentCount})
        </Typography>
      </Box>

      {/* Comment Form */}
      {isAuthenticated ? (
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            mb: 4,
            p: 3,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            variant="outlined"
            required
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused': {
                  boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                },
              },
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ order: { xs: 2, sm: 1 } }}>
              Be respectful and constructive in your comments.
            </Typography>
            <Button
              type="submit"
              variant="contained"
              disabled={!newComment.trim() || isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
              sx={{ order: { xs: 1, sm: 2 }, minWidth: 120 }}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 3,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Please{' '}
            <Link href="/login" color="primary" sx={{ fontWeight: 500 }}>
              sign in
            </Link>{' '}
            to leave a comment.
          </Typography>
        </Paper>
      )}

      {/* Comments List */}
      <Box sx={{ py: 2 }}>
        {rootComments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              💬
            </Typography>
            <Typography variant="h6" color="text.primary" gutterBottom>
              No comments yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Be the first to share your thoughts!
            </Typography>
          </Box>
        ) : (
          <Box>
            {rootComments.map((rootComment) => (
              <CommentItem
                key={rootComment.id}
                livestreamId={livestreamId}
                comment={rootComment}
                allComments={comments}
                onReply={handleReplyComment}
                onDelete={handleDeleteComment}
                onEdit={handleEditComment}
                onLike={handleLikeComment}
                showActions={isAuthenticated}
              />
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CommentSection
