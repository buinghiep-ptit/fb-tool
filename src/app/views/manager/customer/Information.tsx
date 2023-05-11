import { yupResolver } from '@hookform/resolvers/yup'
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
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { Stack, styled } from '@mui/system'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { getCustomer, getLogs } from 'app/apis/customer/customer.service'
import { SimpleCard, StyledTable } from 'app/components'
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'
import { headTableAccountLog } from './const'
import LockDialog from './dialog/LockDialog'

export interface Props {}

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  boxShadow: 'none',
}))

export default function Information(props: Props) {
  const [page, setPage] = useState(0)
  const [customer, setCustomer] = useState<any>(null)
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
    initDefaultValues(res)
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

  const schema = yup
    .object({
      fullName: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .max(255, 'Tối đa 255 ký tự'),
      birthday: yup
        .date()
        .required('Gía trị bắt buộc')
        .typeError('Vui lòng nhập đúng ngày sinh'),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      gender: '',
      birthday: null,
      phone: '',
    },
  })

  const initDefaultValues = (customer: any) => {
    const defaultValues: any = {}
    defaultValues.fullName = customer.fullName
    defaultValues.gender = customer.gender
    defaultValues.birthday = customer.birthday
    defaultValues.email = customer.email
    defaultValues.phone = customer.mobilePhone
    methods.reset({ ...defaultValues })
  }

  const onSubmit = async (data: any) => {}

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

      <Stack
        spacing={2}
        direction="row"
        style={{
          position: 'fixed',
          top: '150px',
          right: '70px',
        }}
      >
        <Button variant="contained">Cập nhật</Button>
        <Button variant="outlined" onClick={() => navigate('/customers')}>
          Quay lại
        </Button>
      </Stack>
      <SimpleCard>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Item>
                  <Controller
                    name="email"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        disabled
                      />
                    )}
                  />
                </Item>
                <Item>
                  <Controller
                    name="phone"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Số điện thoại"
                        variant="outlined"
                        disabled
                        fullWidth
                        margin="dense"
                      />
                    )}
                  />
                </Item>
                <Item>
                  <Controller
                    name="fullName"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tên hiển thị"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                      />
                    )}
                  />
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MuiRHFDatePicker
                      name="birthday"
                      label="Ngày sinh nhật"
                      inputFormat={'DD/MM/YYYY'}
                    />
                  </LocalizationProvider>
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
                      <FormControlLabel
                        value="Nữ"
                        control={<Radio />}
                        label="Nữ"
                      />
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
                    {customer?.status === 1 ? (
                      <Chip label="Hoạt động" color="success" />
                    ) : (
                      <Chip label="Khóa" color="error" />
                    )}
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
                    <FormLabel id="sex-radio">
                      Ngày đăng ký: 01/02/2023
                    </FormLabel>
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
          </FormProvider>
        </form>
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
