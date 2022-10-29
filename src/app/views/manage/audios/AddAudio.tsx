import { yupResolver } from '@hookform/resolvers/yup'
import { MenuItem, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { BoxWrapperDialog } from 'app/components/common/BoxWrapperDialog'
import { MuiCheckBox } from 'app/components/common/MuiRHFCheckbox'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { UploadPreviewer } from 'app/components/common/UploadPreviewer'
import { toastSuccess } from 'app/helpers/toastNofication'
import { checkIfFilesAreTooBig } from 'app/helpers/validateUploadFiles'
import { usePaymentConfirmOrder } from 'app/hooks/queries/useOrdersData'
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
  name?: string
  isDefault: boolean
  urlAudio?: string
  urlImage?: string
  author?: string
  performer?: string
  status?: 0 | 1
}

export default function AddAudio({ title }: Props) {
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
  const [defaultValues] = useState<SchemaType>({
    status: 1,
    isDefault: true,
  })

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    navigate(-1)
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .max(255, 'Nội dung không được vượt quá 255 ký tự')
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
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: paymentConfirm, isLoading: isLoading } =
    usePaymentConfirmOrder(() =>
      onSuccess(null, 'Xác nhận thanh toán thành công'),
    )

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    // const amount = values?.amount?.toString().replace(/,(?=\d{3})/g, '') ?? 0
    // const files = (fileInfos as IMediaOverall[]).filter(
    //   (f: IMediaOverall) => f.mediaFormat === fileConfigs.mediaFormat,
    // )
    // const payload = {
    //   transCode: values.transCode,
    //   fileUrl: files && files.length && files[0].url,
    //   bankAccount: values.bankAccount,
    //   paymentType: Number(values.paymentType ?? 1),
    //   amount: Number(amount ?? 0),
    // }
    // paymentConfirm({ orderId: Number(orderId ?? 0), payload: payload })
  }

  const handleClose = () => {
    navigate(-1)
  }

  const getContent = () => {
    return (
      <BoxWrapperDialog>
        <FormProvider {...methods}>
          <Stack my={1.5} gap={3}>
            <FormInputText
              type="text"
              label={'Tên bài hát'}
              name="name"
              placeholder="Nhập tên bài hát"
              defaultValue=""
              required
            />

            <Stack flexDirection={'row'} gap={3}>
              <MuiTypography variant="body2">Tải bài hát: *</MuiTypography>
            </Stack>

            <Stack flexDirection={'row'} gap={3}>
              <MuiTypography variant="body2">Ảnh:(1x1)</MuiTypography>
              <Box flex={1}>
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
            </Stack>

            <FormInputText
              type="text"
              label={'Tác giả'}
              name="author"
              placeholder="Nhập tên tác giả"
              defaultValue=""
            />

            <FormInputText
              type="text"
              label={'Người thể hiện'}
              name="performer"
              placeholder="Nhập tên người thế hiện"
              defaultValue=""
            />
            <SelectDropDown name="status" label="Trạng thái">
              <MenuItem value="1">Hoạt động</MenuItem>
              <MenuItem value="0">Không hoạt động</MenuItem>
            </SelectDropDown>
            <MuiCheckBox name="isDefault" label="Nhạc hay" />
          </Stack>
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
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        submitText="Lưu"
        cancelText="Quay lại"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
