import { elementInViewport } from 'app/helpers/elementInViewport'
import { formatImageUrl } from 'app/helpers/formatImageUrl'
import React, { ReactElement, useEffect, useRef, useState } from 'react'

export interface IBackgroundProps {
  backgroundImage: string
  hasVideo: boolean
  className?: any
  children?: ReactElement
}

export function Background({
  backgroundImage,
  hasVideo,
  className,
  children,
}: IBackgroundProps) {
  const [loaded, setLoaded] = useState(false)
  const bgRef = useRef(null) as any

  useEffect(() => {
    const handleScroll = () => {
      if (!loaded && bgRef.current && elementInViewport(bgRef.current)) {
        const bgUrl = backgroundImage
        bgRef.current.style.backgroundImage = `url(${bgUrl})`
        setLoaded(true)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [loaded, backgroundImage, hasVideo])

  return (
    <div ref={bgRef} className={`background ${className}`}>
      {children}
    </div>
  )
}
