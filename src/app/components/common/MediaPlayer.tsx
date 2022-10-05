import { Icon, IconButton, LinearProgress, Slider, styled } from '@mui/material'
import { Box } from '@mui/system'
import * as React from 'react'
import { findDOMNode } from 'react-dom'
// import { hot } from 'react-hot-loader'
import ReactPlayer from 'react-player'
import { Waypoint } from 'react-waypoint'
import screenfull from 'screenfull'
import { AbsoluteFillObject } from './AbsoluteFillObjectBox'
import Duration from './Duration'
import LoadingItem from './LoadingItem'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  '&.MuiLinearProgress-colorPrimary:not(.MuiLinearProgress-buffer)': {
    backgroundColor: '#86dc3d',
  },
  '& .MuiLinearProgress-colorPrimary': {
    backgroundColor: '#86dc3d',
  },
  '& .MuiLinearProgress-barColorPrimary': {
    borderRadius: 4,
    backgroundColor: '#2f9b42',
  },
  '& .MuiLinearProgress-dashed': {
    background: 'transparent',
  },
  '& .MuiLinearProgress-dashedColorPrimary': {
    backgroundColor: '#EDFDEF',
    // backgroundImage:
    //   'radial-gradient(#f6ce95 0%, #f6ce95 16%, transparent 42%)',
  },
}))
export interface IMediaPlayerProps {
  url: string
  setDuration?: (dur: number) => void
}

function MediaPlayer({ url, setDuration }: IMediaPlayerProps) {
  const [loading, setLoading] = React.useState(true)

  const [state, setState] = React.useState({
    url: null,
    pip: false,
    playing: false,
    controls: true,
    light: false,
    volume: 1,
    muted: true,
    played: 0,
    loaded: 0,
    playedSeconds: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
  })

  const playerRef = React.useRef(null) as any

  const handleEnterViewport = function () {
    setState(prev => ({ ...prev, playing: true }))
  }
  const handleExitViewport = function () {
    setState(prev => ({ ...prev, playing: false }))
  }

  const handleToggleMuted = () => {
    setState(prev => ({ ...prev, muted: !prev.muted }))
  }

  const handleClickFullscreen = () => {
    ;(screenfull as any).request(findDOMNode(playerRef.current) as any)
  }

  const handlePlayPause = () => {
    // setState(prev => ({ ...prev, playing: !prev.playing }))
  }

  const handleProgress = (state: any) => {
    // We only want to update time slider if we are not currently seeking
    if (!state.seeking) {
      setState(prev => ({ ...prev, ...state }))
    }
  }

  const handleDuration = (duration: number) => {
    if (setDuration) setDuration(duration)
    setState(prev => ({ ...prev, duration: duration }))
  }

  const handleSeekMouseDown = (e: any) => {
    setState(prev => ({
      ...prev,
      seeking: true,
    }))
  }

  const handleSeekChange = (_: any, value: any) => {
    setState(prev => ({
      ...prev,
      played: parseFloat((value / state.duration) as unknown as string),
    }))
    playerRef.current.seekTo(
      parseFloat((value / state.duration) as unknown as string),
    )
  }

  const handleReplay = () => {
    setState(prev => ({
      ...prev,
      played: 0,
    }))
    playerRef.current.seekTo(0)
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `100%`,
        height: `100%`,
        backgroundColor: 'black',
      }}
    >
      <Waypoint onEnter={handleEnterViewport} onLeave={handleExitViewport}>
        <div onMouseDown={() => handlePlayPause()}>
          <ReactPlayer
            key={1}
            ref={playerRef}
            style={{ position: 'absolute', top: 0, left: 0 }}
            width="100%"
            height="100%"
            url={url}
            controls={state.controls}
            config={{
              file: {
                attributes: {
                  onContextMenu: (e: any) => e.preventDefault(),
                  controlsList: 'nodownload',
                },
              },
            }}
            playing={state.playing}
            muted={state.muted}
            onReady={() => setLoading(false)}
            onStart={() => {}}
            onPlay={() => console.log('onPlay')}
            onProgress={handleProgress}
            onDuration={handleDuration}
          />
          {/* <Box
            sx={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              zIndex: 999,
            }}
          >
            <IconButton onClick={handleToggleMuted}>
              <Icon color="primary">
                {state.muted ? 'volume_off' : 'volume_up'}
              </Icon>
            </IconButton>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              zIndex: 999,
            }}
          >
            <IconButton onClick={handleClickFullscreen}>
              <Icon color="primary">crop_free</Icon>
            </IconButton>
          </Box> */}

          {Math.ceil(state.duration * (1 - state.played)) === 0 ? (
            <AbsoluteFillObject bgcolor="rgba(0, 0, 0, 0.5)">
              <IconButton onClick={handleReplay}>
                <Icon color="primary" sx={{ fontSize: '32px !important' }}>
                  history
                </Icon>
              </IconButton>
            </AbsoluteFillObject>
          ) : null}

          {/* <Box
            sx={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '100%',
              height: '32px',
              background: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              px: 1,
              py: 0.5,
            }}
          >
            <Box
              sx={{
                width: '100%',
                position: 'relative',
              }}
            >
              <BorderLinearProgress
                variant="buffer"
                value={state.played * 100}
                valueBuffer={state.loaded * 100}
                color="primary"
              />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Duration seconds={state.duration * state.played} />
                <Duration seconds={state.duration * (1 - state.played)} />
              </Box>

              <Slider
                aria-label="time-indicator"
                size="small"
                value={state.played * state.duration}
                min={0}
                step={1}
                max={state.duration}
                onChange={handleSeekChange}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: 8,
                  p: 0,
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    // transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                    // '&:before': {
                    //   boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                    // },
                    // '&:hover, &.Mui-focusVisible': {
                    //   boxShadow: `0px 0px 0px 8px ${'rgb(0 0 0 / 16%)'}`,
                    // },
                    // '&.Mui-active': {
                    //   width: 16,
                    //   height: 16,
                    // },
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.28, // 0.28
                  },
                }}
              />
            </Box>
          </Box> */}

          <LoadingItem loading={loading} className="video__loading" />
        </div>
      </Waypoint>
    </div>
  )
}

export default MediaPlayer
