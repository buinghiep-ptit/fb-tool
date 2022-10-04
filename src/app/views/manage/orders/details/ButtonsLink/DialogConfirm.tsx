import MuiStyledModal from 'app/components/common/MuiStyledModal'
import * as React from 'react'

export interface IDiagLogConfirmProps {
  title?: string
  open?: boolean
  setOpen?: (open: boolean) => void
  onSubmit: () => void
  children?: React.ReactElement
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false | string
}

export function DiagLogConfirm({
  title = '',
  open = false,
  setOpen,
  maxWidth = 'sm',
  onSubmit,
  children,
}: IDiagLogConfirmProps) {
  return (
    <React.Fragment>
      <MuiStyledModal
        title={title}
        open={open}
        maxWidth={maxWidth}
        onCloseModal={() => setOpen && setOpen(false)}
        isLoading={false}
        onSubmit={onSubmit}
      >
        {children}
      </MuiStyledModal>
    </React.Fragment>
  )
}
