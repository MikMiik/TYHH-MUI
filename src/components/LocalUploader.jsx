import { useState } from 'react'
import PropTypes from 'prop-types'
import httpRequest from '@/utils/httpRequest'

/**
 * LocalUploader - Generic wrapper component for local file uploads
 * Provides upload functionality to children components via render prop pattern
 *
 * Props:
 * - children: Function that receives upload utilities { uploadFile, isUploading, progress, error, resetError }
 * - onUploadSuccess: Callback when upload succeeds, receives uploadResponse
 * - onUploadError: Callback when upload fails, receives error
 *
 * Usage:
 * <LocalUploader
 *   onUploadSuccess={(response) => console.log('Success:', response)}
 *   onUploadError={(error) => console.log('Error:', error)}
 * >
 *   {({ uploadFile, isUploading, progress, error, resetError }) => (
 *     <YourUploadUI onUpload={uploadFile} loading={isUploading} />
 *   )}
 * </LocalUploader>
 */
const LocalUploader = ({ children, onUploadSuccess, onUploadError }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const uploadFile = async (file, options = {}) => {
    if (!file) {
      setError('No file provided')
      return null
    }

    // Validate file size (default 500MB for videos, can be overridden in options)
    const maxSize = options.maxSize || 500 * 1024 * 1024 // 500MB default for videos
    if (file.size > maxSize) {
      const errorMsg = `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      setError(errorMsg)
      onUploadError?.(new Error(errorMsg))
      return null
    }

    setIsUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // Add fileName if provided
      if (options.fileName) formData.append('fileName', options.fileName)

      // Upload to local backend
      const uploadResponse = await httpRequest.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progressValue = (progressEvent.loaded / progressEvent.total) * 100
          setProgress(progressValue)
        },
      })

      setIsUploading(false)

      // Transform response to match ImageKit format
      const transformedResponse = {
        url: uploadResponse.data.url,
        filePath: uploadResponse.data.filePath, // Use the correct filePath from backend
        fileId: Date.now().toString(),
        name: options.fileName || file.name,
        size: file.size,
        fileType: file.type,
      }

      onUploadSuccess?.(transformedResponse)
      return transformedResponse
    } catch (uploadError) {
      console.error('Upload error:', uploadError)
      setError(uploadError.message || 'Upload failed')
      setIsUploading(false)
      onUploadError?.(uploadError)
      return null
    }
  }

  // Render prop pattern - pass upload utilities to children
  return children({
    uploadFile,
    isUploading,
    progress,
    error,
    resetError: () => setError(null),
  })
}

export default LocalUploader

// PropTypes for better development experience
LocalUploader.propTypes = {
  children: PropTypes.func.isRequired,
  onUploadSuccess: PropTypes.func,
  onUploadError: PropTypes.func,
}
