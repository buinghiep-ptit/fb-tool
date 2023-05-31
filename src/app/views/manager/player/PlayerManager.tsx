import { Edit } from '@mui/icons-material'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import CachedIcon from '@mui/icons-material/Cached'
import SearchIcon from '@mui/icons-material/Search'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { deleteLeagues } from 'app/apis/leagues/leagues.service'
import { getListPlayer, getTeams } from 'app/apis/players/players.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import { toastError, toastSuccess } from 'app/helpers/toastNofication'
import { ExportToExcel } from 'app/utils/exportFile'
import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { headTablePlayer } from './const'

const convertToXlsxData = (data: any): any[] => {
  return data
    .map((item: any, index: any) => ({
      ...item,
      index,
      status: item.status === 1 ? 'Hoạt động' : 'Không hoạt động',
    }))
    .map((item: any) => ({
      ['STT']: item.index + 1 + '',
      ['Tên cầu thủ']: item.name,
      ['Vị trí']: item.position,
      ['Đội thi đấu']: item.idTeam,
      ['Ngày sinh']: item.dateOfBirth,
      ['Chiều cao (cm)']: item.height,
      ['Ngày tham gia CAHN']: item.dateJoined,
      ['Trạng thái']: item.status,
    })) as any
}

export interface Props {}

export default function PlayerManager(props: Props) {
  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [players, setPlayers] = useState<any>()
  const [teams, setTeams] = useState<any>(null)
  const [nameFilter, setNameFilter] = useState<any>('')
  const [statusFilter, setStatusFilter] = useState<any>(99)
  const [teamFilter, setTeamFilter] = useState<any>('')
  const [positionFilter, setPositionFilter] = useState<any>(null)
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

  const fetchTeams = async () => {
    const res = await getTeams()
    setTeams(res)
  }

  const fetchPlayer = async () => {
    setIsLoading(true)
    try {
      const res = await getListPlayer({
        name: nameFilter.trim(),
        position: positionFilter,
        status: statusFilter === 99 ? null : statusFilter,
        dateStart:
          moment(dateStart).format('YYYY-MM-DD') === 'Invalid date'
            ? null
            : moment(dateStart).format('YYYY-MM-DD'),
        dateEnd:
          moment(dateEnd).format('YYYY-MM-DD') === 'Invalid date'
            ? null
            : moment(dateEnd).format('YYYY-MM-DD'),
        team: teamFilter === 99 ? null : teamFilter,
        size: rowsPerPage,
        page: page,
      })
      setPlayers(res.content)
      setCountTable(res.totalElements)
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    setPage(0)
    setDoRerender(!doRerender)
  }

  const handleClearFilter = async () => {
    setNameFilter('')
    setTeamFilter('')
    setStatusFilter(99)
    setPositionFilter(null)
    setDateEnd(null)
    setDateStart(null)
    setDoRerender(!doRerender)
  }

  const handleDeletePlayer = async (id: any) => {
    const res = await deleteLeagues(id)
    if (res) {
      toastSuccess({
        message: 'Xóa thành công',
      })
      setDoRerender(!doRerender)
    }
  }

  React.useEffect(() => {
    fetchPlayer()
    fetchTeams()
  }, [page, doRerender])

  const handleExportExcel = async () => {
    setIsLoading(true)
    await getListPlayer({
      name: nameFilter.trim(),
      position: positionFilter,
      status: statusFilter === 99 ? null : statusFilter,
      dateStart:
        moment(dateStart).format('YYYY-MM-DD') === 'Invalid date'
          ? null
          : moment(dateStart).format('YYYY-MM-DD'),
      dateEnd:
        moment(dateEnd).format('YYYY-MM-DD') === 'Invalid date'
          ? null
          : moment(dateEnd).format('YYYY-MM-DD'),
      team: teamFilter === 99 ? null : teamFilter,
      page: 0,
      size: countTable ?? 0,
    })
      .then(result => {
        ExportToExcel(
          convertToXlsxData(result?.content ?? []),
          'Danh_Sach_Cau_Thu_',
        )
      })
      .catch(() => {
        toastError({ message: 'Có lỗi xảy ra vui lòng thử lại!' })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

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
          <Breadcrumb routeSegments={[{ name: 'Quản lý cầu thủ' }]} />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddBoxOutlinedIcon />}
          style={{ width: '200px', margin: '15px 0', height: '52px' }}
          onClick={() => navigate('/players/create')}
        >
          Thêm mới cầu thủ
        </Button>
      </div>
      <SimpleCard>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              id="name1"
              label="Tên cầu thủ"
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
              <InputLabel id="demo-simple-select-label">Vị trí</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Vị trí"
                value={positionFilter}
                onChange={e => {
                  setPositionFilter(e.target.value)
                }}
              >
                <MenuItem value={99}>Tất cả</MenuItem>
                <MenuItem value={1}>Thủ môn</MenuItem>
                <MenuItem value={2}>Hậu vệ</MenuItem>
                <MenuItem value={3}>Tiền vệ</MenuItem>
                <MenuItem value={4}>Tiền đạo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                inputFormat="DD/MM/YYYY"
                value={dateStart}
                label="Từ ngày"
                onChange={newValue => {
                  if (new Date(newValue).toString() === 'Invalid Date') {
                    setDateStart(null)
                  } else {
                    setDateStart(new Date(newValue))
                  }
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
                inputFormat="DD/MM/YYYY"
                onChange={newValue => {
                  if (new Date(newValue).toString() === 'Invalid Date') {
                    setDateEnd(null)
                  } else {
                    setDateEnd(new Date(newValue))
                  }
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Trạng thái"
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value)
                }}
              >
                <MenuItem value={99}>Tất cả</MenuItem>
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={-2}>Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Đội thi đấu</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Đội thi đấu"
                value={teamFilter}
                onChange={e => {
                  setTeamFilter(e.target.value)
                }}
              >
                <MenuItem value={99}>Tất cả</MenuItem>
                {teams &&
                  teams.map((team: any) => (
                    <MenuItem value={team.id}>{team.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              style={{ marginRight: '15px', padding: '13px' }}
              disabled={isLoading}
            >
              Tìm kiếm
            </Button>
            <Button
              variant="contained"
              startIcon={<CachedIcon />}
              onClick={handleClearFilter}
              style={{ marginRight: '15px', padding: '13px' }}
              disabled={isLoading}
            >
              Làm mới
            </Button>
            <Button
              variant="contained"
              startIcon={<CachedIcon />}
              onClick={handleExportExcel}
              disabled={isLoading}
              style={{ marginRight: '15px', padding: '13px' }}
            >
              Xuất Excel
            </Button>
          </Grid>
        </Grid>
      </SimpleCard>
      <div style={{ height: '30px' }} />
      <SimpleCard title="Danh sách cầu thủ">
        {players?.length === 0 && (
          <Typography color="gray" textAlign="center">
            Không có dữ liệu
          </Typography>
        )}
        <Box width="100%" overflow="auto" hidden={players?.length === 0}>
          <StyledTable>
            <TableHead>
              <TableRow>
                {headTablePlayer.map(header => (
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
            {players && (
              <TableBody>
                {(players || []).map((player: any, index: any) => {
                  return (
                    <TableRow hover key={player.id}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell align="center">
                        {player.priority && (
                          <div
                            style={{
                              wordBreak: 'keep-all',
                              display: 'flex',
                              alignItems: 'center',
                              position: 'relative',
                            }}
                          >
                            <StarRoundedIcon
                              style={{ fontSize: '40px' }}
                            ></StarRoundedIcon>
                            <p
                              style={{
                                position: 'absolute',
                                color: 'white',
                                left: '14px',
                              }}
                            >
                              {player.priority}
                            </p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        <Link
                          to={`/players/${player.id}`}
                          style={{
                            wordBreak: 'keep-all',
                          }}
                        >
                          {player.name}
                        </Link>
                      </TableCell>
                      <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                        {player.position}
                      </TableCell>
                      <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                        {player.idTeam}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ wordBreak: 'keep-all' }}
                      >
                        {player.dateOfBirth}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ wordBreak: 'keep-all' }}
                      >
                        {player.height}
                      </TableCell>
                      <TableCell align="center">{player.dateJoined}</TableCell>
                      <TableCell align="center">
                        {player.status === 1 && (
                          <Chip label="Hoạt động" color="success" />
                        )}
                        {player.status === -2 && (
                          <Chip label="Không hoạt động" color="warning" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Sửa" placement="top">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/players/${player.id}`)}
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
