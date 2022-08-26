import { Button, ButtonProps, styled } from '@mui/material'
import { CSSProperties, MouseEventHandler } from 'react'

export interface IButtonProps extends ButtonProps {
  title: string
  onClick?: MouseEventHandler | undefined
}

const StyledButton = styled(Button)({
  boxShadow: 'none',
  height: 48,
})

export function MuiButton({ title, onClick, ...props }: IButtonProps) {
  return (
    <>
      <StyledButton onClick={onClick} variant="contained" {...props}>
        {title}
      </StyledButton>
    </>
  )
}
