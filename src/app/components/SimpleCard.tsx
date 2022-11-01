import { Card } from '@mui/material'
import { Box, BoxProps, styled } from '@mui/system'
import { ReactNode } from 'react'

const CardRoot = styled(Card)(() => ({
  height: '100%',
  padding: '16px 20px',
}))

interface Props {
  children?: ReactNode
  title?: string
  subtitle?: string
  icon?: ReactNode
}

const CardTitle = styled(Box)<Props>(({ subtitle }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: 'capitalize',
  marginBottom: !subtitle ? '16px' : 0,
}))

const SimpleCard = ({ children, title, subtitle, icon }: Props) => {
  return (
    <CardRoot elevation={6}>
      <CardTitle subtitle={subtitle}>{title}</CardTitle>
      {subtitle && <Box sx={{ mb: 2 }}>{subtitle}</Box>}
      {children}
    </CardRoot>
  )
}

export default SimpleCard
