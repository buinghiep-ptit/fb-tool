import CloseIcon from '@mui/icons-material/Close'
import { Stack } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'
import * as React from 'react'
import SliderShow from './SliderShow'

const Transition = React.forwardRef(function Transition(
  props: any & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return (
    <Slide direction="up" ref={ref} {...props}>
      {}
    </Slide>
  )
})

type ModalProps = {
  open?: boolean
  initialIndexSlider?: number
  onCloseModal?: () => void
  onSubmit?: (index?: number) => void
  data?: any
  mode?: 'view' | 'edit'
}

export function ModalFullScreen({
  open = false,
  initialIndexSlider = 0,
  data,
  onCloseModal,
  onSubmit,
  mode = 'view',
}: ModalProps) {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onCloseModal}
      TransitionComponent={Transition as any}
    >
      <Stack maxHeight={'100vh'} sx={{ overflowY: 'hidden' }}>
        <IconButton
          edge="start"
          onClick={onCloseModal}
          aria-label="close"
          sx={{
            position: 'absolute',
            top: 12,
            left: 24,
            zIndex: 999,
            backgroundColor: '#303030',
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
        <SliderShow
          items={data}
          onRemoveItem={onSubmit}
          initialIndexSlider={initialIndexSlider}
        />
      </Stack>
    </Dialog>
  )
}
