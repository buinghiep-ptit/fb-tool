import { Delete, Edit } from '@mui/icons-material'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import CachedIcon from '@mui/icons-material/Cached'
import SearchIcon from '@mui/icons-material/Search'
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
import {
  deleteCoachPosition,
  getCoachPosition,
} from 'app/apis/coachs/coachs.service'
import {
  Breadcrumb,
  ConfirmationDialog,
  Container,
  SimpleCard,
  StyledTable,
} from 'app/components'
import { toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DialogCreatePosition from './DialogCreatePosition'
import DialogEditPosition from './DialogEditPosition'
import { headTablePosition } from './const'
export interface Props {}

export default function PositionManager(props: Props) {
  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [nameFilter, setNameFilter] = useState<any>('')
  const [statusFilter, setStatusFilter] = useState<any>(2)
  const createRef = React.useRef<any>(null)
  const editRef = React.useRef<any>(null)
  const [positions, setPositions] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [doRerender, setDoRerender] = React.useState(false)
  const [idDelete, setIdDelete] = useState(null)
  const navigate = useNavigate()

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage)
  }

  const closeConfirmDialog = () => {
    setOpenConfirmDialog(false)
  }

  const handleChangeRowsPerPage = (event: {
    target: { value: string | number }
  }) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    setDoRerender(!doRerender)
  }

  const fetchCoachePosition = async () => {
    setIsLoading(true)
    const res = await getCoachPosition({
      name: nameFilter.trim(),
      status: statusFilter === 2 ? null : statusFilter,
      size: rowsPerPage,
      page: page,
    })
    setPositions(res.content)
    setCountTable(res.totalElements)
    setIsLoading(false)
  }

  const handleSearch = async () => {
    setPage(0)
    setDoRerender(!doRerender)
  }

  const handleClearFilter = async () => {
    setNameFilter('')
    setStatusFilter(2)
    setDoRerender(!doRerender)
  }

  const handleDeletePosition = async () => {
    const res = await deleteCoachPosition(idDelete)
    if (res) {
      toastSuccess({
        message: 'Xóa thành công',
      })
      setOpenConfirmDialog(false)
      fetchCoachePosition()
    }
  }

  React.useEffect(() => {
    fetchCoachePosition()
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
          <Breadcrumb routeSegments={[{ name: 'Quản lý vị trí công tác ' }]} />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddBoxOutlinedIcon />}
          style={{ width: '200px', margin: '15px 0', height: '52px' }}
          onClick={() => createRef?.current.handleClickOpen()}
        >
          Thêm mới
        </Button>
      </div>
      <SimpleCard>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              id="namePosition"
              label="Tên vị trí công tác"
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
                <MenuItem value={0}>Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'end' }}>
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
          </Grid>
        </Grid>
      </SimpleCard>
      <div style={{ height: '30px' }} />
      <SimpleCard title="Danh sách vị trí công tác">
        {positions?.length === 0 && (
          <Typography color="gray" textAlign="center">
            Không có dữ liệu
          </Typography>
        )}
        <Box width="100%" overflow="auto" hidden={positions?.length === 0}>
          <StyledTable>
            <TableHead>
              <TableRow>
                {headTablePosition.map(header => (
                  <TableCell align="center" style={{ minWidth: header.width }}>
                    {header.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {positions && (
              <TableBody>
                {(positions || []).map((position: any, index: any) => {
                  return (
                    <TableRow hover key={position.id}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell align="left">{position.description}</TableCell>
                      <TableCell align="center">
                        {position.status === 1 && (
                          <Chip label="Hoạt động" color="success" />
                        )}
                        {position.status === 0 && (
                          <Chip label="Không hoạt động" color="warning" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Sửa" placement="top">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              editRef.current.handleClickOpen(position)
                            }
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa" placement="top">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setIdDelete(position.id)
                              setOpenConfirmDialog(true)
                            }}
                          >
                            <Delete />
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
        <DialogCreatePosition
          ref={createRef}
          fetchData={fetchCoachePosition}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        ></DialogCreatePosition>
        <DialogEditPosition
          fetchData={fetchCoachePosition}
          ref={editRef}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
        <ConfirmationDialog
          open={openConfirmDialog}
          onConfirmDialogClose={closeConfirmDialog}
          text="Bạn có chắc chắn muốn xóa vị trí công tác này?"
          onYesClick={handleDeletePosition}
          textYes="Xóa"
          title="Xác nhận"
        />
      </SimpleCard>
    </Container>
  )
}
