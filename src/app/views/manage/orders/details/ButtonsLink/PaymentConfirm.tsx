import { yupResolver } from '@hookform/resolvers/yup'
import { FormControlLabel, Grid, Radio, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { BoxWrapperDialog } from 'app/components/common/BoxWrapperDialog'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { MuiRHFRadioGroup } from 'app/components/common/MuiRHFRadioGroup'
import MuiRHFNumericFormatInput from 'app/components/common/MuiRHFWithNumericFormat'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { UploadPreviewer } from 'app/components/common/UploadPreviewer'
import { toastSuccess } from 'app/helpers/toastNofication'
import { checkIfFilesAreTooBig } from 'app/helpers/validateUploadFiles'
import {
  useNoteOrder,
  usePaymentConfirmOrder,
} from 'app/hooks/queries/useOrdersData'
import { useUploadFiles } from 'app/hooks/useFilesUpload'
import { IMediaOverall } from 'app/models'
import { EMediaFormat, EMediaType } from 'app/utils/enums/medias'
import { messages } from 'app/utils/messages'
import React, { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

type SchemaType = {
  transCode?: string
  files?: any
  bankAccount?: string
  paymentType?: 1 | 2
  amount?: number
}

export default function PaymentConfirm({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const { orderId } = useParams()
  const [mediasSrcPreviewer, setMediasSrcPreviewer] = useState<IMediaOverall[]>(
    [],
  )
  const [fileConfigs] = useState({
    mediaType: EMediaType.POST,
    mediaFormat: EMediaFormat.OFFICE,
    accept: '',
    multiple: true,
  })

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
    amount: Yup.string()
      .max(11, 'Chỉ được nhập tối đa 9 ký tự')
      .required(messages.MSG1),
    files: Yup.mixed().test(
      'fileSize',
      fileConfigs.mediaFormat === EMediaFormat.VIDEO
        ? 'Dung lượng video tối đa 3 phút'
        : 'Dung lượng ảnh tối đa 10MB/ảnh',
      files => checkIfFilesAreTooBig(files, fileConfigs.mediaFormat),
    ),
  })

  const [
    selectFiles,
    uploadFiles,
    removeUploadedFiles,
    cancelUploading,
    uploading,
    progressInfos,
    message,
    setInitialFileInfos,
    fileInfos,
  ] = useUploadFiles()

  const methods = useForm<SchemaType>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: paymentConfirm, isLoading: isLoading } =
    usePaymentConfirmOrder(() =>
      onSuccess(null, 'Xác nhận thanh toán thành công'),
    )

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    const amount = values?.amount?.toString().replace(/,(?=\d{3})/g, '') ?? 0
    const files = (fileInfos as IMediaOverall[]).filter(
      (f: IMediaOverall) => f.mediaFormat === fileConfigs.mediaFormat,
    )

    const payload = {
      transCode: values.transCode,
      fileUrl: files && files.length && files[0].url,
      bankAccount: values.bankAccount,
      paymentType: Number(values.paymentType ?? 1),
      amount: Number(amount ?? 0),
    }
    paymentConfirm({ orderId: Number(orderId ?? 0), payload: payload })
  }

  const handleClose = () => {
    navigate(-1)
  }

  const getContent = () => {
    return (
      <BoxWrapperDialog>
        <FormProvider {...methods}>
          <Grid container spacing={3}>
            <Grid item md={7} xs={12}>
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

                <FormInputText
                  type="text"
                  label={'STK nhận'}
                  name="bankAccount"
                  placeholder="Nhập mã giao dịch"
                  defaultValue=""
                  required
                />

                <Stack>
                  <MuiTypography variant="subtitle2">
                    Loại thanh toán:
                  </MuiTypography>
                  <MuiRHFRadioGroup name="paymentType" defaultValue={1}>
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
                </Stack>

                <MuiRHFNumericFormatInput
                  type="text"
                  name="amount"
                  label="Giá"
                  placeholder="Nhập giá"
                  fullWidth
                  required
                />
              </Stack>
            </Grid>
            <Grid
              item
              md={5}
              xs={12}
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}
            >
              <Box sx={{ width: '100%' }}>
                <UploadPreviewer
                  name="files"
                  initialMedias={[]}
                  fileInfos={fileInfos}
                  mediasSrcPreviewer={mediasSrcPreviewer}
                  setMediasSrcPreviewer={setMediasSrcPreviewer}
                  mediaConfigs={fileConfigs}
                  selectFiles={selectFiles}
                  uploadFiles={uploadFiles}
                  removeUploadedFiles={removeUploadedFiles}
                  cancelUploading={cancelUploading}
                  uploading={uploading}
                  progressInfos={progressInfos}
                />
              </Box>
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
        maxWidth="md"
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        submitText="Xác nhận"
        cancelText="Quay lại"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
