import { LinearProgress, Stack, Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import { Breadcrumb, Container } from 'app/components'
import { useState } from 'react'
import LogoList from './LogoList'

export interface Props {}

function a11yProps(index: any) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

export default function LogoManager(props: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [tab, setTab] = useState(0)

  const handleChangeTab = (event: any, newValue: any) => {
    setTab(newValue)
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
          routeSegments={[{ name: 'Quản lý logo', path: '/logos' }]}
        />
      </Box>

      <Stack gap={1}>
        <div style={{ height: '30px' }} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            aria-label="tabs"
            variant="fullWidth"
          >
            <Tab label="Logo nhà tài trợ chính" {...a11yProps(0)} />
            <Tab label="Logo nhà tài trợ thường" {...a11yProps(1)} />
          </Tabs>
          <LogoList
            value={tab}
            index={0}
            type={1}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <LogoList
            value={tab}
            index={1}
            type={2}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </Box>
      </Stack>
    </Container>
  )
}
