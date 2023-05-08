import { RemoveCircle } from '@mui/icons-material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import {
  Badge,
  Box,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
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
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { red } from '@mui/material/colors'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { getNews } from 'app/apis/news/news.service'
import { SimpleCard, StyledTable } from 'app/components'
import { NEWS_TYPES, findNewsType } from 'app/constants/newsType'
import dayjs from 'dayjs'
import { remove } from 'lodash'
import * as React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { headTableNews } from './headTableNews'

const Transition = React.forwardRef(function Transition(
  props: any & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return (
    <Slide direction="up" ref={ref} {...props}>
      {}
    </Slide>
  )
})

interface Props {
  label: any
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  selectedList: any
  setSelectedList: React.Dispatch<React.SetStateAction<any>>
}

const DialogSelectNews = React.forwardRef((props: Props, ref) => {
  const { label, isLoading, setIsLoading, selectedList, setSelectedList } =
    props

  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false)

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
          ? dayjs(fromFilter).format('YYYY-MM-DD')
          : '',
      dateEnd:
        toFilter && dayjs(toFilter).isValid()
          ? dayjs(toFilter).format('YYYY-MM-DD')
          : '',
      page: page,
      size: rowsPerPage,
    }).then(res => {
      const newList = res.content.map((item: any) => {
        item.isPicked = (selectedList || [])
          .map((i: any) => i.id + '')
          .includes(item.id + '')
        return item
      })
      setNews(newList)

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

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
    },
  }))

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (open) {
      const newList = news.map((item: any) => {
        item.isPicked = (selectedList || [])
          .map((i: any) => i.id + '')
          .includes(item.id + '')
        return item
      })
      setNews(newList)
    }
  }, [open])

  const handlePick = (id: number) => {
    const newList = [...news]
    if (newList[id].isPicked) {
      const newListPicked = remove(selectedList, function (n) {
        return n !== newList[id].id
      })
      setSelectedList(newListPicked)
    } else {
      const newListPicked = [
        ...selectedList,
        {
          id: newList[id].id,
          label: newList[id].title,
        },
      ]
      setSelectedList(newListPicked)
    }

    newList[id].isPicked = !news[id].isPicked
    setNews(newList)
  }

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>{label}</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Container>
            <Stack>
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
                          <TableRow hover key={news.id}>
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
                              {dayjs(news.dateCreated).format(
                                'DD/MM/YYYY HH:mm',
                              )}
                            </TableCell>
                            <TableCell align="left">
                              {dayjs(news.datePublished).format(
                                'DD/MM/YYYY HH:mm',
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {news.status === 1 ? 'Đã đăng' : 'Chưa đăng'}
                            </TableCell>
                            <TableCell align="center">
                              {!news.isPicked ? (
                                <Tooltip title="Thêm" placement="top">
                                  <IconButton onClick={() => handlePick(index)}>
                                    <AddCircleIcon sx={{ color: red[500] }} />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Loại" placement="top">
                                  <IconButton onClick={() => handlePick(index)}>
                                    <RemoveCircle sx={{ color: red[500] }} />
                                  </IconButton>
                                </Tooltip>
                              )}
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
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default DialogSelectNews
