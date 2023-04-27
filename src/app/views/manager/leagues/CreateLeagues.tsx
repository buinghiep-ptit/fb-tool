import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { LinearProgress } from '@mui/material'
import Tab from '@mui/material/Tab'
import { Box } from '@mui/system'
import { getLeagues } from 'app/apis/leagues/leagues.service'
import { Breadcrumb, Container } from 'app/components'
import * as React from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import InformationLeagues from './InformationLeagues'
export interface Props {}

export default function LeaguesManager(props: Props) {
  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [leagues, setLeagues] = useState<any>()
  const [nameFilter, setNameFilter] = useState<any>()
  const [statusFilter, setStatusFilter] = useState<any>()
  const [nameShortFilter, setNameShortFilter] = useState<any>()
  const [typeFilter, setTypeFilter] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const param = useParams()
  const [value, setValue] = React.useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage)
    fetchLeagues()
  }

  const handleChangeRowsPerPage = (event: {
    target: { value: string | number }
  }) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    fetchLeagues()
  }

  const fetchLeagues = async () => {
    const res = await getLeagues({
      name: nameFilter,
      shortName: nameShortFilter,
      status: statusFilter === 2 ? null : statusFilter,
      type: typeFilter === 99 ? null : typeFilter,
      size: rowsPerPage,
      page: page,
    })
    setLeagues(res.content)
    setCountTable(res.totalElements)
  }

  const handleSearch = async () => {
    setIsLoading(true)
    await fetchLeagues()
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchLeagues()
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
            <InformationLeagues />
          </TabPanel>
          <TabPanel value="2">Lịch thi đấu</TabPanel>
          <TabPanel value="3">Bảng xếp hạng</TabPanel>
        </TabContext>
      </Box>
    </Container>
  )
}
