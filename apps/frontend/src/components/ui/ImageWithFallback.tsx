import { useEffect, useState } from 'react'

type ImageWithFallbackProps = {
  src?: string
  alt: string
  className?: string
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'className' | 'onError'>

/**
 * Product/category thumbnail with a graceful fallback: seed data hotlinks
 * straight to images.unsplash.com, whose CDN intermittently returns 503 —
 * on load failure (or a missing src) this renders the item's first letter
 * on a brand-colored box sized like the original image instead of a broken
 * image icon or an extra static placeholder asset.
 */
const ImageWithFallback = ({ src, alt, className, ...imgProps }: ImageWithFallbackProps) => {
  const [errored, setErrored] = useState(false)

  // A single mounted <img> can be reused across different src values (e.g. the
  // active-image slot in a gallery) — clear a stale error flag whenever src changes
  // so switching to a working image doesn't keep showing the fallback.
  useEffect(() => {
    setErrored(false)
  }, [src])

  if (!src || errored) {
    const initial = alt.trim().charAt(0).toUpperCase() || '?'
    return (
      <div
        className={`flex items-center justify-center bg-primary-subtle text-primary font-semibold select-none ${className ?? ''}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-2xl">{initial}</span>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setErrored(true)} {...imgProps} />
}

export default ImageWithFallback
