import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { LinearProgress } from '@mui/material'
import Tab from '@mui/material/Tab'
import { Box } from '@mui/system'
import { Breadcrumb, Container } from 'app/components'
import * as React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import InformationLeagues from './InformationLeagues'
import Rank from './Rank'
import ScheduleCup from './ScheduleCup'
import ScheduleLeague from './ScheduleLeague'
export interface Props {}

export default function EditLeagues(props: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const league = useSelector((state: any) => state.leagues)
  console.log(league)
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
              <Tab label="Thông tin trận đấu" value="1" />
              <Tab label="Lịch thi đấu" value="2" />
              <Tab label="Bảng xếp hạng" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <InformationLeagues
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </TabPanel>
          <TabPanel value="2">
            {league.category !== 1 ? (
              <ScheduleCup setIsLoading={setIsLoading} isLoading={isLoading} />
            ) : (
              <ScheduleLeague
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />
            )}
          </TabPanel>
          <TabPanel value="3">
            <Rank setIsLoading={setIsLoading} isLoading={isLoading} />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  )
}
