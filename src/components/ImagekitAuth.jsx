import { upload } from '@imagekit/react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import httpRequest from '@/utils/httpRequest'

/**
 * ImageKitUploader - Generic wrapper component for ImageKit file uploads
 * Provides upload functionality to children components via render prop pattern
 *
 * Props:
 * - children: Function that receives upload utilities { uploadFile, isUploading, progress, error, resetError }
 * - onUploadSuccess: Callback when upload succeeds, receives uploadResponse
 * - onUploadError: Callback when upload fails, receives error
 *
 * Usage:
 * <ImageKitUploader
 *   onUploadSuccess={(response) => console.log('Success:', response)}
 *   onUploadError={(error) => console.log('Error:', error)}
 * >
 *   {({ uploadFile, isUploading, progress, error, resetError }) => (
 *     <YourUploadUI onUpload={uploadFile} loading={isUploading} />
 *   )}
 * </ImageKitUploader>
 */
const ImageKitUploader = ({ children, onUploadSuccess, onUploadError }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const authenticator = async () => {
    try {
      // Call your backend authentication endpoint using axios
      const response = await httpRequest.get('/imagekit/auth')
      const { signature, expire, token, publicKey } = response.data
      return { signature, expire, token, publicKey }
    } catch (error) {
      console.error('ImageKit authentication error:', error)
      throw new Error('Failed to authenticate with ImageKit')
    }
  }

  const uploadFile = async (file, options = {}) => {
    if (!file) {
      setError('No file provided')
      return null
    }

    // Validate file size (default 10MB, can be overridden in options)
    const maxSize = options.maxSize || 10 * 1024 * 1024 // 10MB default
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
      // Get authentication credentials
      const authParams = await authenticator()

      const uploadResponse = await upload({
        ...authParams,
        file,
        fileName: options.fileName || file.name,
        folder: options.folder || '/uploads', // Generic default folder
        tags: options.tags || ['upload'], // Generic default tags
        onProgress: (event) => {
          const progressValue = (event.loaded / event.total) * 100
          setProgress(progressValue)
        },
      })

      setIsUploading(false)
      onUploadSuccess?.(uploadResponse)
      return uploadResponse
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

export default ImageKitUploader

// PropTypes for better development experience
ImageKitUploader.propTypes = {
  children: PropTypes.func.isRequired,
  onUploadSuccess: PropTypes.func,
  onUploadError: PropTypes.func,
}
