import { PlayArrowRounded } from '@mui/icons-material'
import { Box, BoxProps, minWidth } from '@mui/system'
import { IMediaOverall } from 'app/models'
import * as React from 'react'
import { MediaPlayer } from './MediaPlayer'

export interface IMediaViewItemProps extends BoxProps {
  media: IMediaOverall
  orientation?: 'vertical' | 'horizontal'
}

export function MediaViewItem({
  media,
  orientation = 'horizontal',
  ...props
}: IMediaViewItemProps) {
  const [hover, setHover] = React.useState(false)
  const { mediaFormat, url, detail } = media
  const hasVideo = mediaFormat === 1 && !!url
  const showVideo = hasVideo && hover

  const handleMouseEnter = (e: any) => {
    setHover(true)
  }

  const handleMouseLeave = (e: any) => {
    setHover(false)
  }

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: 'relative',
        background: '#eee center no-repeat',
        backgroundSize: 'cover',
        cursor: 'pointer',
        borderRadius: '12px',
        overflow: 'hidden',
        aspectRatio:
          orientation === 'horizontal' ? 'auto 16 / 9' : 'auto 9 / 16', // 56.25% <=> 1280 x 720
        boxShadow: 'rgb(0 0 0 / 24%) 0px 0.25rem 1.25rem',
      }}
      {...props}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '0',
          top: '0',
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          bgcolor="black"
          sx={{
            overflow: 'hidden',
            position: 'relative',
            backgroundSize: 'cover',
            // borderRadius: '8px',
            // aspectRatio: 'auto 56 / 100',
            width: '100%',
            height: '100%',
          }}
        >
          <img
            src={detail?.coverImgUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: orientation === 'horizontal' ? 'cover' : 'contain',
            }}
            loading="lazy"
            alt="bg"
          />
          {hasVideo ? (
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlayArrowRounded
                fontSize="large"
                color="primary"
                sx={{
                  borderRadius: '0.4rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                }}
              />
            </Box>
          ) : (
            <div></div>
          )}
          {hasVideo && <MediaPlayer url={url} />}
        </Box>
      </Box>
    </Box>
  )
}
