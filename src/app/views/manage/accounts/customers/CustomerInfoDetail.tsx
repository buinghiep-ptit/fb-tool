import { yupResolver } from '@hookform/resolvers/yup'
import {
  AddBox,
  ChangeCircleSharp,
  CheckCircleOutlineRounded,
  ClearSharp,
  LockClockSharp,
  LockOpenSharp,
} from '@mui/icons-material'
import {
  Chip,
  Divider,
  Grid,
  Icon,
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
import MuiLoading from 'app/components/common/MuiLoadingApp'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { UploadPreviewer } from 'app/components/common/UploadPreviewer'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useAddOtpCountCustomer,
  useUpdateCustomer,
} from 'app/hooks/queries/useCustomersData'
import { useUploadFiles } from 'app/hooks/useFilesUpload'
import { IMediaOverall } from 'app/models'
import { ILogsActionCustomer, OtpCount } from 'app/models/account'
import { columnLogsCustomer } from 'app/utils/columns/columnsLogsCustomer'
import { getColorByCusStatus } from 'app/utils/common'
import { EMediaFormat, EMediaType } from 'app/utils/enums/medias'
import { ISODateTimeFormatter } from 'app/utils/formatters/dateTimeFormatters'
import {
  convertOtpToLabel,
  getLabelByCusStatus,
} from 'app/utils/formatters/labelFormatter'
import { messages } from 'app/utils/messages'
import { useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type SchemaType = {
  email?: string
  mobilePhone?: string
  fullName?: string
  otp?: number
  typeFile?: number
  files?: any
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
      color={
        (watchToString(watchOtp)?.numToday ?? 0) <
        (watchToString(watchOtp)?.maxPerDay ?? 0)
          ? 'primary'
          : 'default'
      }
      sx={{ mx: 1 }}
    />
  )
}

export interface Props {}

export default function CustomerDetail(props: Props) {
  const navigation = useNavigate()
  const { customerId } = useParams()
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(10)
  const [fileConfigs] = useState({
    mediaType: EMediaType.AVATAR,
    mediaFormat: EMediaFormat.IMAGE,
    accept: 'image/*',
    multiple: false,
  })
  const [mediasSrcPreviewer, setMediasSrcPreviewer] = useState<IMediaOverall[]>(
    [],
  )
  const [filters, setFilters] = useState({
    customerId,
    page,
    size,
  })

  const [defaultValues] = useState<SchemaType>({ typeFile: EMediaFormat.IMAGE })

  const validationSchema = Yup.object().shape(
    {
      email: Yup.string()
        .email(messages.MSG12)
        .when('mobilePhone', {
          is: (phone: string) => !phone || phone.length === 0,
          then: Yup.string().required(messages.MSG1).email(messages.MSG12),
          otherwise: Yup.string(),
        }),
      mobilePhone: Yup.string()
        .test('check valid', 'Số điện thoại không hợp lệ', phone => {
          const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
          if (!phone) {
            return true
          }
          return regex.test(phone as string)
        })
        .when('email', {
          is: (email: string) => !email || email.length === 0,
          then: Yup.string().required(messages.MSG1),
          otherwise: Yup.string(),
        }),
      displayName: Yup.string()
        .min(0, 'email must be at least 0 characters')
        .max(256, 'email must be at almost 256 characters'),
    },
    [['email', 'mobilePhone']],
  )

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

  useEffect(() => {
    if (!!customer.data) {
      defaultValues.email = customer.data.email ?? ''
      defaultValues.mobilePhone = customer.data.mobilePhone ?? ''
      defaultValues.fullName = customer.data.fullName ?? ''
      defaultValues.otp =
        customer.data?.otpCount && customer.data?.otpCount[0].type
      defaultValues.type = customer.data.type ?? 1

      setMediasSrcPreviewer([
        {
          mediaType: EMediaType.AVATAR,
          mediaFormat: EMediaFormat.IMAGE,
          url:
            customer.data.avatar ?? '/assets/images/avatars/avatar-duck.jpeg',
        },
      ])

      methods.reset({ ...defaultValues })
    }
  }, [customer.data])

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const email = methods.watch('email')
  const phone = methods.watch('mobilePhone')

  useEffect(() => {
    if (!!email?.length) {
      methods.clearErrors('mobilePhone')
    }
    if (!!phone?.length) {
      methods.clearErrors('email')
    }
  }, [email, phone])

  const [
    selectFiles,
    uploadFiles,
    removeSelectedFiles,
    cancelUpload,
    uploading,
    progressInfos,
    message,
    fileInfos,
  ] = useUploadFiles()

  const onSuccess = (data: any) => {
    toastSuccess({ message: 'Cập nhật thành công' })
  }

  const { mutate: updateCustomer, isLoading: updateLoading } =
    useUpdateCustomer(onSuccess)

  const { mutate: addOtpCount, isLoading: addOtpLoading } =
    useAddOtpCountCustomer(onSuccess)

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    updateCustomer({
      ...values,
      avatar: (fileInfos[0] && fileInfos[0].url) ?? '',
      cusId: customerId,
    })
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
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 999 }}
      >
        {customer.data?.status !== -1 && (
          <>
            <MuiButton
              disabled={!!Object.keys(methods.formState.errors).length}
              title="Lưu"
              loading={updateLoading}
              variant="contained"
              color="primary"
              onClick={methods.handleSubmit(onSubmitHandler)}
              startIcon={<Icon>done</Icon>}
            />
            <MuiButton
              title="Huỷ"
              variant="contained"
              color="warning"
              onClick={() => {
                removeSelectedFiles()
                setMediasSrcPreviewer([
                  {
                    mediaType: EMediaType.AVATAR,
                    mediaFormat: EMediaFormat.IMAGE,
                    url:
                      customer?.data?.avatar ??
                      '/assets/images/avatars/avatar-duck.jpeg',
                  },
                ])
                methods.reset()
              }}
              startIcon={<Icon>clear</Icon>}
            />
          </>
        )}
        <MuiButton
          title="Quay lại"
          variant="contained"
          color="inherit"
          onClick={() => navigation(-1)}
          startIcon={<Icon>keyboard_return</Icon>}
        />
      </Stack>
      <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
        <FormProvider {...methods}>
          <Grid container spacing={3}>
            <Grid item sm={6} xs={12}>
              <SimpleCard>
                <Stack gap={3}>
                  <FormInputText
                    label={'Email'}
                    type="email"
                    name="email"
                    placeholder="Nhập Email"
                    fullWidth
                    defaultValue=""
                  />
                  <FormInputText
                    label={' Số điện thoại'}
                    type="text"
                    name="mobilePhone"
                    placeholder="Nhập SĐT"
                    fullWidth
                    defaultValue=""
                  />
                  <FormInputText
                    label={'Tên hiển thị'}
                    type="text"
                    name="fullName"
                    placeholder="Nhập họ và tên"
                    fullWidth
                    defaultValue=""
                  />
                  <Stack flexDirection={'row'} alignItems={'center'}>
                    <Box flex={1}>
                      <SelectDropDown
                        label="OTP trong ngày"
                        name="otp"
                        defaultValue=""
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

                  <Stack gap={1.5}>
                    <Grid container alignItems={'center'}>
                      <Grid item sm={6} md={4} xs={6}>
                        <MuiTypography variant="subtitle2">
                          Đăng ký bằng:
                        </MuiTypography>
                      </Grid>
                      <Grid item sm={6} md={8} xs={6}>
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
                    <Grid container alignItems={'center'}>
                      <Grid item sm={6} md={4} xs={6}>
                        <MuiTypography variant="subtitle2">
                          Lần cuối đăng nhập:
                        </MuiTypography>
                      </Grid>
                      <Grid item sm={6} md={8} xs={6}>
                        <MuiTypography variant="subtitle2" color="primary">
                          {customer?.data?.lastLoginDate
                            ? ISODateTimeFormatter(
                                customer?.data?.lastLoginDate ?? '',
                              )
                            : ''}
                        </MuiTypography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems={'center'}>
                      <Grid item sm={6} md={4} xs={6}>
                        <MuiTypography variant="subtitle2">
                          Mã giới thiệu:
                        </MuiTypography>
                      </Grid>
                      <Grid item sm={6} md={8} xs={6}>
                        <MuiTypography variant="subtitle2" color="primary">
                          {customer?.data?.referralCode}
                        </MuiTypography>
                      </Grid>
                    </Grid>
                  </Stack>
                </Stack>

                {updateLoading && <LinearProgress />}
              </SimpleCard>
            </Grid>

            <Grid item sm={6} xs={12}>
              <SimpleCard>
                <Stack alignItems={'center'} justifyContent={'center'}>
                  <Stack alignItems={'center'} px={3} gap={2}>
                    <>
                      <UploadPreviewer
                        name="files"
                        mediasSrcPreviewer={mediasSrcPreviewer}
                        setMediasSrcPreviewer={setMediasSrcPreviewer}
                        mediaConfigs={fileConfigs}
                        selectFiles={selectFiles}
                        uploadFiles={uploadFiles}
                        uploading={uploading}
                        progressInfos={progressInfos}
                      />

                      {methods.getValues('files') && !uploading && (
                        <Stack
                          maxWidth={'100%'}
                          flexDirection={'row'}
                          gap={0.5}
                          alignItems={'center'}
                        >
                          <CheckCircleOutlineRounded color="primary" />
                          <MuiTypography fontSize="0.75rem">
                            {
                              (methods.getValues('files')[0].name ??
                                '') as string
                            }
                          </MuiTypography>
                          <IconButton
                            onClick={() => {
                              methods.clearErrors('files')
                              methods.setValue('files', null)
                              removeSelectedFiles()
                              setMediasSrcPreviewer([
                                {
                                  mediaType: EMediaType.AVATAR,
                                  mediaFormat: EMediaFormat.IMAGE,
                                  url:
                                    (customer.data && customer.data.avatar) ??
                                    '/assets/images/avatars/avatar-duck.jpeg',
                                },
                              ])
                            }}
                          >
                            <ClearSharp color="error" />
                          </IconButton>
                        </Stack>
                      )}
                    </>

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

                    <Stack flexDirection={'row'} alignItems="center" gap={1}>
                      <SelectDropDown
                        label="Loại TK"
                        name="type"
                        defaultValue=""
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
                    <Stack flexDirection={'row'}>
                      {customer.data?.status !== -2 && (
                        <>
                          <MuiButton
                            title={'Khoá'}
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
                            sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
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
                        title="Đổi mật khẩu"
                        variant="text"
                        color="secondary"
                        sx={{ flex: 1 }}
                        startIcon={<ChangeCircleSharp />}
                      />
                    </Stack>
                  )}
                </Stack>
              </SimpleCard>
            </Grid>
          </Grid>
        </FormProvider>
      </form>

      <SimpleCard title="Log hành động">
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
