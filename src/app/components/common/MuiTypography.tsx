import { Box, styled, TypographyProps } from '@mui/material'
import clsx from 'clsx'
import { ReactNode } from 'react'

type TypoProps = {
  children?: ReactNode
  className?: any
  ellipsis?: string
} & TypographyProps

const StyledTypography = styled(Box)<TypoProps>(({ theme, ellipsis }) => ({
  whiteSpace: ellipsis ? 'nowrap' : 'normal',
  overflow: ellipsis ? 'hidden' : '',
  textOverflow: ellipsis ? 'ellipsis' : '',
}))

export const MuiTypography = ({
  children,
  className,
  ellipsis,
  ...props
}: TypoProps) => {
  return (
    <StyledTypography
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      {...props}
    >
      {children}
    </StyledTypography>
  )
}
