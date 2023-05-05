import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import {
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
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import dayjs from 'dayjs'
import * as React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LeagueSelect from '../../../components/DynamicAutocomplete/LeagueSelect'
import {
  MATCH_STATUSES,
  findMatchStatus,
} from '../../../constants/matchStatuses'
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
  const [teamFilter, setTeamFilter] = useState('')
  const [leagueFilter, setLeagueFilter] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState(99)
  const [fromFilter, setFromFilter] = useState<any>('')
  const [toFilter, setToFilter] = useState<any>('')
  const [cahnFilter, setCahnFilter] = useState(false)

  const fetchListMatches = async () => {
    // TODO mocking data
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
    // setIsLoading(true)
    // await getMatches({
    //   teamName: teamFilter,
    //   idLeague: leagueFilter,
    //   status: statusFilter === 99 ? null : statusFilter,
    //   dateStart:
    //     fromFilter && dayjs(fromFilter).isValid()
    //       ? dayjs(fromFilter).toISOString()
    //       : '',
    //   dateEnd:
    //     toFilter && dayjs(toFilter).isValid()
    //       ? dayjs(toFilter).toISOString()
    //       : '',
    //   isCahn: cahnFilter ? 1 : null, // TODO pending api
    //   page: page,
    //   size: rowsPerPage,
    // })
    //   .then(res => {
    //     setMatches(res.content)
    //     setCountTable(res.totalElements)
    //   })
    //   .catch(() => {})
    //   .finally(() => {
    //     setIsLoading(false)
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

      <Stack gap={1}>
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
              <LeagueSelect
                label="Giải đấu"
                leagueFilter={leagueFilter}
                setLeagueFilter={setLeagueFilter}
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
                  {Object.values(MATCH_STATUSES).map((type, index) => {
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
              <Grid item xs={4}>
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
              <Grid item xs={4}>
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
            <Grid item xs={4} textAlign="left">
              <Box
                display="flex"
                justifyContent="start"
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
          {matches?.length === 0 && (
            <Typography color="gray" textAlign="center">
              Không có dữ liệu
            </Typography>
          )}
          <Box width="100%" overflow="auto" hidden={matches?.length === 0}>
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
                        <Chip
                          label={findMatchStatus(match.status)?.label}
                          style={{
                            background: findMatchStatus(match.status)
                              ?.background,
                            color: findMatchStatus(match.status)?.color,
                          }}
                        />
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