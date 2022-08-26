import { styled } from '@mui/material'
import * as React from 'react'

export interface Props {}

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function ManagerFeed(props: Props) {
  return <div>ManagerFeed</div>
}
