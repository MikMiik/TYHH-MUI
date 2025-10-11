export default function LocalImageLazy({ src, alt, w, h, placeholder, ...props }) {
  // Construct image URL
  let imageSrc = src
  if (src && !src.startsWith('http') && !src.startsWith('/')) {
    const baseURL = import.meta.env.VITE_SERVER_URL
    imageSrc = baseURL ? `${baseURL}/${src}` : `/${src}`
  }

  const handleError = (e) => {
    if (placeholder) {
      e.target.src = placeholder
    }
  }

  return (
    <img
      src={imageSrc || placeholder || '/placeholder-image.svg'}
      alt={alt}
      width={w}
      height={h}
      loading="lazy"
      onError={handleError}
      style={{
        objectFit: 'cover',
        ...props.style,
      }}
      {...props}
    />
  )
}
