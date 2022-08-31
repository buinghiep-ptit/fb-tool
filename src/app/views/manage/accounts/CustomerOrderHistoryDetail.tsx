import { ReportSharp } from '@mui/icons-material'
import { styled } from '@mui/material'
import { Box } from '@mui/system'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import * as React from 'react'
import { NavLink } from 'react-router-dom'

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
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý KH', path: '/quan-ly-tai-khoan-khach-hang' },
            {
              name: 'Chi tiết',
              path: '/quan-ly-tai-khoan-khach-hang/1/history',
            },
            { name: 'Lịch sử đặt chỗ' },
          ]}
        />
      </Box>
      <SimpleCard title="Chi tiết KH">
        <NavLink to={'/quan-ly-tai-khoan-khach-hang/1/info'} replace={true}>
          <MuiButton
            title="Info"
            variant="outlined"
            color="error"
            type="submit"
            sx={{ width: '100%' }}
            startIcon={<ReportSharp />}
          />
        </NavLink>
      </SimpleCard>
    </Container>
  )
}
