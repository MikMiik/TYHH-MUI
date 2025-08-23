import { Image, buildSrc } from '@imagekit/react'
import { useState, useCallback } from 'react'
export default function ImageLazy({ src, className, alt, w, h }) {
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  const hidePlaceholder = () => setShowPlaceholder(false)

  const imgRef = useCallback((img) => {
    if (!img) return // unmount

    if (img.complete) {
      hidePlaceholder()
      return
    }
  }, [])

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
      className={className}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      loading="lazy"
      ref={imgRef}
      style={
        showPlaceholder
          ? {
              backgroundImage: `url(${buildSrc({
                urlEndpoint: import.meta.env.VITE_IK_URL_ENDPOINT,
                src: '/placeholder.svg',
                transformation: [
                  // {}, // Any other transformation you want to apply to the placeholder image
                  {
                    quality: 10,
                    blur: 50,
                  },
                ],
              })})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }
          : {}
      }
    />
  )
}
