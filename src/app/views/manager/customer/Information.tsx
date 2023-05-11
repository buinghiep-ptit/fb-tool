import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import LockPersonIcon from '@mui/icons-material/LockPerson'
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import { getCustomer, getLogs } from 'app/apis/customer/customer.service'
import { SimpleCard, StyledTable } from 'app/components'
import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { headTableAccountLog } from './const'
import LockDialog from './dialog/LockDialog'

export interface Props {}

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  boxShadow: 'none',
}))

export default function Information(props: Props) {
  const [page, setPage] = useState(0)
  const [customer, setCustomer] = useState(null)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [countTable, setCountTable] = useState(0)
  const lockDialogRef = React.useRef<any>(null)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [doRerender, setDoRerender] = React.useState(false)
  const [logs, setLogs] = useState<any>()
  const params = useParams()

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

  const fetchCustomerDetail = async () => {
    const res = await getCustomer(params.idCustomer)
    setCustomer(res)
  }

  const fetchLogs = async () => {
    setIsLoading(true)
    const res = await getLogs(
      {
        size: rowsPerPage,
        page: page,
      },
      params.idCustomer,
    )
    setLogs(res.content)
    setCountTable(res.totalElements)
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchLogs()
    fetchCustomerDetail()
  }, [page, doRerender])

  return (
    <>
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
      <SimpleCard>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Item>
              <TextField
                id="outlined-basic"
                label="Email, SDT, Tên hiển thị"
                variant="outlined"
                fullWidth
              />
            </Item>
            <Item>
              <TextField
                id="outlined-basic"
                label="Email, SDT, Tên hiển thị"
                variant="outlined"
                fullWidth
              />
            </Item>
            <Item>
              <TextField
                id="outlined-basic"
                label="Email, SDT, Tên hiển thị"
                variant="outlined"
                fullWidth
              />
            </Item>
          </Grid>
          <Grid item xs={3}>
            <Item>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Loại tài khoản
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Loại tài khoản"
                >
                  <MenuItem value={0}>Tất cả</MenuItem>
                  <MenuItem value={1}>Thường</MenuItem>
                  <MenuItem value={2}>Fan</MenuItem>
                </Select>
              </FormControl>
            </Item>
            <Item>
              <FormControl>
                <FormLabel id="sex-radio">Giới tính</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="Nam"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="Nam"
                    control={<Radio />}
                    label="Name"
                  />
                  <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                  <FormControlLabel
                    value="Khác"
                    control={<Radio />}
                    label="Khác"
                  />
                </RadioGroup>
              </FormControl>
            </Item>
            <Item>
              <div>
                <FormLabel id="sex-radio">Trạng thái: </FormLabel>
                <Chip label="Hoạt động" color="success" />
              </div>
            </Item>
          </Grid>
          <Grid
            item
            xs={3}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
          >
            <Item>
              <div>
                <FormLabel id="sex-radio">
                  Đăng ký bằng: Số điện thoại
                </FormLabel>
              </div>
            </Item>
            <Item>
              <div>
                <FormLabel id="sex-radio">Ngày đăng ký: 01/02/2023</FormLabel>
              </div>
            </Item>
            <Item>
              <div>
                <FormLabel id="sex-radio">
                  Lần cuối đăng nhập: 01/02/2023
                </FormLabel>
              </div>
            </Item>
          </Grid>
          <Grid item xs={3} sx={{ textAlign: 'center' }}>
            <Item>
              <AccountCircleRoundedIcon sx={{ fontSize: 100 }} />
            </Item>
            <Item>
              <ButtonGroup variant="text" aria-label="text button group">
                <Button startIcon={<LockPersonIcon />} onClick={() => {}}>
                  Khóa
                </Button>
                <Button color="success">Loại tài khoản: Fan</Button>
              </ButtonGroup>
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <div>Địa chỉ nhận hàng: Tòa nhà FPT Tower</div>
            </Item>
          </Grid>
        </Grid>
      </SimpleCard>
      <LockDialog ref={lockDialogRef} />
      <div style={{ height: '30px' }} />
      <SimpleCard title="Log hành động">
        {logs?.length === 0 && (
          <Typography color="gray" textAlign="center">
            Không có dữ liệu
          </Typography>
        )}
        <Box width="100%" overflow="auto" hidden={logs?.length === 0}>
          <StyledTable>
            <TableHead>
              <TableRow>
                {headTableAccountLog.map(header => (
                  <TableCell align="center" style={{ minWidth: header.width }}>
                    {header.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {logs && (
              <TableBody>
                {(logs || []).map((log: any, index: any) => {
                  return (
                    <TableRow hover key={log.id}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>

                      <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                        {log.actionName}
                      </TableCell>
                      <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                        {log.performer}
                      </TableCell>
                      <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                        {log.note}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ wordBreak: 'keep-all' }}
                      >
                        {moment(log.dateCreated).format('DD-MM-YYYY HH:ss')}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            )}
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
    </>
  )
}
