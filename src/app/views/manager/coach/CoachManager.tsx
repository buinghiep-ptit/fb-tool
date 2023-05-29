import { Edit } from '@mui/icons-material'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import CachedIcon from '@mui/icons-material/Cached'
import SearchIcon from '@mui/icons-material/Search'
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload'
import {
  Button,
  Chip,
  FormControl,
  FormHelperText,
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
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { getCoachPosition, getCoachs } from 'app/apis/coachs/coachs.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import { toastError } from 'app/helpers/toastNofication'
import { ExportToExcel } from 'app/utils/exportFile'
import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { headTableCoachs } from './const'

const convertToXlsxData = (data: any): any[] => {
  return data
    .map((item: any, index: any) => ({
      ...item,
      index,
      status: item.status === 1 ? 'Hoạt động' : 'Không hoạt động',
    }))
    .map((item: any) => ({
      ['STT']: item.index + 1 + '',
      ['Tên BHL']: item.name,
      ['Vị trí']: item.position,
      ['Quê quán']: item.placeOfOrigin,
      ['Ngày sinh']: item.birthday,
      ['Ngày tham gia CAHN']: item.dateJoin,
      ['Trạng thái']: item.status,
    })) as any
}

export interface Props {}

export default function CoachManager(props: Props) {
  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [coaches, setCoaches] = useState<any>()
  const [nameFilter, setNameFilter] = useState<any>('')
  const [statusFilter, setStatusFilter] = useState<any>(2)
  const [type, setType] = useState<any>(99)
  const [from, setFrom] = useState<any>(null)
  const [to, setTo] = useState<any>(null)
  const [positions, setPositions] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [doRerender, setDoRerender] = React.useState(false)
  const [isValid, setIsValid] = useState(true)
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

  const fetchCoaches = async () => {
    setIsLoading(true)
    const res = await getCoachs({
      name: nameFilter.trim(),
      position: type === 99 ? null : type,
      status: statusFilter === 2 ? null : statusFilter,
      dateStart:
        moment(from).format('YYYY-MM-DD') === 'Invalid date'
          ? null
          : moment(new Date(from)).format('YYYY-MM-DD'),
      dateEnd:
        moment(to).format('YYYY-MM-DD') === 'Invalid date'
          ? null
          : moment(new Date(to)).format('YYYY-MM-DD'),
      size: rowsPerPage,
      page: page,
    })
    setCoaches(res.content)
    setCountTable(res.totalElements)
    setIsLoading(false)
  }

  const handleExportExcel = async () => {
    setIsLoading(true)
    await getCoachs({
      name: nameFilter.trim(),
      position: type === 99 ? null : type,
      status: statusFilter === 2 ? null : statusFilter,
      dateStart:
        moment(from).format('YYYY-MM-DD') === 'Invalid date'
          ? null
          : moment(new Date(from)).format('YYYY-MM-DD'),
      dateEnd:
        moment(to).format('YYYY-MM-DD') === 'Invalid date'
          ? null
          : moment(new Date(to)).format('YYYY-MM-DD'),
      page: 0,
      size: countTable ?? 0,
    })
      .then(result => {
        ExportToExcel(
          convertToXlsxData(result?.content ?? []),
          'Danh_Sach_BHL_',
        )
      })
      .catch(() => {
        toastError({ message: 'Có lỗi xảy ra vui lòng thử lại!' })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleSearch = async () => {
    setPage(0)
    setDoRerender(!doRerender)
  }

  const fetchPositions = async () => {
    const res = await getCoachPosition({ size: 1000, page: 0 })
    setPositions(res.content)
  }

  const handleClearFilter = async () => {
    setNameFilter('')
    setTo(null)
    setStatusFilter(2)
    setType(99)
    setFrom(null)
    setDoRerender(!doRerender)
  }

  React.useEffect(() => {
    fetchCoaches()
    fetchPositions()
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box className="breadcrumb">
          <Breadcrumb routeSegments={[{ name: 'Quản lý ban huấn luyện' }]} />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddBoxOutlinedIcon />}
          style={{ width: '200px', margin: '15px 0', height: '52px' }}
          onClick={() => navigate('/coachs/create')}
        >
          Thêm mới BHL
        </Button>
      </div>
      <SimpleCard>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              id="name1"
              label="Tên ban huấn luyện"
              variant="outlined"
              fullWidth
              onChange={e => {
                setNameFilter(e.target.value)
              }}
              value={nameFilter}
              onKeyDown={async e => {
                if (e.keyCode === 13) {
                  handleSearch()
                }
              }}
            />
          </Grid>

          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Vị trí</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Vị trí"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <MenuItem value={99}>Tất cả</MenuItem>
                {(positions || []).map((item: any) => (
                  <MenuItem value={item.id}>{item.description}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={from}
                label="Từ ngày"
                onChange={newValue => setFrom(newValue)}
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
                value={to}
                label="Đến ngày"
                onChange={newValue => {
                  setIsValid(new Date(newValue) > new Date(from))
                  setTo(newValue)
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
            {!isValid ? (
              <FormHelperText style={{ color: 'red' }}>
                Chọn ngày sau 'từ ngày'
              </FormHelperText>
            ) : (
              ''
            )}
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Trạng thái"
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value)
                }}
              >
                <MenuItem value={2}>Tất cả</MenuItem>
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={-2}>Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={9} style={{ textAlign: 'end' }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              style={{ marginRight: '15px', height: '50px' }}
              disabled={isLoading}
            >
              Tìm kiếm
            </Button>
            <Button
              variant="contained"
              startIcon={<CachedIcon />}
              onClick={handleClearFilter}
              disabled={isLoading}
              style={{ marginRight: '15px', height: '50px' }}
            >
              Làm mới
            </Button>
            <Button
              startIcon={<SimCardDownloadIcon />}
              variant="contained"
              disabled={isLoading}
              style={{ marginRight: '15px', height: '50px' }}
              onClick={handleExportExcel}
            >
              Xuất Excel
            </Button>
          </Grid>
        </Grid>
      </SimpleCard>
      <div style={{ height: '30px' }} />
      <SimpleCard title="Danh sách BHL">
        {coaches?.length === 0 && (
          <Typography color="gray" textAlign="center">
            Không có dữ liệu
          </Typography>
        )}
        <Box width="100%" overflow="auto" hidden={coaches?.length === 0}>
          <StyledTable>
            <TableHead>
              <TableRow>
                {headTableCoachs.map(header => (
                  <TableCell align="center" style={{ minWidth: header.width }}>
                    {header.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {coaches && (
              <TableBody>
                {(coaches || []).map((coach: any, index: any) => {
                  return (
                    <TableRow hover key={coach.id}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell align="left">
                        <Link to="#" style={{ wordBreak: 'keep-all' }}>
                          {coach.name}
                        </Link>
                      </TableCell>
                      <TableCell align="center">{coach.position}</TableCell>
                      <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                        {coach.placeOfOrigin}
                      </TableCell>
                      <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                        {coach.birthday}
                      </TableCell>
                      <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                        {coach.dateJoin}
                      </TableCell>
                      <TableCell align="center">
                        {coach.status === 1 && (
                          <Chip label="Hoạt động" color="success" />
                        )}
                        {coach.status === -2 && (
                          <Chip label="Không hoạt động" color="warning" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Sửa" placement="top">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/coachs/${coach.id}`)}
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
        </Box>
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
      </SimpleCard>
    </Container>
  )
}
