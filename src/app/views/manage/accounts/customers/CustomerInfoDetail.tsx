import { yupResolver } from '@hookform/resolvers/yup'
import {
  AddBox,
  ChangeCircleSharp,
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
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { useQueries, UseQueryResult } from '@tanstack/react-query'
import {
  fetchLogsCustomer,
  getCustomerDetail,
} from 'app/apis/accounts/customer.service'
import { uploadApi } from 'app/apis/uploads/upload.service'
import { SimpleCard } from 'app/components'
import { DropWrapper } from 'app/components/common/ImageUploadPreviewer'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { compressImageFile } from 'app/helpers/compressFile'
import { toastError, toastSuccess } from 'app/helpers/toastNofication'
import {
  useAddOtpCountCustomer,
  useUpdateCustomer,
} from 'app/hooks/queries/useCustomersData'
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
import { useEffect, useRef, useState } from 'react'
import Dropzone from 'react-dropzone'
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type SchemaType = {
  email?: string
  mobilePhone?: string
  fullName?: string
  otp?: number
  typeFile?: number
  imageFile?: any
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
  const prevRoute = useLocation()
  const { customerId } = useParams()
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(10)

  const [imagePreviewer, setImagePreviewer] = useState<IMediaOverall | null>(
    null,
  )
  const dropzoneImgRef = useRef(null) as any

  const [filters, setFilters] = useState({
    customerId,
    page,
    size,
  })

  const [defaultValues] = useState<SchemaType>({ typeFile: EMediaFormat.IMAGE })
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const validationSchema = Yup.object().shape(
    {
      // email: Yup.string()
      //   .email(messages.MSG12)
      //   .when('mobilePhone', {
      //     is: (phone: string) => !phone || phone.length === 0,
      //     then: Yup.string().required(messages.MSG1).email(messages.MSG12),
      //     otherwise: Yup.string(),
      //   }),
      mobilePhone: Yup.string()
        .when('email', {
          is: (email: string) => !email || email.length === 0,
          then: Yup.string()
            .required(messages.MSG1)
            .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
            .min(10, 'Số điện thoại yêu cầu 10 ký tự')
            .max(10, 'Số điện thoại yêu cầu 10 ký tự'),
          otherwise: Yup.string()
            .matches(phoneRegExp, {
              message: 'Số điện thoại không hợp lệ',
              excludeEmptyString: true,
            })
            .test('len', 'Số điện thoại yêu cầu 10 ký tự', val => {
              if (val == undefined) {
                return true
              }
              return val.length == 0 || val.length === 10
            }),
        })
        .nullable(),
      fullName: Yup.string()
        .required(messages.MSG1)
        .min(0, 'email must be at least 0 characters')
        .max(255, 'Tên hiển thị không được vượt quá 255 ký tự'),
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

      if (customer.data.avatar) {
        setImagePreviewer({
          mediaType: EMediaType.AVATAR,
          mediaFormat: EMediaFormat.IMAGE,
          url: customer.data.avatar,
        })
      }

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

  const openDialogFileImage = () => {
    if (dropzoneImgRef.current) {
      dropzoneImgRef.current.open()
    }
  }
  const removeImageSelected = () => {
    setImagePreviewer(null)
    methods.setValue('imageFile', undefined)
  }

  const onSuccess = (data: any) => {
    toastSuccess({ message: 'Cập nhật thành công' })
  }

  const { mutate: updateCustomer, isLoading: updateLoading } =
    useUpdateCustomer(onSuccess)

  const { mutate: addOtpCount, isLoading: addOtpLoading } =
    useAddOtpCountCustomer(onSuccess)

  const onSubmitHandler: SubmitHandler<SchemaType> = async (
    values: SchemaType,
  ) => {
    let imgData
    if (values.imageFile) {
      const fileCompressed = await compressImageFile(values.imageFile)

      imgData = await uploadApi(fileCompressed, () => {}, null, {
        srcType: 9,
        idSrc: customerId,
      })
    }

    updateCustomer({
      cusId: Number(customerId ?? 0),
      payload: {
        mobilePhone: values.mobilePhone || undefined,
        fullName: values.fullName || undefined,
        avatar: imgData?.url || null,
        type: Number(values.type ?? 0),
      },
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
        {customer.data?.status !== -4 && customer.data?.id !== 0 && (
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
          </>
        )}
        <MuiButton
          title="Quay lại"
          variant="contained"
          color="inherit"
          onClick={() => {
            if (prevRoute && prevRoute?.state?.from) navigation(-1)
            else navigation('/quan-ly-tai-khoan-khach-hang', {})
          }}
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
                    disabled //!!customer.data?.email ?? false
                    clearIcon={false}
                  />
                  <FormInputText
                    label={'Số điện thoại'}
                    type="text"
                    name="mobilePhone"
                    disabled={
                      customer.data?.id === 0 || customer?.data?.status === -4
                    }
                    clearIcon={
                      customer.data?.id !== 0 && customer?.data?.status !== -4
                    }
                    placeholder="Nhập SĐT"
                    fullWidth
                    defaultValue=""
                  />
                  <FormInputText
                    label={'Tên hiển thị'}
                    type="text"
                    name="fullName"
                    disabled={
                      customer.data?.id === 0 || customer?.data?.status === -4
                    }
                    clearIcon={
                      customer.data?.id !== 0 && customer?.data?.status !== -4
                    }
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
                        disabled={
                          customer.data?.id === 0 ||
                          customer?.data?.status === -4
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
                      disabled={
                        customer.data?.id === 0 || customer?.data?.status === -4
                      }
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
                      <Dropzone
                        ref={dropzoneImgRef}
                        onDrop={(acceptedFiles, fileRejections) => {
                          console.log(fileRejections)
                          if (fileRejections.length) {
                            toastError({
                              message:
                                fileRejections[0].errors[0].code ===
                                'file-too-large'
                                  ? 'Ảnh tải lên không được vượt quá 10MB'
                                  : fileRejections[0].errors[0].message,
                            })
                          }
                          if (!acceptedFiles || !acceptedFiles.length) return
                          setImagePreviewer({
                            url: URL.createObjectURL(acceptedFiles[0]),
                          })
                          methods.setValue('imageFile', acceptedFiles[0])
                        }}
                        accept={{
                          'image/png': ['.png', '.PNG'],
                          'image/jpeg': ['.jpg', '.jpeg'],
                        }}
                        disabled={
                          customer.data?.status === -4 ||
                          customer.data?.id === 0
                        }
                        multiple={false}
                        maxSize={10 * 1024 * 1024}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <>
                            <div {...getRootProps({ className: 'dropzone' })}>
                              <input {...getInputProps()} />
                              {!imagePreviewer && (
                                <DropWrapper
                                  sx={{
                                    aspectRatio: 'auto 1 / 1',
                                    borderRadius: 1.5,
                                    display: 'flex',
                                    width: 200,
                                    height: 200,
                                  }}
                                >
                                  <Stack
                                    sx={{
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      gap: 0.5,
                                    }}
                                  >
                                    <MuiTypography
                                      variant="body2"
                                      textAlign={'center'}
                                    >
                                      Chọn hoặc kéo thả ảnh làm avatar
                                    </MuiTypography>
                                    <Icon>backup</Icon>
                                    <MuiTypography
                                      variant="body2"
                                      fontSize={'0.75rem'}
                                    >
                                      PNG / JPEG hoặc JPG
                                    </MuiTypography>
                                    <MuiTypography
                                      variant="body2"
                                      fontSize={'0.75rem'}
                                    >
                                      nhỏ hơn 10MB/ảnh
                                    </MuiTypography>
                                  </Stack>
                                </DropWrapper>
                              )}
                            </div>
                            {imagePreviewer && (
                              <Box
                                sx={{
                                  width: 200,
                                  height: 200,
                                  position: 'relative',
                                  aspectRatio: 'auto 1 / 1',
                                  borderRadius: 1.5,
                                  overflow: 'hidden',
                                  boxShadow:
                                    '0 2px 6px 0 rgba(0, 0, 0, 0.1), 0 4px 10px 0 rgba(0, 0, 0, 0.16)',
                                }}
                              >
                                {customer.data?.status !== -4 &&
                                  customer.data?.id !== 0 && (
                                    <Stack
                                      flexDirection={'row'}
                                      sx={{
                                        position: 'absolute',
                                        top: '6px',
                                        right: '6px',
                                        gap: 1,
                                      }}
                                    >
                                      <Tooltip arrow title={'Chọn lại'}>
                                        <IconButton
                                          sx={{
                                            bgcolor: '#303030',
                                            borderRadius: 1,
                                          }}
                                          onClick={openDialogFileImage}
                                        >
                                          <Icon sx={{ color: 'white' }}>
                                            cached
                                          </Icon>
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip arrow title={'Xóa'}>
                                        <IconButton
                                          sx={{
                                            bgcolor: '#303030',
                                            borderRadius: 1,
                                          }}
                                          onClick={removeImageSelected}
                                        >
                                          <Icon sx={{ color: 'white' }}>
                                            delete
                                          </Icon>
                                        </IconButton>
                                      </Tooltip>
                                    </Stack>
                                  )}

                                <img
                                  src={imagePreviewer.url}
                                  alt="thumb"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                              </Box>
                            )}
                          </>
                        )}
                      </Dropzone>
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
                      {customer?.data?.type !== -4 && customer.data?.id ? (
                        <SelectDropDown
                          label="Loại TK"
                          name="type"
                          defaultValue=""
                          sx={{ minWidth: 120 }}
                          disabled={customer.data?.status === -4}
                        >
                          <MenuItem value={1}>Thường</MenuItem>
                          <MenuItem value={2}>KOL</MenuItem>
                        </SelectDropDown>
                      ) : null}

                      {!customer.data?.id ? (
                        <FormInputText
                          label={'Loại TK'}
                          type="text"
                          name=""
                          placeholder="Nhập SĐT"
                          disabled
                          sx={{ width: 150 }}
                          required
                          defaultValue="Campdi"
                        />
                      ) : null}
                      {customer?.data?.type === -4 ? (
                        <FormInputText
                          label={'Loại TK'}
                          type="text"
                          name=""
                          placeholder="Nhập SĐT"
                          disabled
                          sx={{ width: 150 }}
                          required
                          defaultValue="Campdi(food)"
                        />
                      ) : null}

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

                  <Stack flexDirection={'row'}>
                    {customer.data?.id !== 0 && customer.data?.status !== -4 && (
                      <>
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
                              sx={{
                                backgroundColor: '#D9D9D9',
                                mx: 2,
                                my: 2,
                              }}
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
                              sx={{
                                backgroundColor: '#D9D9D9',
                                mx: 2,
                                my: 1,
                              }}
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
                      </>
                    )}
                  </Stack>
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
          rowsPerPage={size}
          page={page}
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
