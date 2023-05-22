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
import { getMatches } from 'app/apis/matches/matches.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import dayjs from 'dayjs'
import * as React from 'react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import LeagueSelect from '../../../components/DynamicAutocomplete/LeagueSelect'
import {
  MATCH_STATUSES,
  findMatchStatus,
} from '../../../constants/matchStatuses'
import { headTableMatches } from './const'

export interface Props {}

export default function MatchManager(props: Props) {
  const navigate = useNavigate()

  const [countTable, setCountTable] = useState(0)
  const [doRerender, setDoRerender] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [matches, setMatches] = useState<any>()

  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(Number(searchParams.get('page')) || 0)
  const [rowsPerPage, setRowsPerPage] = useState(
    Number(searchParams.get('size')) || 20,
  )
  const [teamFilter, setTeamFilter] = useState(
    searchParams.get('teamName') || '',
  )
  const [leagueFilter, setLeagueFilter] = useState<any>(
    Number(searchParams.get('idLeague')) || null,
  )
  const [statusFilter, setStatusFilter] = useState(
    Number(searchParams.get('status')) || 99,
  )
  const [fromFilter, setFromFilter] = useState<any>(
    searchParams.get('from') || '',
  )
  const [toFilter, setToFilter] = useState<any>(searchParams.get('to') || '')
  const [cahnFilter, setCahnFilter] = useState(
    Number(searchParams.get('isCahnfc')) === 1 ? true : false,
  )

  const fetchListMatches = async () => {
    setIsLoading(true)

    const params: any = {
      teamName: teamFilter ? teamFilter.trim() : null,
      idLeague: leagueFilter?.id ?? null,
      status: statusFilter === 99 ? null : statusFilter,
      from:
        fromFilter && dayjs(fromFilter).isValid()
          ? dayjs(fromFilter).format('YYYY-MM-DD')
          : null,
      to:
        toFilter && dayjs(toFilter).isValid()
          ? dayjs(toFilter).format('YYYY-MM-DD')
          : null,
      isCahnfc: cahnFilter ? 1 : 0,
      page: page,
      size: rowsPerPage,
    }
    Object.keys(params).forEach(k => params[k] == null && delete params[k])

    setSearchParams(prevParams => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        ...params,
      })
    })

    await getMatches(params)
      .then(res => {
        setMatches(res.content)
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
              <LeagueSelect
                label="Giải đấu"
                selectedLeague={leagueFilter}
                setSelectedLeague={setLeagueFilter}
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
                      margin="dense"
                      fullWidth
                      color="primary"
                      autoComplete="bday"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
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
                      margin="dense"
                      fullWidth
                      color="primary"
                      autoComplete="bday"
                    />
                  )}
                />
              </Grid>
            </LocalizationProvider>
            <Grid item xs={12} md={4} textAlign="left">
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
              xs={12}
              md={2}
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
              xs={12}
              md={2}
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
              Không có kết quả thỏa mãn điều kiện tìm kiếm
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
                    <TableRow hover key={index}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell align="left">
                        <Link
                          to={`/matches/${match.id}`}
                          style={{
                            color: '#2196F3',
                            wordBreak: 'keep-all',
                          }}
                        >
                          {' '}
                          {match.teamName}
                        </Link>
                      </TableCell>
                      <TableCell align="left">
                        {dayjs(match.dateStart).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell align="left">
                        <Link
                          to={`/leagues/${match.idLeague}`}
                          style={{
                            color: '#2196F3',
                            wordBreak: 'keep-all',
                          }}
                        >
                          {' '}
                          {match.leagueName}
                        </Link>
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
