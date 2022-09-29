import { Box } from '@mui/system'
import * as React from 'react'
import LoadingItem from './LoadingItem'

export interface IVideoProps {
  src: string
  videoId?: number
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
    <Box
      bgcolor="black"
      sx={{
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
      }}
    >
      <LoadingItem loading={loading} className="video__loading" />
      <video
        ref={videoRef}
        onLoadedData={handleLoadedData}
        // className={`video__frame ${!loading ? 'video__frame--play' : ''}`}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        src={src}
        loop
      />
    </Box>
  )
}
