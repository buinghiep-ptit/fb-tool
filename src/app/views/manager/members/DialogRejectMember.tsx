import { yupResolver } from '@hookform/resolvers/yup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  LinearProgress,
} from '@mui/material'
import { Box } from '@mui/system'
import { rejectMember } from 'app/apis/members/members.service'
import MuiRHFTextarea from 'app/components/common/MuiRHFTextarea'
import { toastSuccess } from 'app/helpers/toastNofication'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

export interface Props {
  idRegistration: number
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  refresh: () => void
}

const DialogRejectMember = React.forwardRef((props: Props, ref) => {
  const { idRegistration, isLoading, setIsLoading, refresh } = props

  const [open, setOpen] = React.useState(false)

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
      methods.reset()
    },
  }))

  const handleClose = () => {
    setOpen(false)
    methods.reset()
  }

  const schema = yup
    .object({
      note: yup.string().trim().max(255, 'Tối đa 255 ký tự'),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      note: '',
    },
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)

    const payload: any = {
      note: data.note ? data.note : null,
    }

    await rejectMember(idRegistration, payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
        refresh()
        handleClose()
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }
  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        {isLoading && (
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
            <div>Bạn có chắc chắn muốn hủy đăng ký hội viên?</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <FormLabel error={!!methods.formState.errors?.note}>
                  Ghi chú
                </FormLabel>
                <MuiRHFTextarea name="note" label="Ghi chú" />
              </FormControl>
            </DialogContent>
            <DialogActions sx={{ textAlign: 'center' }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                disabled={isLoading}
              >
                Đóng
              </Button>
              <Button
                color="primary"
                type="submit"
                variant="contained"
                disabled={isLoading}
              >
                {isLoading ? 'Đang hủy...' : 'Hủy'}
              </Button>
            </DialogActions>
          </FormProvider>
        </form>
      </Dialog>
    </div>
  )
})

export default DialogRejectMember
