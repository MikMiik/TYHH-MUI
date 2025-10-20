import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Autocomplete,
} from '@mui/material'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import { useCreateCourseMutation, useEditCourseMutation } from '@/features/api/courseApi'
import { useGetTopicsQuery } from '@/features/api/topicApi'
import LocalImageUploader from './LocalImageUploader'
import IntroVideoUploadModal from './IntroVideoUploadModal'
import courseSchema from '@/schemas/courseSchema'
import VideoComp from './VideoComp'

const CreateCourseModal = ({ open, onClose, onCourseCreated, editMode = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    isFree: false,
    purpose: '',
    content: '',
    group: '',
    topicIds: [],
    selectedTopics: [],
    thumbnail: '',
    introVideo: '',
  })

  const [createCourse, { isLoading: isCreating, error: createError }] = useCreateCourseMutation()
  const [editCourse, { isLoading: isEditing, error: editError }] = useEditCourseMutation()
  const { data: topics, isLoading: topicsLoading } = useGetTopicsQuery()

  // Validation state
  const [validationErrors, setValidationErrors] = useState({})
  const [introVideoModal, setIntroVideoModal] = useState(false)

  const isLoading = isCreating || isEditing
  const error = createError || editError

  // Initialize form data when in edit mode or when modal opens
  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        discount: initialData.discount?.toString() || '',
        isFree: initialData.isFree || false,
        purpose: initialData.purpose || '',
        content: initialData.content || '',
        group: initialData.group || '',
        topicIds: initialData.topics?.map((topic) => topic.id) || [],
        selectedTopics: initialData.topics || [], // Add this to hold actual topic objects
        thumbnail: initialData.thumbnail || '',
        introVideo: initialData.introVideo || '',
      })
    } else if (!editMode) {
      // Reset form when not in edit mode
      setFormData({
        title: '',
        description: '',
        price: '',
        discount: '',
        isFree: false,
        purpose: '',
        content: '',
        group: '',
        topicIds: [],
        selectedTopics: [], // Add this for autocomplete
        thumbnail: '',
        introVideo: '',
      })
    }
  }, [editMode, initialData, open])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: null,
      }))
    }
  }

  const handleVideoUpload = (response) => {
    setFormData((prev) => ({
      ...prev,
      introVideo: response.filePath, // Sử dụng filePath thay vì videoUrl
    }))
    setIntroVideoModal(false)
  }

  const handleTopicsChange = (event, newValue) => {
    const topicIds = newValue.map((topic) => topic.id)
    setFormData((prev) => ({
      ...prev,
      topicIds,
      selectedTopics: newValue, // Store selected topic objects
    }))

    // Clear validation error for topicIds
    if (validationErrors.topicIds) {
      setValidationErrors((prev) => ({
        ...prev,
        topicIds: null,
      }))
    }
  }

  // Validate form data
  const validateForm = async (data) => {
    try {
      await courseSchema.validate(data, { abortEarly: false })
      setValidationErrors({})
      return true
    } catch (err) {
      const errors = {}
      err.inner.forEach((error) => {
        errors[error.path] = error.message
      })
      setValidationErrors(errors)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Convert price and discount to numbers
      const courseData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
      }

      // Validate form data
      const isValid = await validateForm(courseData)
      if (!isValid) {
        return // Stop if validation fails
      }

      if (editMode && initialData) {
        // Edit existing course
        const updatedCourse = await editCourse({ id: initialData.id, courseData }).unwrap()
        onCourseCreated(updatedCourse)
      } else {
        // Create new course
        const newCourse = await createCourse(courseData).unwrap()

        // Reset form only for create mode
        setFormData({
          title: '',
          description: '',
          price: '',
          discount: '',
          isFree: false,
          purpose: '',
          content: '',
          group: '',
          topicIds: [],
          selectedTopics: [],
          thumbnail: '',
          introVideo: '',
        })

        onCourseCreated(newCourse)
      }
    } catch (err) {
      console.error('Error saving course:', err)
    }
  }

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      title: '',
      description: '',
      price: '',
      discount: '',
      isFree: false,
      purpose: '',
      content: '',
      group: '',
      topicIds: [],
      selectedTopics: [],
      thumbnail: '',
      introVideo: '',
    })
    onClose()
  }
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" component="span" fontWeight={700} color="primary.main">
            {editMode ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            {editMode ? 'Cập nhật thông tin khóa học của bạn' : 'Điền thông tin cơ bản để tạo khóa học của bạn'}
          </Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {error && (
                <Alert severity="error">
                  {error?.data?.message ||
                    (editMode ? 'Có lỗi xảy ra khi cập nhật khóa học' : 'Có lỗi xảy ra khi tạo khóa học')}
                </Alert>
              )}

              {/* Title */}
              <TextField
                label="Tên khóa học"
                variant="outlined"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Nhập tên khóa học..."
                error={!!validationErrors.title}
                helperText={validationErrors.title}
              />

              {/* Description */}
              <TextField
                label="Mô tả"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Mô tả chi tiết về khóa học..."
                error={!!validationErrors.description}
                helperText={validationErrors.description}
              />

              {/* Purpose */}
              <TextField
                label="Mục đích khóa học"
                variant="outlined"
                fullWidth
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                placeholder="Mục đích và mục tiêu của khóa học..."
                error={!!validationErrors.purpose}
                helperText={validationErrors.purpose}
              />

              {/* Topics */}
              <Autocomplete
                multiple
                options={topics || []}
                getOptionLabel={(option) => option.title}
                loading={topicsLoading}
                value={formData.selectedTopics || []}
                onChange={handleTopicsChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option.title} {...getTagProps({ index })} key={option.id} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn chủ đề"
                    placeholder="Tìm và chọn chủ đề..."
                    error={!!validationErrors.topicIds}
                    helperText={validationErrors.topicIds}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {topicsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              {/* Group */}
              <TextField
                label="Nhóm khóa học"
                variant="outlined"
                fullWidth
                value={formData.group}
                onChange={(e) => handleInputChange('group', e.target.value)}
                placeholder="Nhóm hoặc danh mục..."
                error={!!validationErrors.group}
                helperText={validationErrors.group}
              />

              {/* Free Switch */}
              <FormControlLabel
                control={
                  <Switch checked={formData.isFree} onChange={(e) => handleInputChange('isFree', e.target.checked)} />
                }
                label="Khóa học miễn phí"
              />

              {/* Price and Discount */}
              {!formData.isFree && (
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Giá gốc (VNĐ)"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0"
                    inputProps={{ min: 0 }}
                    error={!!validationErrors.price}
                    helperText={validationErrors.price}
                  />
                  <TextField
                    label="Giảm giá (VNĐ)"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={formData.discount}
                    onChange={(e) => handleInputChange('discount', e.target.value)}
                    placeholder="0"
                    inputProps={{ min: 0 }}
                    error={!!validationErrors.discount}
                    helperText={validationErrors.discount}
                  />
                </Stack>
              )}

              {/* Content */}
              <TextField
                label="Nội dung chi tiết"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Nội dung chi tiết về khóa học..."
                error={!!validationErrors.content}
                helperText={validationErrors.content}
              />

              {/* Thumbnail Upload */}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Ảnh thumbnail khóa học
                </Typography>
                <LocalImageUploader
                  height={300}
                  currentImage={formData.thumbnail ? `${import.meta.env.VITE_SERVER_URL}/${formData.thumbnail}` : null}
                  onUploadSuccess={(response) => {
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail: response.filePath,
                    }))
                    // Clear thumbnail error if upload succeeds
                    if (validationErrors.thumbnail) {
                      setValidationErrors((prev) => ({ ...prev, thumbnail: null }))
                    }
                  }}
                  onUploadError={(error) => {
                    console.error('Thumbnail upload error:', error)
                  }}
                  title="Ảnh thumbnail khóa học"
                  fileName="course_thumbnail"
                />
                {validationErrors.thumbnail && (
                  <Box sx={{ mt: 0.5, fontSize: '0.75rem', color: 'error.main' }}>{validationErrors.thumbnail}</Box>
                )}
              </Box>

              {/* Intro Video Upload */}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Video giới thiệu khóa học
                </Typography>

                {formData.introVideo ? (
                  <Box sx={{ mb: 2 }}>
                    <VideoComp src={formData.introVideo} />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      border: '2px dashed #e0e0e0',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      mb: 2,
                      backgroundColor: (theme) => theme.palette.background.light,
                      height: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <VideoCallIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Chưa có video giới thiệu
                    </Typography>
                  </Box>
                )}

                <Button
                  variant="outlined"
                  startIcon={<VideoCallIcon />}
                  onClick={() => setIntroVideoModal(true)}
                  disabled={isLoading}
                  fullWidth
                >
                  {formData.introVideo ? 'Thay đổi video' : 'Upload video giới thiệu'}
                </Button>

                {validationErrors.introVideo && (
                  <Box sx={{ mt: 0.5, fontSize: '0.75rem', color: 'error.main' }}>{validationErrors.introVideo}</Box>
                )}
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleClose} disabled={isLoading} variant="outlined">
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !formData.title.trim()}
              startIcon={isLoading && <CircularProgress size={20} />}
            >
              {isLoading
                ? editMode
                  ? 'Đang cập nhật...'
                  : 'Đang tạo...'
                : editMode
                ? 'Cập nhật khóa học'
                : 'Tạo khóa học'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Intro Video Upload Modal */}
      <IntroVideoUploadModal
        open={introVideoModal}
        onClose={() => setIntroVideoModal(false)}
        onUploadSuccess={handleVideoUpload}
        course={editMode ? initialData : null}
      />
    </>
  )
}

export default CreateCourseModal
