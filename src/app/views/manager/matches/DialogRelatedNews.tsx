import CloseIcon from '@mui/icons-material/Close'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import * as React from 'react'

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

export interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const DialogRelatedNews = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)
  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
    },
  }))

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Chon tin tuc lien quan
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Lưu
            </Button>
          </Toolbar>
        </AppBar>
        NOI DUNG
      </Dialog>
    </div>
  )
})

export default DialogRelatedNews
