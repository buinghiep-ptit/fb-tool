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
import { getNews } from 'app/apis/news/news.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { WEB_DOMAIN } from 'app/constants'
import { NEWS_TYPES, findNewsType } from 'app/constants/newsType'
import dayjs from 'dayjs'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { headTableNews } from './const'

export interface Props {}

export default function NewsManager(props: Props) {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = React.useState(false)
  const [page, setPage] = React.useState(0)
  const [countTable, setCountTable] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(20)
  const [doRerender, setDoRerender] = React.useState(false)

  const [news, setNews] = React.useState<any>()
  const [searchFilter, setSearchFilter] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState(99)
  const [statusFilter, setStatusFilter] = React.useState(99)
  const [fromFilter, setFromFilter] = React.useState<string | null>('')
  const [toFilter, setToFilter] = React.useState<string | null>('')

  const fetchListNews = async () => {
    setIsLoading(true)
    await getNews({
      title: searchFilter,
      status: statusFilter === 99 ? null : statusFilter,
      newCategory: typeFilter === 99 ? null : typeFilter,
      dateStart:
        fromFilter && dayjs(fromFilter).isValid()
          ? dayjs(fromFilter).toISOString()
          : '',
      dateEnd:
        toFilter && dayjs(toFilter).isValid()
          ? dayjs(toFilter).toISOString()
          : '',
      page: page,
      size: rowsPerPage,
    }).then(res => {
      setNews(res.content)
      setCountTable(res.totalElements)
    })
    setIsLoading(false)
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
    fetchListNews()
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
          routeSegments={[{ name: 'Quản lý tin tức', path: '/news' }]}
        />
      </Box>

      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Thêm tin"
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => navigate('/news/create')}
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
                  Loại tin tức
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Loại tin tức"
                  value={typeFilter}
                  onChange={e => {
                    setTypeFilter(e.target.value as number)
                  }}
                >
                  <MenuItem value={99}>Tất cả</MenuItem>
                  {Object.values(NEWS_TYPES).map((type, index) => {
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
                  <MenuItem value={0}>Chưa đăng</MenuItem>
                  <MenuItem value={1}>Đã đăng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={3}>
                <DatePicker
                  label="Từ ngày"
                  value={fromFilter}
                  onChange={newValue => setFromFilter(newValue)}
                  inputFormat="DD/MM/YYYY"
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
                  inputFormat="DD/MM/YYYY"
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
          {news?.length === 0 && (
            <Typography color="gray" textAlign="center">
              Không có dữ liệu
            </Typography>
          )}
          <Box width="100%" overflow="auto" hidden={news?.length === 0}>
            <StyledTable>
              <TableHead>
                <TableRow>
                  {headTableNews.map(header => (
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
                {(news || []).map((news: any, index: any) => {
                  return (
                    <TableRow hover key={index}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          color="info"
                          onClick={() => {
                            navigate('/news/' + news.id)
                          }}
                        >
                          {news.title}
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        {news.priority && (
                          <Badge badgeContent={news.priority}>
                            <WhatshotIcon />
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {findNewsType(news.newsCategory)?.label}
                      </TableCell>
                      <TableCell align="left">
                        {news.dateCreated
                          ? dayjs(news.dateCreated).format('DD/MM/YYYY HH:mm')
                          : ''}
                      </TableCell>
                      <TableCell align="left">
                        {news.datePublished
                          ? dayjs(news.datePublished).format('DD/MM/YYYY HH:mm')
                          : ''}
                      </TableCell>
                      <TableCell align="center">
                        {news.status === 1 ? 'Đã đăng' : 'Chưa đăng'}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa" placement="top">
                          <IconButton
                            onClick={() => {
                              navigate('/news/' + news.id)
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title="Sao chép địa chỉ tin tức"
                          placement="top"
                        >
                          <IconButton
                            onClick={() => {
                              navigator.clipboard.writeText(
                                WEB_DOMAIN + '/news/' + news.id,
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
