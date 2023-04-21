import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Button,
  DialogActions,
  IconButton,
  LinearProgress,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box } from '@mui/system'
import { deleteTeam } from 'app/apis/teams/teams.service'
import { toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'

export interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  refresh: () => Promise<void>
  team: any
}

const DialogDeleteTeam = React.forwardRef((props: Props, ref) => {
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

  const tryToDeleteTeam = async () => {
    props.setIsLoading(true)

    await deleteTeam(props.team.id)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
        props.refresh()
        handleClose()
      })
      .catch(() => {})
      .finally(() => {
        props.setIsLoading(false)
      })
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      {props.isLoading && (
        <Box
          sx={{
            width: '100%',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '1000',
          }}
        >
          <LinearProgress />
        </Box>
      )}
      <DialogTitle>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>Xóa đội bóng</div>
          <IconButton aria-label="close" size="large" onClick={handleClose}>
            <HighlightOffIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div>Bạn có chắc muốn xóa đội bóng?</div>
      </DialogContent>
      <DialogActions sx={{ textAlign: 'center' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={props.isLoading}
        >
          Hủy
        </Button>
        <Button
          onClick={tryToDeleteTeam}
          autoFocus
          variant="contained"
          disabled={props.isLoading}
        >
          {props.isLoading ? 'Đang xóa...' : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default DialogDeleteTeam
