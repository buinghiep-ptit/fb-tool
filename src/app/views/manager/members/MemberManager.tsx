import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { getMemberRegistrations } from 'app/apis/members/members.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { MEMBER_STATUSES, findMemberStatus } from 'app/constants/memberStatus'
import dayjs from 'dayjs'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { headTableMembers } from './const'

export interface Props {}

export default function MatchManager(props: Props) {
  const navigate = useNavigate()

  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [doRerender, setDoRerender] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [registrations, setRegistrations] = useState<any>()
  const [searchFilter, setSearchFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState(99)
  const [fromFilter, setFromFilter] = useState<any>('')
  const [toFilter, setToFilter] = useState<any>('')

  const fetchListRegistrations = async () => {
    setIsLoading(true)
    await getMemberRegistrations({
      search: searchFilter,
      status: statusFilter === 99 ? null : statusFilter,
      from:
        fromFilter && dayjs(fromFilter).isValid()
          ? dayjs(fromFilter).toISOString()
          : '',
      to:
        toFilter && dayjs(toFilter).isValid()
          ? dayjs(toFilter).toISOString()
          : '',
      page: page,
      size: rowsPerPage,
    })
      .then(res => {
        setRegistrations(res.content)
        setCountTable(res.totalElements)
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  const search = () => {
    setPage(0)
    setDoRerender(!doRerender)
  }

  const resetFilter = () => {
    setSearchFilter('')
    setStatusFilter(99)
    setFromFilter('')
    setToFilter('')
    setDoRerender(!doRerender)
  }

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage)
    setDoRerender(!doRerender)
  }

  const handleChangeRowsPerPage = (event: {
    target: { value: string | number }
  }) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    setDoRerender(!doRerender)
  }

  useEffect(() => {
    fetchListRegistrations()
  }, [page, doRerender])

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
          routeSegments={[{ name: 'Quản lý hội viên', path: '/members' }]}
        />
      </Box>

      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Cài đặt giới thiệu hội viên"
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => navigate('/members/setting')}
        />
      </Stack>

      <Stack gap={1}>
        <SimpleCard>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                id="outlined-basic"
                label="Sđt, họ và tên"
                variant="outlined"
                fullWidth
                value={searchFilter}
                onChange={e => {
                  setSearchFilter(e.target.value)
                }}
                onKeyDown={async e => {
                  if (e.key === 'Enter') {
                    search()
                  }
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Trạng thái
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Trạng thái"
                  value={statusFilter}
                  onChange={e => {
                    setStatusFilter(e.target.value as number)
                  }}
                >
                  <MenuItem value={99}>Tất cả</MenuItem>
                  {Object.values(MEMBER_STATUSES).map((type, index) => {
                    return (
                      <MenuItem key={index} value={type.id}>
                        {type.label}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={3}>
                <DatePicker
                  label="Từ ngày"
                  value={fromFilter}
                  onChange={newValue => setFromFilter(newValue)}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      error={false}
                      required={false}
                      InputLabelProps={{ shrink: true }}
                      size="medium"
                      variant="outlined"
                      fullWidth
                      color="primary"
                      autoComplete="bday"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <DatePicker
                  label="Đến ngày"
                  value={toFilter}
                  onChange={newValue => setToFilter(newValue)}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      error={false}
                      required={false}
                      InputLabelProps={{ shrink: true }}
                      size="medium"
                      variant="outlined"
                      fullWidth
                      color="primary"
                      autoComplete="bday"
                    />
                  )}
                />
              </Grid>
            </LocalizationProvider>
            <Grid item xs={4}></Grid>
            <Grid
              item
              xs={2}
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                justifyItems: 'baseline',
              }}
            >
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                style={{ width: '100%' }}
                onClick={search}
                disabled={isLoading}
              >
                Tìm kiếm
              </Button>
            </Grid>
            <Grid
              item
              xs={2}
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                justifyItems: 'baseline',
              }}
            >
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                style={{ width: '100%' }}
                onClick={resetFilter}
                disabled={isLoading}
              >
                Làm mới
              </Button>
            </Grid>
          </Grid>
        </SimpleCard>

        <div style={{ height: '30px' }} />
        <SimpleCard>
          {registrations?.length === 0 && (
            <Typography color="gray" textAlign="center">
              Không có dữ liệu
            </Typography>
          )}
          <Box
            width="100%"
            overflow="auto"
            hidden={registrations?.length === 0}
          >
            <StyledTable>
              <TableHead>
                <TableRow>
                  {headTableMembers.map(header => (
                    <TableCell
                      align="center"
                      style={{ minWidth: header.width }}
                      key={header.name}
                    >
                      {header.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(registrations || []).map((registration: any, index: any) => {
                  return (
                    <TableRow hover key={index}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          color="info"
                          onClick={() => {
                            navigate('/customers/' + registration.customerId)
                          }}
                        >
                          {registration.customerName}
                        </Button>
                      </TableCell>
                      <TableCell align="left">
                        {registration.registerInfo}
                      </TableCell>
                      <TableCell align="left">
                        {dayjs(registration.registerDate).format(
                          'DD/MM/YYYY HH:mm',
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {findMemberStatus(registration.status)?.label}
                      </TableCell>
                      <TableCell align="center">
                        {registration.type === 1 ? 'Đăng ký' : 'Gia hạn'}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => {
                            navigate('/members/' + registration.membershipId)
                          }}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </StyledTable>
            <TablePagination
              sx={{ px: 2 }}
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={countTable}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[20, 50, 100]}
              labelRowsPerPage={'Dòng / Trang'}
              onRowsPerPageChange={handleChangeRowsPerPage}
              nextIconButtonProps={{ 'aria-label': 'Next Page' }}
              backIconButtonProps={{ 'aria-label': 'Previous Page' }}
            />
          </Box>
        </SimpleCard>
      </Stack>
    </Container>
  )
}
