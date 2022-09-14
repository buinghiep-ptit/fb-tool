import { styled, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Breadcrumb, SimpleCard } from 'app/components'
import React, { ReactElement } from 'react'

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))
export interface Props {}

export default function HistoryDetail(props: Props) {
  return (
    <Box>
      <Typography>Coming Soon...</Typography>
    </Box>
  )
}
