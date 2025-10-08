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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Autocomplete,
} from '@mui/material'
import { useCreateCourseMutation, useEditCourseMutation } from '@/features/api/courseApi'
import { useGetTopicsQuery } from '@/features/api/topicApi'
import ImageUploader from './ImageUploader'

const CreateCourseModal = ({ open, onClose, onCourseCreated, editMode = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    isFree: false,
    status: 'draft',
    purpose: '',
    content: '',
    group: '',
    topicIds: [],
    selectedTopics: [],
    thumbnail: '',
  })

  const [createCourse, { isLoading: isCreating, error: createError }] = useCreateCourseMutation()
  const [editCourse, { isLoading: isEditing, error: editError }] = useEditCourseMutation()
  const { data: topics, isLoading: topicsLoading } = useGetTopicsQuery()

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
        status: initialData.status || 'draft',
        purpose: initialData.purpose || '',
        content: initialData.content || '',
        group: initialData.group || '',
        topicIds: initialData.topics?.map((topic) => topic.id) || [],
        selectedTopics: initialData.topics || [], // Add this to hold actual topic objects
        thumbnail: initialData.thumbnail || '',
      })
    } else if (!editMode) {
      // Reset form when not in edit mode
      setFormData({
        title: '',
        description: '',
        price: '',
        discount: '',
        isFree: false,
        status: 'draft',
        purpose: '',
        content: '',
        group: '',
        topicIds: [],
        selectedTopics: [], // Add this for autocomplete
        thumbnail: '',
      })
    }
  }, [editMode, initialData, open])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTopicsChange = (event, newValue) => {
    const topicIds = newValue.map((topic) => topic.id)
    setFormData((prev) => ({
      ...prev,
      topicIds,
      selectedTopics: newValue, // Store selected topic objects
    }))
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

      if (editMode && initialData) {
        // Edit existing course
        await editCourse({ id: initialData.id, courseData }).unwrap()
      } else {
        // Create new course
        await createCourse(courseData).unwrap()
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        discount: '',
        isFree: false,
        status: 'draft',
        purpose: '',
        content: '',
        group: '',
        topicIds: [],
        selectedTopics: [],
        thumbnail: '',
      })

      onCourseCreated()
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
      status: 'draft',
      purpose: '',
      content: '',
      group: '',
      topicIds: [],
      selectedTopics: [],
      thumbnail: '',
    })
    onClose()
  }
  return (
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
            />

            {/* Purpose */}
            <TextField
              label="Mục đích khóa học"
              variant="outlined"
              fullWidth
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              placeholder="Mục đích và mục tiêu của khóa học..."
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
                />
              </Stack>
            )}

            {/* Status */}
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                label="Trạng thái"
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <MenuItem value="draft">Bản nháp</MenuItem>
                <MenuItem value="published">Xuất bản</MenuItem>
              </Select>
            </FormControl>

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
            />

            {/* Thumbnail Upload */}
            <ImageUploader
              currentImage={formData.thumbnail ? `${import.meta.env.VITE_IK_URL_ENDPOINT}/${formData.thumbnail}` : null}
              onUploadSuccess={(url) => {
                setFormData((prev) => ({
                  ...prev,
                  thumbnail: url,
                }))
              }}
              onUploadError={(error) => {
                console.error('Thumbnail upload error:', error)
              }}
              uploadFolder="course-thumbnails"
              title="Ảnh thumbnail khóa học"
              fileName="course_thumbnail"
            />
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
  )
}

export default CreateCourseModal
