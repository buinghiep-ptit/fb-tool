import { yupResolver } from '@hookform/resolvers/yup'
import {
  FormControlLabel,
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  Radio,
  Stack,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { uploadFileAll } from 'app/apis/uploads/upload.service'
import { BoxWrapperDialog } from 'app/components/common/BoxWrapperDialog'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { MuiRHFRadioGroup } from 'app/components/common/MuiRHFRadioGroup'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useOrderDetailData,
  usePaymentConfirmOrder,
} from 'app/hooks/queries/useOrdersData'
import { CurrencyFormatter } from 'app/utils/formatters/currencyFormatter'
import { messages } from 'app/utils/messages'
import React, { useMemo, useRef } from 'react'
import Dropzone from 'react-dropzone'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

type SchemaType = {
  transCode?: string
  files?: any
  fileUrl?: string
  bankAccount?: string
  paymentType?: 1 | 2
  // amount?: number
  note?: string
}

export default function PaymentConfirm({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const { orderId } = useParams()
  const dropzoneAudioRef = useRef(null) as any

  const { data: order } = useOrderDetailData(Number(orderId ?? 0))

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    navigate(-1)
  }

  const validationSchema = Yup.object().shape({
    transCode: Yup.string()
      .max(255, 'Nội dung không được vượt quá 255 ký tự')
      .required(messages.MSG1),
    bankAccount: Yup.string()
      .max(255, 'Nội dung không được vượt quá 255 ký tự')
      .required(messages.MSG1),
    paymentType: Yup.string().required(messages.MSG1),
    // amount: Yup.string()
    //   .max(11, 'Chỉ được nhập tối đa 9 ký tự')
    //   .required(messages.MSG1),
    note: Yup.string()
      .max(255, 'Nội dung không được vượt quá 255 ký tự')
      .required(messages.MSG1),
  })

  const methods = useForm<SchemaType>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: paymentConfirm, isLoading: isLoading } =
    usePaymentConfirmOrder(() =>
      onSuccess(null, 'Xác nhận thanh toán thành công'),
    )

  const onSubmitHandler: SubmitHandler<SchemaType> = async (
    values: SchemaType,
  ) => {
    // const amount = values?.amount?.toString().replace(/,(?=\d{3})/g, '') ?? 0
    let fileResponse
    try {
      if (values.files) fileResponse = await uploadFileAll(values.files)
    } catch (error) {
      methods.setValue('files', undefined)
    }

    const payload = {
      transCode: values.transCode,
      fileUrl: (fileResponse && fileResponse.url) || null,
      bankAccount: values.bankAccount,
      paymentType: Number(values.paymentType ?? 1),
      note: values.note,
      // amount: Number(amount ?? 0),
    }
    paymentConfirm({ orderId: Number(orderId ?? 0), payload: payload })
  }

  const handleClose = () => {
    navigate(-1)
  }

  const openDialogFileAudio = () => {
    if (dropzoneAudioRef.current) {
      dropzoneAudioRef.current.open()
    }
  }
  const removeAudioSelected = () => {
    methods.setValue('files', undefined)
  }

  const getContent = () => {
    return (
      <BoxWrapperDialog>
        <FormProvider {...methods}>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <Stack my={1.5} gap={3}>
                <MuiTypography variant="subtitle2">
                  Xác nhận khách hàng đã chuyển khoản?
                </MuiTypography>
                <FormInputText
                  type="text"
                  label={'Mã giao dịch'}
                  name="transCode"
                  placeholder="Nhập mã giao dịch"
                  defaultValue=""
                  required
                  sx={{ flex: 1 }}
                />

                <Box sx={{ width: '100%' }}>
                  <Dropzone
                    ref={dropzoneAudioRef}
                    onDrop={acceptedFiles => {
                      if (!acceptedFiles || !acceptedFiles.length) return

                      methods.setValue('files', acceptedFiles[0])
                      methods.clearErrors('files')
                    }}
                    accept={{
                      'text/*': [
                        '.xlsx',
                        '.xls',
                        '.csv',
                        '.pdf',
                        '.pptx',
                        '.pptm',
                        '.ppt',
                        '.docx',
                      ],
                      'video/mp4': [],
                      'video/webm': [],
                      'video/mov': [],
                      'audio/mp3': ['.mp3'],
                      'audio/wav': ['.wav'],
                      'audio/ogg': ['.ogg'],
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                    }}
                    multiple={false}
                    maxSize={20 * 1024 * 1024}
                    // validator: nameLengthValidator
                  >
                    {({
                      getRootProps,
                      getInputProps,
                      isDragAccept,
                      isDragReject,
                      fileRejections,
                    }) => {
                      const style = useMemo(() => {
                        if (fileRejections && fileRejections.length)
                          methods.setError('files', {
                            message: fileRejections[0]?.errors[0]?.message,
                          })
                        else methods.clearErrors('files')
                      }, [isDragAccept, isDragReject, fileRejections])
                      return (
                        <>
                          <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            {!methods.getValues('files') && ( // is no file
                              <Stack
                                flexDirection={'row'}
                                sx={{
                                  background: 'rgba(22, 24, 35, 0.03)',
                                  borderRadius: 1.5,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                  border: '2px dashed rgba(22, 24 , 35, 0.2)',
                                  '&:hover': {
                                    border: '2px dashed #2F9B42',
                                  },
                                }}
                              >
                                <IconButton>
                                  <Icon>upload</Icon>
                                </IconButton>

                                <Stack alignItems={'center'}>
                                  <MuiTypography variant="body2">
                                    Chọn hoặc kéo thả file
                                  </MuiTypography>
                                  <MuiTypography
                                    variant="body2"
                                    fontSize={'0.75rem'}
                                  >
                                    {`(tối đa 20MB)`}
                                  </MuiTypography>
                                </Stack>
                              </Stack>
                            )}
                          </div>
                          {methods.getValues('files') && (
                            <Stack
                              flexDirection={'row'}
                              sx={{
                                alignItems: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <MuiTypography variant="body1">
                                {methods.getValues('files')?.name}
                              </MuiTypography>

                              <Stack flexDirection={'row'} gap={1} ml={2}>
                                <Tooltip arrow title={'Chọn lại'}>
                                  <IconButton
                                    sx={{
                                      bgcolor: '#303030',
                                      borderRadius: 1,
                                    }}
                                    onClick={openDialogFileAudio}
                                  >
                                    <Icon sx={{ color: 'white' }}>cached</Icon>
                                  </IconButton>
                                </Tooltip>
                                <Tooltip arrow title={'Xóa'}>
                                  <IconButton
                                    sx={{
                                      bgcolor: '#303030',
                                      borderRadius: 1,
                                    }}
                                    onClick={removeAudioSelected}
                                  >
                                    <Icon sx={{ color: 'white' }}>delete</Icon>
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Stack>
                          )}
                        </>
                      )
                    }}
                  </Dropzone>
                  {methods.formState.errors.files && (
                    <FormHelperText error>
                      {methods.formState.errors.files?.message as string}
                    </FormHelperText>
                  )}
                </Box>

                <FormInputText
                  type="text"
                  label={'STK nhận'}
                  name="bankAccount"
                  placeholder="Nhập mã giao dịch"
                  defaultValue=""
                  required
                />

                <Stack gap={1}>
                  <MuiRHFRadioGroup name="paymentType" defaultValue={2}>
                    <MuiTypography variant="subtitle2">
                      Loại thanh toán:
                    </MuiTypography>
                    <Stack flexDirection={'row'} gap={1.5}>
                      <FormControlLabel
                        value={2}
                        control={<Radio />}
                        label="Đặt cọc"
                      />
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label="Thanh toán toàn bộ"
                      />
                    </Stack>
                  </MuiRHFRadioGroup>
                  <MuiTypography variant="subtitle2">
                    Giá trị:{' '}
                    <span style={{ color: '#2F9B42' }}>
                      {methods.watch('paymentType') == 1
                        ? CurrencyFormatter(order?.amount ?? 0, 2)
                        : CurrencyFormatter(order?.deposit ?? 0, 2)}
                    </span>{' '}
                    VNĐ
                  </MuiTypography>
                </Stack>

                {/* <MuiRHFNumericFormatInput
                  type="text"
                  name="amount"
                  label="Giá trị"
                  placeholder="Nhập giá"
                  fullWidth
                  required
                  iconEnd={
                    <MuiTypography variant="subtitle2">VNĐ</MuiTypography>
                  }
                  isAllowZeroFirst={false}
                /> */}

                <Box>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Ghi chú:
                  </MuiTypography>
                  <FormTextArea
                    name="note"
                    defaultValue={''}
                    placeholder="Nhập nội dung"
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </FormProvider>
      </BoxWrapperDialog>
    )
  }

  return (
    <React.Fragment>
      <MuiStyledModal
        title={title}
        open={isModal}
        onCloseModal={handleClose}
        isLoading={isLoading}
        maxWidth="sm"
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        submitText="Xác nhận"
        cancelText="Quay lại"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
