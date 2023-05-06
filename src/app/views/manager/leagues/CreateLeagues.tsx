import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { LinearProgress } from '@mui/material'
import Tab from '@mui/material/Tab'
import { Box } from '@mui/system'
import { Breadcrumb, Container } from 'app/components'
import * as React from 'react'
import { useState } from 'react'
import InformationLeaguesCreate from './InformationLeaguesCreate'
export interface Props {}

export default function LeaguesManager(props: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const [value, setValue] = React.useState('1')

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
            { name: 'Quản lý giải đấu', path: '/leagues' },
            { name: 'Thêm giải đấu' },
          ]}
        />
      </Box>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Thông tin giải đấu" value="1" />
              <Tab label="Lịch thi đấu" value="2" />
              <Tab label="Bảng xếp hạng" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <InformationLeaguesCreate
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  )
}
