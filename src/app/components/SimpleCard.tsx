import { Card } from '@mui/material'
import { Box, SystemCssProperties, styled } from '@mui/system'
import { ReactNode } from 'react'

const CardRoot = styled(Card)(() => ({
  height: '100%',
  padding: '16px 20px',
  overflow: 'visible',
}))

interface Props {
  children?: ReactNode
  title?: string
  subtitle?: string
  icon?: ReactNode
  sx?: SystemCssProperties
}

const CardTitle = styled(Box)<Props>(({ subtitle }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: 'none',
  marginBottom: !subtitle ? '16px' : 0,
}))

const SimpleCard = ({ children, title, subtitle, icon, sx }: Props) => {
  return (
    <CardRoot elevation={6} sx={sx}>
      <CardTitle subtitle={subtitle}>{title}</CardTitle>
      {subtitle && <Box sx={{ mb: 2 }}>{subtitle}</Box>}
      {children}
    </CardRoot>
  )
}

export default SimpleCard
