import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { LinearProgress } from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import { Breadcrumb, Container } from 'app/components'
import * as React from 'react'
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import '../shop/shop.css'
import MainBanner from './MainBanner'
import SubBanner from './SubBanner'

export interface Props {}

export default function BannerManager(props: Props) {
  const [value, setValue] = useState('1')
  const [searchParams, setSearchParams] = useSearchParams()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
    setSearchParams({ type: newValue })
  }

  React.useEffect(() => {
    setValue(searchParams?.get('type') || '1')
  }, [])

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
        <Breadcrumb routeSegments={[{ name: 'Quản lý banner' }]} />
      </Box>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Banner đầu trang" value="1" />
              <Tab label="Banner giữa" value="2" />
            </TabList>
          </Box>
          <TabPanel value={value}>
            <div style={{ display: value === '1' ? 'block' : 'none' }}>
              <MainBanner isLoading={isLoading} setIsLoading={setIsLoading} />
            </div>
            <div style={{ display: value === '2' ? 'block' : 'none' }}>
              <SubBanner
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              ></SubBanner>
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  )
}
