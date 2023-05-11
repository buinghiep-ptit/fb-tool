import { Edit } from '@mui/icons-material'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import SearchIcon from '@mui/icons-material/Search'
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload'
import {
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { getCustomers } from 'app/apis/customer/customer.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { headTableAccount } from './const'
export interface Props {}

export default function CustomerManager(props: Props) {
  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const [customers, setCustomers] = useState<any>(null)
  const [search, setSearch] = useState<any>('')
  const [statusFilter, setStatusFilter] = useState<any>(99)
  const [type, setType] = useState<any>(99)
  const [registeredBy, setRegisteredBy] = useState<any>(99)
  const [dateStart, setDateStart] = useState<any>(null)
  const [dateEnd, setDateEnd] = useState<any>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [doRerender, setDoRerender] = React.useState(false)
  const navigate = useNavigate()

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: {
    target: { value: string | number }
  }) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    setDoRerender(!doRerender)
  }

  const fetchCustomers = async () => {
    setIsLoading(true)
    const res = await getCustomers({
      search: search.trim(),
      customerType: type === 99 ? null : type,
      status: statusFilter === 99 ? null : statusFilter,
      dateStart:
        moment(dateStart).format('YYYY-MM-DD') === 'Invalid date'
          ? null
          : moment(dateStart).format('YYYY-MM-DD'),
      dateEnd:
        moment(dateEnd).format('YYYY-MM-DD') === 'Invalid date'
          ? null
          : moment(dateEnd).format('YYYY-MM-DD'),
      registeredBy: registeredBy === 99 ? null : registeredBy,
      size: rowsPerPage,
      page: page,
    })
    setCustomers(res.content)
    setCountTable(res.totalElements)
    setIsLoading(false)
  }

  const handleSearch = async () => {
    setPage(0)
    setDoRerender(!doRerender)
  }

  const handleClearFilter = async () => {
    setSearch('')
    setType(99)
    setStatusFilter(99)
    setRegisteredBy(99)
    setDateEnd(null)
    setDateStart(null)
    setDoRerender(!doRerender)
  }

  React.useEffect(() => {
    fetchCustomers()
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
        <Breadcrumb routeSegments={[{ name: 'Quản lý khách hàng' }]} />
      </Box>
      <SimpleCard>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              id="outlined-basic"
              label="Email, SDT, Tên hiển thị"
              variant="outlined"
              fullWidth
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  handleSearch()
                }
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Loại tài khoản
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Loại tài khoản"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <MenuItem value={99}>Tất cả</MenuItem>
                <MenuItem value={1}>Thường</MenuItem>
                <MenuItem value={2}>Fan</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Trạng thái"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <MenuItem value={99}>Tất cả</MenuItem>
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={2}>Khóa</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Hình thức đăng ký
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Hình thức đăng ký"
                value={registeredBy}
                onChange={e => setRegisteredBy(e.target.value)}
              >
                <MenuItem value={99}>Tất cả</MenuItem>
                <MenuItem value={1}>Số điện thoại</MenuItem>
                <MenuItem value={3}>Facebook</MenuItem>
                <MenuItem value={4}>Google</MenuItem>
                <MenuItem value={2}>AppleID</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dateStart}
                label="Từ ngày"
                onChange={newValue => {
                  setDateStart(new Date(newValue))
                }}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    size="medium"
                    variant="outlined"
                    fullWidth
                    color="primary"
                    autoComplete="bday"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dateEnd}
                label="Đến ngày"
                onChange={newValue => setDateEnd(new Date(newValue))}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    size="medium"
                    variant="outlined"
                    fullWidth
                    color="primary"
                    autoComplete="bday"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              justifyItems: 'baseline',
            }}
          >
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              style={{
                width: '100%',
                marginBottom: '3px',
                marginRight: '15px',
              }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
            <Button
              startIcon={<AutorenewIcon />}
              variant="contained"
              style={{
                width: '100%',
                marginBottom: '3px',
                marginRight: '15px',
              }}
              onClick={handleClearFilter}
            >
              Làm mới
            </Button>
            <Button
              startIcon={<SimCardDownloadIcon />}
              variant="contained"
              style={{
                width: '100%',
                marginBottom: '3px',
                marginRight: '15px',
              }}
            >
              Xuất Excel
            </Button>
          </Grid>
        </Grid>
      </SimpleCard>
      <div style={{ height: '30px' }} />
      <SimpleCard title="Danh sách khách hàng">
        {customers?.length === 0 && (
          <Typography color="gray" textAlign="center">
            Không có dữ liệu
          </Typography>
        )}
        <Box width="100%" overflow="auto" hidden={customers?.length === 0}>
          <StyledTable>
            <TableHead>
              <TableRow>
                {headTableAccount.map(header => (
                  <TableCell align="center" style={{ minWidth: header.width }}>
                    {header.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {customers && (
              <TableBody>
                {(customers || []).map((customer: any, index: any) => {
                  return (
                    <TableRow hover key={customer.idCustomer}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip
                          title="Xem chi tiết khách hàng"
                          placement="top"
                        >
                          <Link
                            to={`/customers/${customer.idCustomer}`}
                            style={{
                              wordBreak: 'keep-all',
                              color: '#1aa3ff',
                            }}
                          >
                            {customer.mobilePhone}
                          </Link>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip
                          title="Xem chi tiết khách hàng"
                          placement="top"
                        >
                          <Link
                            to={`/customers/${customer.idCustomer}`}
                            style={{
                              wordBreak: 'keep-all',
                              color: '#1aa3ff',
                            }}
                          >
                            {customer.email}
                          </Link>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                        <Tooltip
                          title="Xem chi tiết khách hàng"
                          placement="top"
                        >
                          <Link
                            to={`/customers/${customer.idCustomer}`}
                            style={{
                              wordBreak: 'keep-all',
                              color: '#1aa3ff',
                            }}
                          >
                            {customer.fullName}
                          </Link>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        {customer.customerType === 1 && (
                          <Chip label="Thường" color="success" />
                        )}
                        {customer.customerType === 2 && (
                          <Chip label="Fan" color="warning" />
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ wordBreak: 'keep-all' }}
                      >
                        {moment(customer.dateCreated).format(
                          'DD-MM-YYYY HH:ss',
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ wordBreak: 'keep-all' }}
                      >
                        {moment(customer.lastLogin).format('DD-MM-YYYY HH:ss')}
                      </TableCell>
                      <TableCell align="center">
                        {customer.status === 1 && (
                          <Chip label="Hoạt động" color="success" />
                        )}
                        {customer.status === -2 && (
                          <Chip label="Không hoạt động" color="warning" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Sửa" placement="top">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate(`/customers/${customer.idCustomer}`)
                            }
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            )}
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
    </Container>
  )
}
