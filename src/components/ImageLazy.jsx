import { Image } from '@imagekit/react'
import { useState, useCallback } from 'react'
export default function ImageLazy({ src, alt, w, h, placeholder }) {
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [hasError, setHasError] = useState(false)

  const hidePlaceholder = () => setShowPlaceholder(false)
  const handleError = () => {
    setHasError(true)
    setShowPlaceholder(false)
  }

  const imgRef = useCallback((img) => {
    if (!img) return // unmount

    if (img.complete) {
      hidePlaceholder()
      return
    }
  }, [])

  // If image has error, show placeholder from public folder
  if (hasError) {
    return (
      <img
        src={placeholder || '/placeholder-image.svg'}
        alt={alt}
        style={{
          width: w,
          height: h,
          objectFit: 'cover',
        }}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      loading="lazy"
      ref={imgRef}
      onError={handleError}
      style={
        showPlaceholder
          ? {
              backgroundImage: `url(${placeholder || '/placeholder-document.svg'})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              objectFit: 'cover',
            }
          : { objectFit: 'cover' }
      }
    />
  )
}
