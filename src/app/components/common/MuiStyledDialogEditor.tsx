import { ApprovalRounded, CancelOutlined } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { Stack, styled } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import * as React from 'react'
import { MuiButton } from './MuiButton'

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
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        color: theme => theme.palette.primary.contrastText,
        backgroundColor: theme => theme.palette.primary.main,
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.primary.contrastText,
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
  submitText?: string
  cancelText?: string
  open: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false | string
  onCloseModal: () => void
  children?: React.ReactElement
  onSubmit?: any
  isLoading?: boolean
}

export default function MuiStyledDialogEditor({
  title,
  submitText = 'Xác nhận',
  cancelText = 'Quay lại',
  open,
  maxWidth = 'xs',
  onCloseModal,
  onSubmit,
  children,
  isLoading,
}: Props) {
  return (
    <BootstrapDialog
      onClose={onCloseModal}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth={maxWidth as any}
      fullWidth={true}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={onCloseModal}>
        {title}
      </BootstrapDialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Stack direction={'row'} gap={2} px={1}>
          {onSubmit && (
            <MuiButton
              disabled={isLoading}
              title={submitText}
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<ApprovalRounded />}
              sx={{ minWidth: 100 }}
              onClick={() => onSubmit()}
              loading={isLoading}
            />
          )}

          {onCloseModal && (
            <MuiButton
              title={cancelText}
              variant="outlined"
              color="secondary"
              type="submit"
              sx={{ minWidth: 100 }}
              startIcon={<CancelOutlined />}
              onClick={onCloseModal}
            />
          )}
        </Stack>
      </DialogActions>
    </BootstrapDialog>
  )
}
