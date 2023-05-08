import { Box } from '@mui/system'
import * as React from 'react'
import { Breadcrumb, Container } from 'app/components'
import { Tab } from '@mui/material'

import { useState } from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import Information from './Information'
import PurchaseHistory from './PurchaseHistory'
export interface Props {}

export default function EditCustomer(props: Props) {
  const [value, setValue] = useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý khách hàng', path: '/customers' },
            { name: 'Thông tin khách hàng' },
          ]}
        />
      </Box>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Thông tin" value="1" />
              <Tab label="Lịch sử mua hàng" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Information />
          </TabPanel>
          <TabPanel value="2">
            <PurchaseHistory />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  )
}
