import { PlayArrowRounded } from '@mui/icons-material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { Background } from './Background'
import { Video } from './Video'

type Props = {
  game: {
    id: number
    name: string
    backgroundImage: string
    clip?: any
  }
}
function MediaItem({ game }: Props) {
  const [hover, setHover] = useState(false)

  const { id, name, backgroundImage, clip } = game

  const hasVideo = !!clip && !!clip.clip
  const showVideo = hasVideo && hover

  const handleMouseEnter = (e: any) => {
    setHover(true)
  }

  const handleMouseLeave = (e: any) => {
    setHover(false)
  }
  return (
    <Box
      sx={{ flex: 1 }}
      bgcolor={'red'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Background backgroundImage={backgroundImage} hasVideo={hasVideo}>
        {hasVideo ? (
          <PlayArrowRounded
            className="icon icon--play"
            style={{ color: '#EEEEEE' }}
          />
        ) : (
          <div></div>
        )}
      </Background>
      {showVideo && <Video src={clip.clip} videoId={clip.video} />}
    </Box>
  )
}

export default React.memo(MediaItem)
