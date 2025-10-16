import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LocalUploader from './LocalUploader'
import LocalImageUploader from './LocalImageUploader'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useCreateDocumentMutation } from '@/features/api/documentApi'

const DocumentUploadModal = ({ open, onClose, livestream, onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    vip: false,
    url: '',
    slidenote: '',
    thumbnail: '',
  })

  const [createDocument, { isLoading }] = useCreateDocumentMutation()

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileUploadSuccess = (response, field) => {
    handleInputChange(field, response.filePath)
    toast.success(`Upload ${field} thành công!`)
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tên tài liệu')
      return
    }

    if (!formData.url) {
      toast.error('Vui lòng upload file PDF')
      return
    }

    try {
      const documentData = {
        ...formData,
        livestreamId: livestream?.id,
      }

      const result = await createDocument(documentData).unwrap()
      toast.success('Tạo tài liệu thành công!')
      onUploadSuccess?.(result)
      onClose()

      // Reset form
      setFormData({
        title: '',
        vip: false,
        url: '',
        slidenote: '',
        thumbnail: '',
      })
    } catch (error) {
      console.error('Error creating document:', error)
      toast.error('Lỗi tạo tài liệu: ' + (error?.data?.message || error.message))
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Tạo Tài Liệu Mới</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Tên tài liệu */}
          <TextField
            label="Tên tài liệu *"
            fullWidth
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />

          {/* VIP checkbox */}
          <FormControlLabel
            control={<Checkbox checked={formData.vip} onChange={(e) => handleInputChange('vip', e.target.checked)} />}
            label="Tài liệu VIP (chỉ học viên trả phí)"
          />

          {/* Upload file PDF */}
          <Box>
            <Typography variant="subtitle2" mb={1}>
              File PDF *
            </Typography>
            <LocalUploader
              onUploadSuccess={(response) => handleFileUploadSuccess(response, 'url')}
              onUploadError={(error) => toast.error(`Lỗi upload PDF: ${error.message}`)}
            >
              {({ uploadFile, isUploading, progress, error }) => (
                <Box>
                  <Box
                    sx={{
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: formData.url ? 'success.light' : 'transparent',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                    component="label"
                  >
                    <Typography variant="body1" mb={1}>
                      {isUploading
                        ? `Đang upload... ${Math.round(progress)}%`
                        : formData.url
                        ? '✓ File PDF đã upload'
                        : 'Chọn file PDF'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hỗ trợ file PDF, tối đa 50MB
                    </Typography>
                    <input
                      type="file"
                      accept=".pdf"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (file.type !== 'application/pdf') {
                            toast.error('Chỉ hỗ trợ file PDF')
                            return
                          }
                          if (file.size > 50 * 1024 * 1024) {
                            toast.error('File không được vượt quá 50MB')
                            return
                          }
                          uploadFile(file, {
                            fileName: `${livestream?.slug || 'document'}-${Date.now()}.pdf`,
                          })
                        }
                      }}
                    />
                  </Box>
                  {error && (
                    <Typography color="error" variant="body2" mt={1}>
                      {error}
                    </Typography>
                  )}
                </Box>
              )}
            </LocalUploader>
          </Box>

          {/* Upload Slidenote (optional) */}
          <Box>
            <Typography variant="subtitle2" mb={1}>
              Slidenote (tùy chọn)
            </Typography>
            <LocalUploader
              onUploadSuccess={(response) => handleFileUploadSuccess(response, 'slidenote')}
              onUploadError={(error) => toast.error(`Lỗi upload slidenote: ${error.message}`)}
            >
              {({ uploadFile, isUploading, progress, error }) => (
                <Box>
                  <Box
                    sx={{
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: formData.slidenote ? 'success.light' : 'transparent',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                    component="label"
                  >
                    <Typography variant="body2" mb={1}>
                      {isUploading
                        ? `Đang upload... ${Math.round(progress)}%`
                        : formData.slidenote
                        ? '✓ Slidenote đã upload'
                        : 'Chọn file slidenote (PDF)'}
                    </Typography>
                    <input
                      type="file"
                      accept=".pdf"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          uploadFile(file, {
                            fileName: `${livestream?.slug || 'document'}-slidenote-${Date.now()}.pdf`,
                          })
                        }
                      }}
                    />
                  </Box>
                  {error && (
                    <Typography color="error" variant="body2" mt={1}>
                      {error}
                    </Typography>
                  )}
                </Box>
              )}
            </LocalUploader>
          </Box>

          {/* Upload Thumbnail (optional) */}
          <Box>
            <Typography variant="subtitle2" mb={1}>
              Thumbnail (tùy chọn)
            </Typography>
            <LocalImageUploader
              onUploadSuccess={(response) => handleFileUploadSuccess(response, 'thumbnail')}
              currentImage={formData.thumbnail}
              placeholder="Chọn ảnh thumbnail cho tài liệu"
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading || !formData.title.trim() || !formData.url}
        >
          {isLoading ? 'Đang tạo...' : 'Tạo tài liệu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DocumentUploadModal
