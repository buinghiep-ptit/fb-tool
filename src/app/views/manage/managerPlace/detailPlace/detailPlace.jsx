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
import DialogCustom from 'app/components/common/DialogCustom'

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
  const [tab, setTab] = React.useState()
  const dialogConfirm = React.useRef()

  const handleChange = (event, newValue) => {
    if (value === '1' && newValue !== '1') {
      setTab(newValue)
      dialogConfirm.current.handleClickOpen()
      return
    }
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
            <TabPanel value="1">
              <InformationPlace />
            </TabPanel>
            <TabPanel value="2">
              <ListCampPlace />
            </TabPanel>
            <TabPanel value="3">
              <ListEventPlace />
            </TabPanel>
          </TabContext>
        </Box>
      </SimpleCard>
      <DialogCustom ref={dialogConfirm} title="Xác nhận" maxWidth="sm">
        <Typography variant="h5" component="h6" align="center" mt={5} mb={5}>
          {
            'Ấn "Lưu" để giữ những thay đổi, nếu tiếp tục nhưng thay đổi sẽ không được giữ lại'
          }
        </Typography>
        <div style={{ textAlign: 'center' }}>
          <Button
            style={{ marginRight: '10px' }}
            color="primary"
            variant="contained"
            type="button"
            onClick={() => {
              setValue(tab)
              dialogConfirm.current.handleClose()
            }}
          >
            Tiếp tục
          </Button>
          <Button
            style={{ backgroundColor: '#cccccc' }}
            variant="contained"
            type="button"
            onClick={() => {
              dialogConfirm.current.handleClose()
            }}
          >
            Quay lại
          </Button>
        </div>
      </DialogCustom>
    </Container>
  )
}
