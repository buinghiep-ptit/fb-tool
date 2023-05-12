import { LinearProgress, Tab } from '@mui/material'
import { Box } from '@mui/system'
import { Breadcrumb, Container } from 'app/components'
import * as React from 'react'

import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useState } from 'react'
import Information from './Information'
import PurchaseHistory from './PurchaseHistory'
export interface Props {}

export default function EditCustomer(props: Props) {
  const [value, setValue] = useState('1')
  const [isLoading, setIsLoading] = useState(false)
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Container>
      {isLoading && (
        <Box
          sx={{
            width: '100%',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '1000',
          }}
        >
          <LinearProgress />
        </Box>
      )}
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
            <Information isLoading={isLoading} setIsLoading={setIsLoading} />
          </TabPanel>
          <TabPanel value="2">
            <PurchaseHistory />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  )
}
