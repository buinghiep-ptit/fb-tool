import { styled } from '@mui/material'
import { Box } from '@mui/system'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiNavTabs } from 'app/components/common/MuiNavTabs'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

const navItems = ['Thông tin', 'Lịch sử đặt chỗ ']

export interface Props {
  children: React.ReactElement
}

export function LayoutCustomer({ children, ...props }: Props) {
  const router = useLocation()
  const { pathname } = router
  const [pathName, setPathName] = useState('Thông tin')
  const { customerId } = useParams() ?? 0

  useEffect(() => {
    if (pathname.includes('history')) {
      setPathName('Lịch sử đặt chỗ')
    } else {
      setPathName('Thông tin')
    }
  }, [router])
  return (
    <Container>
      <React.Fragment>
        <Box className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              { name: 'Quản lý KH', path: '/quan-ly-tai-khoan-khach-hang' },
              {
                name: 'Chi tiết',
                path: `/quan-ly-tai-khoan-khach-hang/${customerId ?? 0}`,
              },
              { name: pathName },
            ]}
          />
        </Box>
        <Box mt={-2} pb={2}>
          <MuiNavTabs navItems={navItems} customerId={customerId ?? 0} />
        </Box>
        <SimpleCard title="">{children}</SimpleCard>
      </React.Fragment>
    </Container>
  )
}
