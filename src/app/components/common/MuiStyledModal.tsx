import * as React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import { MuiButton } from './MuiButton'
import {
  AccessibleSharp,
  ApprovalRounded,
  ApprovalSharp,
  CancelOutlined,
} from '@mui/icons-material'
import { Stack } from '@mui/system'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

type Props = {
  title: string
  open: boolean
  setOpenModal: (value: boolean) => void
  children?: React.ReactElement
}

export default function MuiStyledModal({
  title,
  open,
  setOpenModal,
  children,
}: Props) {
  //   const [open, setOpen] = React.useState(false)
  return (
    <BootstrapDialog
      onClose={() => setOpenModal(false)}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth={'sm'}
      fullWidth={true}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={() => setOpenModal(false)}
      >
        {title}
      </BootstrapDialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Stack
          py={2}
          sx={{
            paddingLeft: {
              xs: '6.66%',
              sm: '13.33%',
            },
            paddingRight: {
              xs: '6.66%',
              sm: '13.33%',
            },
          }}
          direction={'row'}
          width={'100%'}
          gap={2}
        >
          <MuiButton
            title="Lưu"
            variant="contained"
            color="primary"
            type="submit"
            sx={{ width: '100%', flex: 1 }}
            startIcon={<ApprovalRounded />}
            onClick={() => setOpenModal(false)}
          />
          <MuiButton
            title="Đóng"
            variant="outlined"
            color="error"
            type="submit"
            sx={{ width: '100%', flex: 1 }}
            startIcon={<CancelOutlined />}
            onClick={() => setOpenModal(false)}
          />
        </Stack>
      </DialogActions>
    </BootstrapDialog>
  )
}
