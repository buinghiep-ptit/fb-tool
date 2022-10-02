import MuiStyledModal from 'app/components/common/MuiStyledModal'
import * as React from 'react'

export interface IDiagLogConfirmProps {
  title?: string
  open?: boolean
  setOpen?: (open: boolean) => void
  onSubmit: () => void
}

export function DiagLogConfirm({
  title = '',
  open = false,
  setOpen,
  onSubmit,
}: IDiagLogConfirmProps) {
  const getContent = () => {
    return <></>
  }

  return (
    <React.Fragment>
      <MuiStyledModal
        title={title}
        open={open}
        maxWidth={'sm'}
        onCloseModal={() => setOpen && setOpen(false)}
        isLoading={false}
        onSubmit={onSubmit}
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
