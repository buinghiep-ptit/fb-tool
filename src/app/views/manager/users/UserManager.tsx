import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
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
import { Box } from '@mui/system'
import { getUsers } from 'app/apis/users/users.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { getRoleLabel } from 'app/utils/enums/roles'
import dayjs from 'dayjs'
import * as React from 'react'
import { useState } from 'react'
import DialogCreateUser from './DialogCreateUser'
import DialogUpdateUser from './DialogUpdateUser'
import { headTableUsers } from './const'

export interface Props {}

export default function UserManager(props: Props) {
  const dialogCreateUserRef = React.useRef<any>(null)
  const dialogUpdateUserRef = React.useRef<any>(null)
  const [focusedUser, setFocusedUser] = useState<any>()

  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [doRerender, setDoRerender] = useState(false)

  const [users, setUsers] = useState<any>()
  const [emailFilter, setEmailFilter] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState(99)
  const [statusFilter, setStatusFilter] = React.useState(99)

  const [isLoading, setIsLoading] = useState(false)

  const fetchListUsers = async () => {
    setIsLoading(true)
    await getUsers({
      email: emailFilter.trim(),
      role: roleFilter === 99 ? null : roleFilter,
      status: statusFilter === 99 ? null : statusFilter,
      page: page,
      size: rowsPerPage,
    })
      .then(res => {
        setUsers(
          res.content.map((u: any) => {
            u.roleArr = u.roles
              .split(',')
              .map((r: any) => getRoleLabel(Number(r)))
            return u
          }),
        )
        setCountTable(res.totalElements)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const search = () => {
    setPage(0)
    setDoRerender(!doRerender)
  }

  const resetFilter = () => {
    setEmailFilter('')
    setStatusFilter(99)
    setRoleFilter(99)
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
    fetchListUsers()
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
            { name: 'Quản lý tài khoản vận hành', path: '/users' },
          ]}
        />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Thêm Tài khoản"
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => dialogCreateUserRef?.current.handleClickOpen()}
          startIcon={<Icon>control_point</Icon>}
        />
      </Stack>
      <Stack gap={1}>
        <SimpleCard>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                fullWidth
                value={emailFilter}
                onChange={e => {
                  setEmailFilter(e.target.value)
                }}
                onKeyDown={async e => {
                  if (e.key === 'Enter') {
                    search()
                  }
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Quyền</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Quyền"
                  value={roleFilter}
                  onChange={e => {
                    setRoleFilter(e.target.value as number)
                  }}
                >
                  <MenuItem value={99}>Tất cả</MenuItem>
                  <MenuItem value={1}>Admin</MenuItem>
                </Select>
              </FormControl>
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
        <SimpleCard title="Danh sách tài khoản">
          {users?.length === 0 && (
            <Typography color="gray" textAlign="center">
              Không có dữ liệu
            </Typography>
          )}
          <Box width="100%" overflow="auto" hidden={users?.length === 0}>
            <StyledTable>
              <TableHead>
                <TableRow>
                  {headTableUsers.map(header => (
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
                {(users || []).map((user: any, index: any) => {
                  return (
                    <TableRow hover key={user.userId}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          color="info"
                          onClick={() => {
                            setFocusedUser(user)
                            dialogUpdateUserRef?.current.handleClickOpen()
                          }}
                        >
                          {user.email}
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        {user.roleArr.join(', ')}
                      </TableCell>
                      <TableCell align="left">
                        {dayjs(user.updateDate).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell align="left">{user.updateBy}</TableCell>
                      <TableCell
                        align="center"
                        style={{ wordBreak: 'keep-all' }}
                      >
                        {user.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa" placement="top">
                          <IconButton
                            onClick={() => {
                              setFocusedUser(user)
                              dialogUpdateUserRef?.current.handleClickOpen()
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

      <DialogCreateUser
        ref={dialogCreateUserRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={search}
      />
      <DialogUpdateUser
        ref={dialogUpdateUserRef}
        user={focusedUser}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={search}
      />
    </Container>
  )
}
