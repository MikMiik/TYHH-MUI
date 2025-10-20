import { useState } from 'react'
import PropTypes from 'prop-types'
import httpRequest from '@/utils/httpRequest'

const LocalUploader = ({ children, onUploadSuccess, onUploadError }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const uploadFile = async (file, options = {}) => {
    if (!file) {
      setError('No file provided')
      return null
    }

    // Validate file size (default 4GB for videos, can be overridden in options)
    const maxSize = options.maxSize || 4 * 1024 * 1024 * 1024 // 4GB default for videos
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
