import { Button, ButtonProps, CircularProgress, styled } from '@mui/material'
import { MouseEventHandler } from 'react'

export interface IButtonProps extends ButtonProps {
  title: string
  loading?: boolean
  loadingColor?:
    | 'inherit'
    | 'error'
    | 'success'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'warning'
    | undefined
  onClick?: MouseEventHandler | undefined
}

const StyledButton = styled(Button)({
  boxShadow: 'none',
  height: 40,
})

export function MuiButton({
  title,
  loading = false,
  loadingColor = 'inherit',
  onClick,
  ...props
}: IButtonProps) {
  return (
    <>
      <StyledButton onClick={onClick} variant="contained" {...props}>
        {loading && <CircularProgress color={loadingColor} size={16} />}
        {!loading && title}
      </StyledButton>
    </>
  )
}
