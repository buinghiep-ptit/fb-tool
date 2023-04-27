import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
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
} from '@mui/material'
import { Box } from '@mui/system'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { getLeagues } from 'app/apis/leagues/leagues.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import dayjs from 'dayjs'
import * as React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { headTableMatches } from './const'

export interface Props {}

export default function MatchManager(props: Props) {
  const navigate = useNavigate()

  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [doRerender, setDoRerender] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [matches, setMatches] = useState<any>()
  const [leagues, setLeagues] = useState<any>()
  const [leagueOptions, setLeagueOption] = useState<any>()
  const [teamFilter, setTeamFilter] = useState('')
  const [leagueFilter, setLeagueFilter] = useState<any>()
  const [leagueFilterInput, setLeagueFilterInput] = useState('')
  const [statusFilter, setStatusFilter] = useState(99)
  const [fromFilter, setFromFilter] = useState<any>('')
  const [toFilter, setToFilter] = useState<any>('')
  const [cahnFilter, setCahnFilter] = useState(false)

  //autocomplete
  const [open, setOpen] = React.useState(false) // if dropdown open?
  const loading = open && leagues?.length === 0 // is it still loading
  // ====
  // TODO https://stackoverflow.com/questions/61970103/reactjs-update-options-by-hitting-api-on-every-input-change-in-autocomplete-co
  const fetchListLeagues = async () => {
    let active = true

    if (!loading) {
      return undefined
    }

    setIsLoading(true)
    await getLeagues({
      name: leagueFilter,
      page: 0,
      size: 100,
    })
      .then(res => {
        // setLeagues(res.content)
        if (active)
          setLeagueOption(
            res.content.map((item: any) => {
              return {
                id: item.id,
                label: item.name,
              }
            }),
          )
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })

    active = false
  }

  const fetchListMatches = async () => {
    setIsLoading(true)
    setMatches([
      {
        id: 1,
        teamName: 'CAHN - Nam Định',
        dateStart: '2023-04-25T08:36:59Z',
        leagueName: 'V.League 1',
        idLeague: 1,
        stadium: 'SVD Hàng Đẫy',
        status: 0,
      },
      {
        id: 1,
        teamName: 'Viettel - HAGL',
        dateStart: '2023-04-25T08:36:59Z',
        leagueName: 'V.League 2',
        idLeague: 1,
        stadium: 'SVD Hàng Đẫy',
        status: 1,
      },
      {
        id: 1,
        teamName: 'Bình Định - Thanh Hóa',
        dateStart: '2023-04-25T08:36:59Z',
        leagueName: 'V.League 1',
        idLeague: 1,
        stadium: 'SVD Quy Nhơn',
        status: 2,
      },
      {
        id: 1,
        teamName: 'Hồng Lĩnh Hà Tĩnh - Đà Nẵng',
        dateStart: '2023-04-25T08:36:59Z',
        leagueName: 'V.League 1',
        idLeague: 1,
        stadium: 'SVD Hà Tĩnh',
        status: 3,
      },
      {
        id: 1,
        teamName: 'Sông Lam Nghệ An - Bình Dương',
        dateStart: '2023-04-25T08:36:59Z',
        leagueName: 'Hạng Nhất Quốc Gia',
        idLeague: 1,
        stadium: 'SVD Vinh',
        status: 4,
      },
    ])
    setCountTable(5)
    // await getMatches({
    //   teamName: teamFilter,
    //   idLeague: leagueFilter,
    //   status: statusFilter === 99 ? null : statusFilter,
    //   dateStart: dayjs(fromFilter).format('YYYY-MM-DD'),
    //   dateEnd: dayjs(toFilter).format('YYYY-MM-DD'),
    //   isCahn: cahnFilter ? 1 : null, // todo pending api
    //   page: page,
    //   size: rowsPerPage,
    // })
    //   .then(res => {
    //     setMatches(res.content)
    //     setCountTable(res.totalElements)
    //   })
    //   .catch(() => {})
    //   .finally(() => {
    setIsLoading(false)
    //   })
  }

  const search = () => {
    setPage(0)
    setDoRerender(!doRerender)
  }

  const resetFilter = () => {
    setTeamFilter('')
    setLeagueFilter(null)
    setStatusFilter(99)
    setFromFilter('')
    setToFilter('')
    setCahnFilter(false)
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

  const onACInputChange = (event: any, value: any, reason: any) => {
    if (value) setLeagueFilter(value)
    else setLeagueFilter('')
  }

  React.useEffect(() => {
    fetchListLeagues()
  }, [loading])

  // React.useEffect(() => {
  //   fetchListLeagues()
  // }, [])

  React.useEffect(() => {
    fetchListMatches()
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
          routeSegments={[
            { name: 'Quản lý thông tin trận đấu', path: '/teams' },
          ]}
        />
      </Box>

      <Stack gap={3}>
        <SimpleCard>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                id="outlined-basic"
                label="Đội bóng tham gia"
                variant="outlined"
                fullWidth
                value={teamFilter}
                onChange={e => {
                  setTeamFilter(e.target.value)
                }}
                onKeyDown={async e => {
                  if (e.key === 'Enter') {
                    search()
                  }
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                open={open}
                onOpen={() => {
                  setOpen(true)
                }}
                onClose={() => {
                  setOpen(false)
                }}
                loading={loading}
                value={leagueFilter}
                onChange={(event: any, newValue: string | null) => {
                  setLeagueFilter(newValue)
                }}
                // inputValue={leagueFilterInput}
                // onInputChange={onACInputChange}
                id="leagueFilter"
                options={leagueOptions ?? []}
                renderInput={params => (
                  <TextField {...params} label="Giải đấu" />
                )}
              />
            </Grid>
            <Grid item xs={4}>
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
                  <MenuItem value={1}>Đang diễn ra</MenuItem>
                  <MenuItem value={0}>Chưa diễn ra</MenuItem>
                  <MenuItem value={3}>Hoãn</MenuItem>
                  <MenuItem value={2}>Kết thúc</MenuItem>
                  <MenuItem value={4}>Hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={5}>
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
                      margin="dense"
                      fullWidth
                      color="primary"
                      autoComplete="bday"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5}>
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
                      margin="dense"
                      fullWidth
                      color="primary"
                      autoComplete="bday"
                    />
                  )}
                />
              </Grid>
            </LocalizationProvider>
            <Grid item xs={2} textAlign="center">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100%"
              >
                <FormControlLabel
                  label="Trận CAHN tham gia"
                  control={
                    <Checkbox
                      checked={cahnFilter}
                      onChange={e => {
                        setCahnFilter(e.target.checked)
                      }}
                    />
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={8}></Grid>
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
        <SimpleCard title="Danh sách thông tin trận đấu">
          <Box width="100%" overflow="auto">
            <StyledTable>
              <TableHead>
                <TableRow>
                  {headTableMatches.map(header => (
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
                {(matches || []).map((match: any, index: any) => {
                  return (
                    <TableRow hover key={match.teamName}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          color="info"
                          onClick={() => {
                            navigate('/matches/' + match.id)
                          }}
                        >
                          {match.teamName}
                        </Button>
                      </TableCell>
                      <TableCell align="left">
                        {dayjs(match.dateStart).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          color="info"
                          onClick={() => {
                            navigate('/leagues/' + match.idLeague)
                          }}
                        >
                          {match.leagueName}
                        </Button>
                      </TableCell>
                      <TableCell align="left"> {match.stadium} </TableCell>
                      <TableCell align="center">
                        {match.status === 0 && (
                          <Chip
                            label="Chưa diễn ra"
                            style={{ background: 'orange', color: 'white' }}
                          />
                        )}
                        {match.status === 1 && (
                          <Chip
                            label="Đang diễn ra"
                            style={{
                              background: 'limegreen',
                              color: 'white',
                            }}
                          />
                        )}
                        {match.status === 2 && (
                          <Chip
                            label="Kết thúc"
                            style={{ background: 'royalBlue', color: 'white' }}
                          />
                        )}
                        {match.status === 3 && (
                          <Chip
                            label="Hoãn"
                            style={{ background: 'gray', color: 'white' }}
                          />
                        )}
                        {match.status === 4 && (
                          <Chip
                            label="Hủy"
                            style={{ background: 'red', color: 'white' }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa" placement="top">
                          <IconButton
                            onClick={() => {
                              navigate('/matches/' + match.id)
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
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
      </Stack>
    </Container>
  )
}
