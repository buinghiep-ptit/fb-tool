import { Box, styled, Typography, Button } from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import InformationPlace from './informationPlace'
import ListCampPlace from './listCampPlace'
import ListEventPlace from './listEventPlace'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

const MENU_DETAIL = ['Thông tin', 'Danh sách điểm Camp', 'Danh sách sự kiện']

export default function DetailPlace(props) {
  const [value, setValue] = React.useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý địa danh', path: '/quan-ly-thong-tin-dia-danh' },
            { name: 'Chi tiết địa danh' },
          ]}
        />
      </Box>
      <SimpleCard>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                variant="fullWidth"
              >
                {MENU_DETAIL.map((itemMenu, index) => (
                  <Tab
                    label={itemMenu}
                    value={(index + 1).toString()}
                    key={index}
                  />
                ))}
              </TabList>
            </Box>
            <TabPanel value={value}>
              <div style={{ display: value === '1' ? 'block' : 'none' }}>
                <InformationPlace />
              </div>
              <div style={{ display: value === '2' ? 'block' : 'none' }}>
                <ListCampPlace />
              </div>
              <div style={{ display: value === '3' ? 'block' : 'none' }}>
                <ListEventPlace />
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </SimpleCard>
    </Container>
  )
}
