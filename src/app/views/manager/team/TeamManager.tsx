import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Switch,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { red } from '@mui/material/colors'
import { Box } from '@mui/system'
import { getTeams } from 'app/apis/teams/teams.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import * as React from 'react'
import { useState } from 'react'
import DialogCreateTeam from './DialogCreateTeam'
import DialogDeleteTeam from './DialogDeleteTeam'
import DialogUpdateTeam from './DialogUpdateTeam'
import DialogUpdateTeamStatus from './DialogUpdateTeamStatus'
import { headTableTeams } from './const'

export interface Props {}

export default function TeamManager(props: Props) {
  const dialogCreateTeamRef = React.useRef<any>(null)
  const dialogUpdateTeamRef = React.useRef<any>(null)
  const dialogUpdateTeamStatusRef = React.useRef<any>(null)
  const dialogDeleteTeamRef = React.useRef<any>(null)
  const [focusedTeam, setFocusedTeam] = useState<any>()

  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [doRerender, setDoRerender] = useState(false)

  const [teams, setTeams] = useState<any>()
  const [nameFilter, setNameFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState(99)
  const [typeFilter, setTypeFilter] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const fetchListTeam = async () => {
    setIsLoading(true)
    await getTeams({
      q: nameFilter,
      status: statusFilter === 99 ? null : statusFilter,
      type: typeFilter ? 1 : null,
      page: page,
      size: rowsPerPage,
    })
      .then(res => {
        setTeams(res.content)
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
    setNameFilter('')
    setStatusFilter(99)
    setTypeFilter(false)
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
    fetchListTeam()
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
            { name: 'Quản lý thông tin các đội bóng', path: '/teams' },
          ]}
        />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Thêm mới đội bóng"
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => dialogCreateTeamRef?.current.handleClickOpen()}
          startIcon={<Icon>control_point</Icon>}
        />
      </Stack>

      <Stack gap={3}>
        <SimpleCard>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <TextField
                id="outlined-basic"
                label="Tên đội bóng"
                variant="outlined"
                fullWidth
                value={nameFilter}
                onChange={e => {
                  setNameFilter(e.target.value)
                }}
                onKeyDown={async e => {
                  if (e.key === 'Enter') {
                    search()
                  }
                }}
              />
            </Grid>
            <Grid item xs={5}>
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
            <Grid item xs={2} textAlign="center">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100%"
              >
                <FormControlLabel
                  label="Thuộc CAHN"
                  control={
                    <Checkbox
                      checked={typeFilter}
                      onChange={e => {
                        setTypeFilter(e.target.checked)
                      }}
                    />
                  }
                />
              </Box>
            </Grid>
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
        <SimpleCard title="Danh sách các đội bóng">
          {teams?.length === 0 && (
            <Typography color="gray" textAlign="center">
              Không có dữ liệu
            </Typography>
          )}
          <Box width="100%" overflow="auto" hidden={teams?.length === 0}>
            <StyledTable>
              <TableHead>
                <TableRow>
                  {headTableTeams.map(header => (
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
                {(teams || []).map((team: any, index: any) => {
                  return (
                    <TableRow hover key={team.name}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          color="info"
                          onClick={() => {
                            setFocusedTeam(team)
                            dialogUpdateTeamRef?.current.handleClickOpen()
                          }}
                        >
                          {team.name}
                        </Button>
                      </TableCell>
                      <TableCell align="center">{team.shortName}</TableCell>
                      <TableCell align="center">
                        <Box
                          component="img"
                          sx={{ height: 50, width: 50 }}
                          alt="Logo"
                          src={team.logo}
                        />
                      </TableCell>
                      <TableCell align="left">{team.homeField}</TableCell>
                      <TableCell align="center">
                        <Switch
                          color="success"
                          checked={team.status === 1 ? true : false}
                          onChange={() => {
                            setFocusedTeam(team)
                            dialogUpdateTeamStatusRef?.current.handleClickOpen()
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa" placement="top">
                          <IconButton
                            onClick={() => {
                              setFocusedTeam(team)
                              dialogUpdateTeamRef?.current.handleClickOpen()
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {team.isMain !== 1 && (
                          <Tooltip title="Xóa" placement="top">
                            <IconButton
                              onClick={() => {
                                setFocusedTeam(team)
                                dialogDeleteTeamRef?.current.handleClickOpen()
                              }}
                            >
                              <DeleteIcon sx={{ color: red[500] }} />
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

      <DialogCreateTeam
        ref={dialogCreateTeamRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={search}
      />

      <DialogUpdateTeam
        ref={dialogUpdateTeamRef}
        teamId={focusedTeam?.id}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={search}
      />

      <DialogUpdateTeamStatus
        ref={dialogUpdateTeamStatusRef}
        team={focusedTeam}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={search}
      />

      <DialogDeleteTeam
        ref={dialogDeleteTeamRef}
        team={focusedTeam}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={search}
      />
    </Container>
  )
}
