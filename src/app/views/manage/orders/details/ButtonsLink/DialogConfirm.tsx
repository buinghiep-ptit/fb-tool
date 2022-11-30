import MuiStyledModal from 'app/components/common/MuiStyledModal'
import * as React from 'react'

export interface IDiagLogConfirmProps {
  title?: string
  open?: boolean
  isLoading?: boolean
  setOpen?: (open: boolean) => void
  onSubmit?: () => void
  children?: React.ReactElement
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false | string
  submitText?: string
  cancelText?: string
  disabled?: boolean
}

export function DiagLogConfirm({
  title = '',
  open = false,
  setOpen,
  isLoading,
  maxWidth = 'sm',
  onSubmit,
  submitText = 'Xác nhận',
  cancelText = 'Quay lại',
  children,
  disabled = false,
}: IDiagLogConfirmProps) {
  return (
    <React.Fragment>
      <MuiStyledModal
        title={title}
        open={open}
        maxWidth={maxWidth}
        onCloseModal={() => setOpen && setOpen(false)}
        isLoading={isLoading}
        onSubmit={onSubmit}
        submitText={submitText}
        cancelText={cancelText}
        disabled={disabled}
      >
        {children}
      </MuiStyledModal>
    </React.Fragment>
  )
}
