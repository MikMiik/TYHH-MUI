import { useState } from 'react'
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
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { useGetTopicsQuery } from '@/features/api/topicApi'

const CreateCourseModal = ({ open, onClose, onCourseCreated }) => {
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
  })

  const [createCourse, { isLoading, error }] = useCreateCourseMutation()
  const { data: topics, isLoading: topicsLoading } = useGetTopicsQuery()

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

      await createCourse(courseData).unwrap()

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
      })

      onCourseCreated()
    } catch (err) {
      console.error('Error creating course:', err)
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
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Tạo khóa học mới
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Điền thông tin cơ bản để tạo khóa học của bạn
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {error && <Alert severity="error">{error?.data?.message || 'Có lỗi xảy ra khi tạo khóa học'}</Alert>}

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
              options={topics}
              getOptionLabel={(option) => option.title}
              loading={topicsLoading}
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
            {isLoading ? 'Đang tạo...' : 'Tạo khóa học'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateCourseModal
