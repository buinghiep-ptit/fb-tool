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
import { updateTeam } from 'app/apis/teams/teams.service'
import { toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'

export interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  refresh: () => Promise<void>
  team: any
}

const DialogUpdateStatus = React.forwardRef((props: Props, ref) => {
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

  const updateStatus = async () => {
    props.setIsLoading(true)
    const payload: any = {
      ...props.team,
      status: props.team.status === 1 ? -1 : 1,
    }

    await updateTeam(props.team.id, payload)
      .then(() => {
        toastSuccess({
          message: 'Cập nhật thành công',
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
          <div>Đổi trạng thái đội bóng</div>
          <IconButton aria-label="close" size="large" onClick={handleClose}>
            <HighlightOffIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div>Bạn có chắc muốn đổi lại trạng thái đội bóng</div>
      </DialogContent>
      <DialogActions sx={{ textAlign: 'center' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={props.isLoading}
        >
          Không
        </Button>
        <Button
          onClick={updateStatus}
          autoFocus
          variant="contained"
          disabled={props.isLoading}
        >
          {props.isLoading ? 'Đang cập nhật...' : 'Có'}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default DialogUpdateStatus
