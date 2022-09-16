import { yupResolver } from '@hookform/resolvers/yup'
import {
  AddBox,
  CameraAltRounded,
  CancelSharp,
  ChangeCircleSharp,
  CheckCircleOutlineRounded,
  ClearSharp,
  LockClockSharp,
  LockOpenSharp,
} from '@mui/icons-material'
import {
  Chip,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
} from '@mui/material'
import { Box } from '@mui/system'
import { useQueries, UseQueryResult } from '@tanstack/react-query'
import {
  fetchLogsCustomer,
  getCustomerDetail,
} from 'app/apis/accounts/customer.service'
import { SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiInputText'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { SelectDropDown } from 'app/components/common/MuiSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useAddOtpCountCustomer,
  useUpdateCustomer,
} from 'app/hooks/queries/useCustomerData'
import { ILogsActionCustomer, OtpCount } from 'app/models/account'
import { columnLogsCustomer } from 'app/utils/columns/columnsLogsCustomer'
import { ISODateTimeFormatter } from 'app/utils/formatters/dateTimeISOFormatter'
import { useState } from 'react'
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type ISearchFilters = {
  email?: string
  mobilePhone?: string
  fullName?: string
  otp?: number
  avatar?: any
  type?: string | number
}

type RHFLabelProps = {
  control: any
  name: string
  options: OtpCount[]
}

const RHFLabel = ({ control, name, options }: RHFLabelProps) => {
  const watchOtp = useWatch({ control, name })

  const watchToString = (watchValue: string) => {
    const index = options.findIndex(o => o.type === parseInt(watchValue, 10))
    const currentOtpSelected = options[index]

    return currentOtpSelected ?? options[0]
  }

  return (
    <Chip
      label={`${watchToString(watchOtp).numToday} / ${
        watchToString(watchOtp).maxPerDay
      }`}
      size="small"
      color={true ? 'primary' : 'default'}
      sx={{ mx: 1 }}
    />
  )
}

export interface Props {}
const FILE_SIZE = 10000000
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']

export default function CustomerDetail(props: Props) {
  const navigation = useNavigate()
  const { customerId } = useParams()
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(10)
  const [filters, setFilters] = useState({
    customerId,
    page,
    size,
  })

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc'),
    mobilePhone: Yup.string()
      .required('SĐT là bắt buộc')
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không hợp lệ'),
    displayName: Yup.string()
      .min(0, 'email must be at least 0 characters')
      .max(256, 'email must be at almost 256 characters'),
    avatar: Yup.mixed()
      .test(
        'fileSize',
        'Dung lượng file quá lớn (< 10MB)',
        file => !file || (file && file.size <= FILE_SIZE),
      )
      .test('fileFormat', 'Chỉ hỗ trợ ảnh .jpg | .jpeg | .png | .gif', file => {
        return !file || (file && SUPPORTED_FORMATS.includes(file.type))
      }),
  })

  const methods = useForm<ISearchFilters>({
    defaultValues: { avatar: null },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const queryResults = useQueries({
    queries: [
      {
        queryKey: ['customer', customerId],
        queryFn: () => getCustomerDetail(customerId ?? 0),
        refetchOnWindowFocus: false,
        enabled: !!customerId,
      },
      {
        queryKey: ['logs-customer', filters],
        queryFn: () => fetchLogsCustomer(filters),
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        enabled: !!filters,
      },
    ],
  })
  const [customer, logs] = queryResults
  const isLoading = queryResults.some(
    (query: UseQueryResult) => query.isLoading,
  )
  const isError = queryResults.some((query: UseQueryResult) => query.isError)
  const isFetching = queryResults.some(
    (query: UseQueryResult) => query.isFetching,
  )

  const convertOtpToLabel = (type: number) => {
    switch (type) {
      case 1:
        return 'OTP đăng ký'
      case 2:
        return 'OTP quên mật khẩu'

      case 3:
        return 'OTP đăng nhập'

      case 4:
        return 'OTP đổi SĐT'

      default:
        return 'OTP đăng ký'
    }
  }

  const getColorByCusStatus = (status: number) => {
    switch (status) {
      case 1:
        return '#2F9B42'
      case -1:
        return '#AAAAAA'

      case -2:
        return '#FF3D57'

      case -3:
        return '#ff9e43'

      default:
        return '#AAAAAA'
    }
  }

  const getLabelByCusStatus = (status: number) => {
    switch (status) {
      case 1:
        return 'Hoạt động'
      case -1:
        return 'Xoá'

      case -2:
        return 'Khoá'

      case -3:
        return 'Khoá tạm thời'

      default:
        return 'Không hoạt động'
    }
  }

  const onSuccess = (data: any) => {
    toastSuccess({ message: 'Cập nhật thành công' })
  }

  const { mutate: updateCustomer, isLoading: updateLoading } =
    useUpdateCustomer(onSuccess)

  const { mutate: addOtpCount, isLoading: addOtpLoading } =
    useAddOtpCountCustomer(onSuccess)

  const onSubmitHandler: SubmitHandler<ISearchFilters> = (
    values: ISearchFilters,
  ) => {
    updateCustomer({ ...values, cusId: customerId })
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    setFilters((prevFilters: any) => {
      return {
        ...prevFilters,
        page: newPage,
      }
    })
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSize(+event.target.value)
    setPage(0)
    setFilters((prevFilters: any) => {
      return {
        ...prevFilters,
        page: 0,
        size: parseInt(event.target.value, 10),
      }
    })
  }

  if (isLoading) return <MuiLoading />

  if (isError)
    return (
      <Box my={2} textAlign="center">
        <MuiTypography variant="h5">Have an errors</MuiTypography>
      </Box>
    )

  return (
    <Stack gap={3}>
      <SimpleCard>
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <FormProvider {...methods}>
            <Grid container spacing={3}>
              <Grid item sm={7} xs={12}>
                <Box pb={0.5}>
                  <Grid container alignItems={'center'} pb={1}>
                    <Grid item sm={4} md={3} xs={12}>
                      <MuiTypography variant="subtitle2">Email:</MuiTypography>
                    </Grid>
                    <Grid item sm={8} md={9} xs={12}>
                      <FormInputText
                        type="email"
                        name="email"
                        placeholder="Nhập Email"
                        size="small"
                        fullWidth
                        defaultValue={customer?.data?.email ?? ''}
                      />
                    </Grid>
                  </Grid>
                  <Grid container alignItems={'center'} py={1}>
                    <Grid item sm={4} md={3} xs={12}>
                      <MuiTypography variant="subtitle2">
                        Số điện thoại:
                      </MuiTypography>
                    </Grid>
                    <Grid item sm={8} md={9} xs={12}>
                      <FormInputText
                        type="text"
                        name="mobilePhone"
                        size="small"
                        placeholder="Nhập SĐT"
                        fullWidth
                        defaultValue={customer?.data?.mobilePhone ?? ''}
                      />
                    </Grid>
                  </Grid>
                  <Grid container alignItems={'center'} py={1}>
                    <Grid item sm={4} md={3} xs={12}>
                      <MuiTypography variant="subtitle2">
                        Tên hiển thị:
                      </MuiTypography>
                    </Grid>
                    <Grid item sm={8} md={9} xs={12}>
                      <FormInputText
                        type="text"
                        name="fullName"
                        placeholder="Nhập họ và tên"
                        size="small"
                        fullWidth
                        defaultValue={customer?.data?.fullName ?? ''}
                      />
                    </Grid>
                  </Grid>
                  <Grid container alignItems={'center'} py={1}>
                    <Grid item sm={4} md={3} xs={12}>
                      <MuiTypography variant="subtitle2">
                        OTP trong ngày:
                      </MuiTypography>
                    </Grid>
                    <Grid item sm={8} md={9} xs={12}>
                      <Stack flexDirection={'row'} alignItems={'center'}>
                        <Box flex={1}>
                          <SelectDropDown
                            name="otp"
                            defaultValue={
                              (customer?.data?.otpCount &&
                                customer?.data?.otpCount[0]?.type) ??
                              0
                            }
                          >
                            {customer?.data?.otpCount?.length ? (
                              customer?.data?.otpCount?.map(item => (
                                <MenuItem key={item.type} value={item.type}>
                                  {convertOtpToLabel(item.type ?? 0)}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value={0}>{'number'}</MenuItem>
                            )}
                          </SelectDropDown>
                        </Box>

                        <RHFLabel
                          control={methods.control}
                          name={'otp'}
                          options={customer?.data?.otpCount ?? []}
                        />

                        <MuiButton
                          onClick={() =>
                            addOtpCount({
                              customerId: (customerId ?? 0) as number,
                              otpType: methods.getValues(
                                'otp',
                              ) as unknown as string,
                            })
                          }
                          loading={addOtpLoading}
                          title="Thêm lượt"
                          variant="outlined"
                          color="primary"
                          sx={{ flex: 1 }}
                          startIcon={<AddBox />}
                        />
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container alignItems={'center'} py={1}>
                    <Grid item sm={4} md={3} xs={12}>
                      <MuiTypography variant="subtitle2">
                        Đăng ký bằng:
                      </MuiTypography>
                    </Grid>
                    <Grid item sm={8} md={9} xs={12}>
                      <MuiTypography
                        variant="subtitle2"
                        pb={1}
                        color="primary"
                        sx={{ textDecorationLine: 'underline' }}
                      >
                        {customer?.data?.registeredBy}
                      </MuiTypography>
                    </Grid>
                  </Grid>
                  <Grid container alignItems={'center'} py={1}>
                    <Grid item sm={4} md={3} xs={12}>
                      <MuiTypography variant="subtitle2">
                        Lần cuối đăng nhập:
                      </MuiTypography>
                    </Grid>
                    <Grid item sm={8} md={9} xs={12}>
                      <MuiTypography variant="subtitle2" color="primary">
                        {customer?.data?.lastLoginDate
                          ? ISODateTimeFormatter(
                              customer?.data?.lastLoginDate ?? '',
                            )
                          : ''}
                      </MuiTypography>
                    </Grid>
                  </Grid>
                  <Grid container alignItems={'center'} py={1}>
                    <Grid item sm={4} md={3} xs={12}>
                      <MuiTypography variant="subtitle2">
                        Mã giới thiệu:
                      </MuiTypography>
                    </Grid>
                    <Grid item sm={8} md={9} xs={12}>
                      <MuiTypography variant="subtitle2" color="primary">
                        {customer?.data?.referralCode}
                      </MuiTypography>
                    </Grid>
                  </Grid>
                </Box>

                {updateLoading && <LinearProgress />}

                {customer.data?.status !== -1 && (
                  <Box pt={3}>
                    <Grid container spacing={2}>
                      <Grid item sm={3} xs={6}>
                        <MuiButton
                          disabled={
                            !!Object.keys(methods.formState.errors).length
                          }
                          title="Lưu"
                          loading={updateLoading}
                          variant="contained"
                          color="primary"
                          type="submit"
                          sx={{ width: '100%' }}
                          startIcon={<LockClockSharp />}
                        />
                      </Grid>
                      <Grid item sm={3} xs={6}>
                        <MuiButton
                          onClick={() => methods.reset()}
                          title="Huỷ"
                          variant="outlined"
                          color="secondary"
                          sx={{ width: '100%' }}
                          startIcon={<CancelSharp />}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Grid>

              <Grid item sm={5} xs={12}>
                <Stack alignItems={'center'} justifyContent={'center'}>
                  <Stack alignItems={'center'} px={3} gap={2}>
                    <Box
                      width={200}
                      height={200}
                      sx={{
                        bgcolor: 'gray',
                        borderRadius: 100,
                        position: 'relative',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        boxShadow:
                          '0 2px 6px 0 rgba(0, 0, 0, 0.1), 0 4px 10px 0 rgba(0, 0, 0, 0.16)',

                        backgroundImage: `url(${
                          methods.watch('avatar')
                            ? URL.createObjectURL(methods.watch('avatar'))
                            : '/assets/images/avatars/avatar-duck.jpeg'
                        })`,
                      }}
                    >
                      <label>
                        <Controller
                          name="avatar"
                          control={methods.control}
                          defaultValue={[]}
                          render={({ field }) => (
                            <input
                              style={{ display: 'none' }}
                              type="file"
                              name="avatar"
                              accept="image/*"
                              // multiple
                              {...props}
                              onChange={event => {
                                if (event.target.files?.length) {
                                  field.onChange(event.target.files[0])
                                }
                              }}
                            />
                          )}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            borderRadius: 100,
                            backgroundColor: 'white',
                            width: 50,
                            height: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <CameraAltRounded
                            fontSize="large"
                            sx={{ width: 40, height: 40, color: '#121828' }}
                          />
                        </Box>
                      </label>
                      <Box
                        sx={{
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          position: 'absolute',
                          bottom: 10,
                          right: 20,
                          borderRadius: 100,
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: getColorByCusStatus(
                              customer.data?.status ?? 0,
                            ),
                            right: 0,
                            borderRadius: 100,
                          }}
                        />
                      </Box>
                    </Box>

                    {methods.getValues('avatar') && (
                      <Stack
                        maxWidth={'100%'}
                        flexDirection={'row'}
                        gap={0.5}
                        alignItems={'center'}
                      >
                        <CheckCircleOutlineRounded color="primary" />
                        <MuiTypography fontSize="0.75rem">
                          {methods.getValues('avatar').name as string}
                        </MuiTypography>
                        <IconButton
                          onClick={() => {
                            methods.clearErrors('avatar')
                            methods.setValue('avatar', null)
                          }}
                        >
                          <ClearSharp color="error" />
                        </IconButton>
                      </Stack>
                    )}

                    {methods.formState.errors.avatar && (
                      <FormHelperText error>
                        {methods.formState.errors.avatar?.message as string}
                      </FormHelperText>
                    )}

                    <Stack flexDirection={'row'}>
                      <Stack alignItems={'center'}>
                        <MuiTypography variant="subtitle1" color="primary">
                          {customer?.data?.followers}
                        </MuiTypography>
                        <MuiTypography variant="subtitle2">
                          Người theo dõi
                        </MuiTypography>
                      </Stack>
                      <Divider
                        orientation="vertical"
                        sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 1 }}
                        flexItem
                      />
                      <Stack alignItems={'center'}>
                        <MuiTypography variant="subtitle1" color="primary">
                          {customer?.data?.following}
                        </MuiTypography>
                        <MuiTypography variant="subtitle2">
                          Đang theo dõi
                        </MuiTypography>
                      </Stack>
                    </Stack>

                    <Stack flexDirection={'row'} alignItems="center">
                      <SelectDropDown
                        name="type"
                        defaultValue={customer?.data?.type ?? 1}
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value={1}>Thường</MenuItem>
                        <MenuItem value={2}>KOL</MenuItem>
                      </SelectDropDown>
                      <Chip
                        label={getLabelByCusStatus(
                          customer.data?.status as number,
                        )}
                        size="small"
                        // color={true ? 'primary' : 'default'}
                        sx={{
                          mx: 1,
                          px: 1,
                          flex: 1,
                          backgroundColor: getColorByCusStatus(
                            customer.data?.status as number,
                          ),
                          color: '#FFFFFF',
                        }}
                      />
                    </Stack>
                  </Stack>

                  {customer.data?.status !== -1 && (
                    <Stack flexDirection={'row'} my={3}>
                      {customer.data?.status !== -2 && (
                        <>
                          <MuiButton
                            title={'Khoá TK'}
                            variant="text"
                            color="error"
                            onClick={() =>
                              navigation('khoa-tai-khoan', {
                                state: { modal: true, data: customer.data },
                              })
                            }
                            startIcon={<LockClockSharp />}
                          />
                          <Divider
                            orientation="vertical"
                            sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 1 }}
                            flexItem
                          />
                        </>
                      )}

                      {customer.data?.status !== 1 && (
                        <>
                          <MuiButton
                            title={'Mở khóa'}
                            variant="text"
                            color="primary"
                            onClick={() =>
                              navigation('mo-khoa-tai-khoan', {
                                state: { modal: true, data: customer.data },
                              })
                            }
                            startIcon={<LockOpenSharp />}
                          />
                          <Divider
                            orientation="vertical"
                            sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 1 }}
                            flexItem
                          />
                        </>
                      )}
                      <MuiButton
                        onClick={() =>
                          navigation(`doi-mat-khau`, {
                            state: { modal: true },
                          })
                        }
                        title="Đổi MK"
                        variant="text"
                        color="secondary"
                        sx={{ flex: 1 }}
                        startIcon={<ChangeCircleSharp />}
                      />
                    </Stack>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </form>
      </SimpleCard>

      <SimpleCard title=" Logs hành động">
        <MuiStyledTable
          rows={logs?.data?.content as ILogsActionCustomer[]}
          columns={columnLogsCustomer as any}
          onClickRow={() => {}}
          isFetching={isFetching}
        />
        <MuiStyledPagination
          component="div"
          rowsPerPageOptions={[5, 10, 20]}
          count={logs?.data?.totalElements as number}
          rowsPerPage={size}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </SimpleCard>
    </Stack>
  )
}
