import * as React from 'react'
import LoadingItem from './LoadingItem'

export interface IVideoProps {
  src: string
  videoId?: string
}

export function Video({ src }: IVideoProps) {
  const [loading, setLoading] = React.useState(true)
  const videoRef = React.useRef(null) as any

  React.useEffect(() => {
    videoRef.current.volume = 0
  }, [])

  const handleLoadedData = () => {
    setLoading(false)
    videoRef.current.play()
    videoRef.current.volume = 1
  }

  return (
    <div className="video">
      <LoadingItem loading={loading} className="video__loading" />
      <video
        ref={videoRef}
        onLoadedData={handleLoadedData}
        className={`video__frame ${!loading ? 'video__frame--play' : ''}`}
        src={src}
        loop
      />
    </div>
  )
}
