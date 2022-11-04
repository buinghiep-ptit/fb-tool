import { ApprovalRounded, CancelOutlined } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { Icon } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { Stack } from '@mui/system'
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

export default function MuiStyledModal({
  title,
  submitText = 'Xác nhận',
  cancelText = 'Quay lại',
  open,
  maxWidth = 'sm',
  onCloseModal,
  onSubmit,
  children,
  isLoading,
}: Props) {
  //   const [open, setOpen] = React.useState(false)
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
          justifyContent="center"
          width={'100%'}
          gap={2}
        >
          {onSubmit && (
            <MuiButton
              disabled={isLoading}
              title={submitText}
              variant="contained"
              color="primary"
              type="submit"
              sx={{ flex: !!onCloseModal ? 1 : null, minWidth: 200 }}
              startIcon={<Icon>save</Icon>}
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
              sx={{ flex: onSubmit ? 1 : null, minWidth: 200 }}
              startIcon={<Icon>cancel</Icon>}
              onClick={onCloseModal}
            />
          )}
        </Stack>
      </DialogActions>
    </BootstrapDialog>
  )
}
