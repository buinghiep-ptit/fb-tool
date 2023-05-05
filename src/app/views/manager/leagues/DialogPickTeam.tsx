import { RemoveCircle } from '@mui/icons-material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
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
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { red } from '@mui/material/colors'
import { addTeam, removeTeam } from 'app/apis/leagues/leagues.service'
import { getTeams } from 'app/apis/teams/teams.service'
import { SimpleCard, StyledTable } from 'app/components'
import { toastSuccess } from 'app/helpers/toastNofication'
import { remove } from 'lodash'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { headTableTeams } from '../team/const'

interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setTeamPicked: React.Dispatch<React.SetStateAction<any>>
  setValue: any
  teamPicked: any
}

const DialogPickTeam = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [focusedTeam, setFocusedTeam] = React.useState<any>()
  const params = useParams()
  const [page, setPage] = React.useState(0)
  const [countTable, setCountTable] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(20)
  const [doRerender, setDoRerender] = React.useState(false)

  const [teams, setTeams] = React.useState<any>()
  const [nameFilter, setNameFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState(99)
  const [typeFilter, setTypeFilter] = React.useState(false)

  const fetchListTeam = async () => {
    props.setIsLoading(true)
    await getTeams({
      q: nameFilter,
      status: statusFilter === 99 ? null : statusFilter,
      type: typeFilter ? 1 : null,
      page: page,
      size: rowsPerPage,
    }).then(res => {
      const newList = res.content.map((item: any) => {
        item.isPicked = (props.teamPicked || []).includes(item.id)
        return item
      })
      setTeams(newList)

      setCountTable(res.totalElements)
    })
    props.setIsLoading(false)
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
    props.setValue('teamList', props.teamPicked)
  }

  const handlePick = async (id: number) => {
    props.setIsLoading(true)
    const newList = [...teams]
    if (newList[id].isPicked) {
      const res = await removeTeam(params.id, newList[id].id)
      if (res) {
        toastSuccess({
          message: 'Đội đã được xóa',
        })
        props.setIsLoading(false)
      }
      const newListPicked = remove(props.teamPicked, function (n) {
        return n !== newList[id].id
      })
      props.setTeamPicked(newListPicked)
    } else {
      const res = await addTeam(params.id, newList[id].id)
      if (res) {
        toastSuccess({
          message: 'Đội đã được thêm',
        })
        props.setIsLoading(false)
      }
      const newListPicked = [...props.teamPicked, newList[id].id]
      props.setTeamPicked(newListPicked)
    }

    newList[id].isPicked = !teams[id].isPicked
    setTeams(newList)
    setDoRerender(!doRerender)
  }

  return (
    <div>
      <Dialog open={open} maxWidth="xl">
        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Chọn đội bóng tham gia giải đấu</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Container>
            <Stack gap={3}>
              <SimpleCard>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
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
                      disabled={props.isLoading}
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
                      disabled={props.isLoading}
                    >
                      Làm mới
                    </Button>
                  </Grid>
                </Grid>
              </SimpleCard>

              <div style={{ height: '30px' }} />

              <SimpleCard title="Danh sách đội">
                <Box width="100%" overflow="auto">
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
                                style={{ wordBreak: 'keep-all' }}
                              >
                                {team.name}
                              </Button>
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{ wordBreak: 'keep-all' }}
                            >
                              {team.shortName}
                            </TableCell>
                            <TableCell align="center">
                              <Box
                                component="img"
                                sx={{ height: 50, width: 50 }}
                                alt="Logo"
                                src={team.logo}
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              style={{ wordBreak: 'keep-all' }}
                            >
                              {team.homeField}
                            </TableCell>
                            <TableCell align="center">
                              {team.status === 1
                                ? 'Hoạt động'
                                : 'Không hoạt động'}
                            </TableCell>
                            <TableCell align="center">
                              {!team.isPicked ? (
                                <Tooltip title="Thêm" placement="top">
                                  <IconButton
                                    onClick={() => handlePick(index)}
                                    disabled={props.isLoading}
                                  >
                                    <AddCircleIcon sx={{ color: red[500] }} />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Loại" placement="top">
                                  <IconButton
                                    onClick={() => handlePick(index)}
                                    disabled={props.isLoading}
                                  >
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
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default DialogPickTeam
