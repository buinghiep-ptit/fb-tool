import EditIcon from '@mui/icons-material/Edit'
import LinkIcon from '@mui/icons-material/Link'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import {
  Badge,
  Box,
  FormControl,
  Grid,
  Icon,
  IconButton,
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
  Tooltip,
  Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { getVideos } from 'app/apis/videos/video.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { WEB_DOMAIN } from 'app/constants'
import { VIDEO_TYPES, findVideoType } from 'app/constants/videoTypes'
import { createSlugName } from 'app/utils/common'
import dayjs from 'dayjs'
import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { headTableVideos } from './const'

export interface Props {}

export default function VideoManager(props: Props) {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = React.useState(false)
  const [page, setPage] = React.useState(0)
  const [countTable, setCountTable] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(20)
  const [doRerender, setDoRerender] = React.useState(false)

  const [videos, setVideos] = React.useState<any>()
  const [searchFilter, setSearchFilter] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState(99)
  const [statusFilter, setStatusFilter] = React.useState(99)
  const [fromFilter, setFromFilter] = React.useState<string | null>('')
  const [toFilter, setToFilter] = React.useState<string | null>('')

  const fetchListVideo = async () => {
    setIsLoading(true)
    await getVideos({
      search: searchFilter,
      status: statusFilter === 99 ? null : statusFilter,
      type: typeFilter === 99 ? null : typeFilter,
      dateStart:
        fromFilter && dayjs(fromFilter).isValid()
          ? dayjs(fromFilter).format('YYYY-MM-DD')
          : '',
      dateEnd:
        toFilter && dayjs(toFilter).isValid()
          ? dayjs(toFilter).format('YYYY-MM-DD')
          : '',
      page: page,
      size: rowsPerPage,
    })
      .then(res => {
        setVideos(res.content)
        setCountTable(res.totalElements)
      })
      .finally(() => setIsLoading(false))
  }

  const search = () => {
    setPage(0)
    setDoRerender(!doRerender)
  }

  const resetFilter = () => {
    setSearchFilter('')
    setStatusFilter(99)
    setTypeFilter(99)
    setFromFilter('')
    setToFilter('')
    setRowsPerPage(20)
    setPage(0)
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

  React.useEffect(() => {
    fetchListVideo()
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
          routeSegments={[{ name: 'Quản lý CAHN TV', path: '/cahntv' }]}
        />
      </Box>

      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Thêm video"
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => navigate('/cahntv/create')}
          startIcon={<Icon>control_point</Icon>}
        />
      </Stack>

      <Stack gap={1}>
        <SimpleCard>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="outlined-basic"
                label="Tiêu đề, tóm tắt, từ khóa"
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
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Loại video
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Loại video"
                  value={typeFilter}
                  onChange={e => {
                    setTypeFilter(e.target.value as number)
                  }}
                >
                  <MenuItem value={99}>Tất cả</MenuItem>
                  {Object.values(VIDEO_TYPES).map((type, index) => {
                    return (
                      <MenuItem key={index} value={type.id}>
                        {type.label}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
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
                  <MenuItem value={-1}>Không hoạt động</MenuItem>
                  <MenuItem value={1}>Hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={3}>
                <DatePicker
                  label="Từ ngày"
                  inputFormat="DD/MM/YYYY"
                  key={fromFilter}
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
                  inputFormat="DD/MM/YYYY"
                  key={toFilter}
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
          {videos?.length === 0 && (
            <Typography color="gray" textAlign="center">
              Không có dữ liệu
            </Typography>
          )}
          <Box width="100%" overflow="auto" hidden={videos?.length === 0}>
            <StyledTable>
              <TableHead>
                <TableRow>
                  {headTableVideos.map(header => (
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
                {(videos || []).map((video: any, index: any) => {
                  return (
                    <TableRow hover key={video.id}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell align="left">
                        <Link
                          to={`/cahntv/${video.id}`}
                          style={{
                            color: '#2196F3',
                            wordBreak: 'keep-all',
                          }}
                        >
                          {video.title}
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        {video.priority && (
                          <Badge badgeContent={video.priority}>
                            <WhatshotIcon />
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {findVideoType(video.type)?.label}
                      </TableCell>
                      <TableCell align="left">
                        {dayjs(video.dateCreated).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell align="center">
                        {video.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa" placement="top">
                          <IconButton
                            onClick={() => {
                              navigate('/cahntv/' + video.id)
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sao chép địa chỉ video" placement="top">
                          <IconButton
                            onClick={() => {
                              navigator.clipboard.writeText(
                                WEB_DOMAIN +
                                  '/videos/' +
                                  createSlugName(video.title, video.id),
                              )
                            }}
                          >
                            <LinkIcon />
                          </IconButton>
                        </Tooltip>
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
