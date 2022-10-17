import { Box, styled } from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import InformationCampGround from './informationCampGround'
import ListCampService from './listCampService'
import ListCampHandBook from './listCampHandbook'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

const MENU_DETAL = ['Thông tin', 'Danh sách dịch vụ', 'Cẩm nang']

export default function DetailCampGround({ action }) {
  const [value, setValue] = React.useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý điểm camp', path: '/quan-ly-thong-tin-diem-camp' },
            {
              name: action === 'edit' ? 'Chi tiết điểm camp' : 'Thêm điểm camp',
            },
          ]}
        />
      </Box>
      <SimpleCard>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          {action === 'create' && <InformationCampGround action="create" />}
          {action === 'edit' && (
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  variant="fullWidth"
                >
                  {MENU_DETAL.map((itemMenu, index) => (
                    <Tab
                      label={itemMenu}
                      value={(index + 1).toString()}
                      key={index}
                    />
                  ))}
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ backgroundColor: '#fafafa' }}>
                <InformationCampGround action="edit" />
              </TabPanel>
              <TabPanel value="2" sx={{ backgroundColor: '#fafafa' }}>
                <ListCampService />
              </TabPanel>
              <TabPanel value="3" sx={{ backgroundColor: '#fafafa' }}>
                <ListCampHandBook />
              </TabPanel>
            </TabContext>
          )}
        </Box>
      </SimpleCard>
    </Container>
  )
}
