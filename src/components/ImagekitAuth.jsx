import { upload } from '@imagekit/react'
import { useState } from 'react'
import httpRequest from '@/utils/httpRequest'
import { useCurrentUser } from '@/utils/useCurrentUser'

/**
 * ImageKitUploader - Context/wrapper component for ImageKit file uploads
 * Provides upload functionality to children components via render prop pattern
 *
 * Usage:
 * <ImageKitUploader>
 *   {({ uploadFile, isUploading, progress, error }) => (
 *     <YourUploadUI onUpload={uploadFile} loading={isUploading} />
 *   )}
 * </ImageKitUploader>
 */
const ImageKitUploader = ({ children, onUploadSuccess, onUploadError }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const currentUser = useCurrentUser()
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
        folder: options.folder || '/avatars', // Default folder for avatars
        tags: options.tags || ['avatar'],
        onProgress: (event) => {
          const progressValue = (event.loaded / event.total) * 100
          setProgress(progressValue)
        },
      })

      setIsUploading(false)
      // Nếu có userId và muốn cập nhật DB, gọi API ở đây
      if (uploadResponse?.url) {
        console.log(uploadResponse)

        try {
          await httpRequest.post(`/users/${currentUser.id}/upload-avatar`, { avatar: uploadResponse.filePath })
        } catch (err) {
          // Không chặn UI, chỉ log lỗi nếu update DB thất bại
          console.error('Update avatar in DB failed:', err)
        }
      }
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
