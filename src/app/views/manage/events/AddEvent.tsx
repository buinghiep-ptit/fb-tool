import { yupResolver } from '@hookform/resolvers/yup'
import {
  Grid,
  Icon,
  LinearProgress,
  MenuItem,
  Stack,
  styled,
} from '@mui/material'
import { Box } from '@mui/system'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getEventDetail } from 'app/apis/events/event.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiAutocompleteWithTags } from 'app/components/common/MuiRHFAutocompleteWithTags'
import { MuiCheckBox } from 'app/components/common/MuiRHFCheckbox'
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiRHFNumericFormatInput from 'app/components/common/MuiRHFWithNumericFormat'
import { MuiTypography } from 'app/components/common/MuiTypography'
import RHFWYSIWYGEditor from 'app/components/common/RHFWYSIWYGEditor'
import { UploadPreviewer } from 'app/components/common/UploadPreviewer'
import { toastSuccess } from 'app/helpers/toastNofication'
import { checkIfFilesAreTooBig } from 'app/helpers/validateUploadFiles'
import {
  useCreateEvent,
  useDeleteEvent,
  useUpdateEvent,
} from 'app/hooks/queries/useEventsData'
import { useUploadFiles } from 'app/hooks/useFilesUpload'
import { IEventDetail, IMediaOverall, ITags } from 'app/models'
import { EMediaFormat, EMediaType } from 'app/utils/enums/medias'
import { GtmToYYYYMMDD } from 'app/utils/formatters/dateTimeFormatters'
import { messages } from 'app/utils/messages'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { DiagLogConfirm } from '../orders/details/ButtonsLink/DialogConfirm'

export interface Props {}

type SchemaType = {
  name?: string
  type?: number
  files?: any
  isEveryYear?: boolean
  startDate?: string
  endDate?: string
  hashtag?: ITags[]
  amount?: number
  status?: number
  editor_content?: string
}

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function AddEvent(props: Props) {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const [fileConfigs, setFileConfigs] = useState({
    mediaType: EMediaType.POST,
    mediaFormat: EMediaFormat.IMAGE,
    accept: 'image/*',
    multiple: true,
  })
  const [mediasSrcPreviewer, setMediasSrcPreviewer] = useState<IMediaOverall[]>(
    [],
  )

  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string
    type?: string
  }>({})
  const [openDialog, setOpenDialog] = useState(false)

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

  const [defaultValues] = useState<SchemaType>({
    type: EMediaFormat.IMAGE,
    isEveryYear: false,
    hashtag: [],
    status: 1,
  })

  const validationSchema = Yup.object().shape(
    {
      name: Yup.string()
        .required(messages.MSG1)
        .max(255, 'Nội dung không được vượt quá 255 ký tự'),
      startDate: Yup.date()
        .when('endDate', (endDate, yup) => {
          if (endDate && endDate != 'Invalid Date') {
            const dayAfter = new Date(endDate.getTime())
            return yup.max(dayAfter, 'Ngày đắt đầu không lớn hơn ngày kết thúc')
          }
          return yup
        })
        .typeError('Sai định dạng.')
        .nullable()
        .required(messages.MSG1),
      endDate: Yup.date()
        .when('startDate', (startDate, yup) => {
          if (startDate && startDate != 'Invalid Date') {
            const dayAfter = new Date(startDate.getTime() + 0)
            return yup.min(dayAfter, 'Ngày kết thúc phải lớn hơn ngày đắt đầu')
          }
          return yup
        })
        .typeError('Sai định dạng.')
        .nullable()
        .required(messages.MSG1),
      amount: Yup.number()
        .max(999999999, 'Chỉ được nhập tối đa 9 chữ số')
        .nullable(),
      files: Yup.mixed()
        .test('empty', messages.MSG1, files => {
          // if (!!Number(eventId ?? 0)) {
          const media = ((fileInfos ?? []) as IMediaOverall[]).find(
            media =>
              media.mediaFormat === fileConfigs.mediaFormat &&
              media.mediaType === 3,
          )

          if (files && files.length) {
            return true
          }

          return !!media
          // }
          // const isError = files && !!files.length
          // return isError
        })
        .test(
          'fileSize',
          fileConfigs.mediaFormat === EMediaFormat.VIDEO
            ? 'Dung lượng video tối đa 3 phút'
            : 'Dung lượng ảnh tối đa 10MB/ảnh',
          files => checkIfFilesAreTooBig(files, fileConfigs.mediaFormat),
        ),
      hashtag: Yup.array().max(50, 'Hashtag tối đa là 50').nullable(),
      editor_content: Yup.string().required(messages.MSG1),
    },
    ['startDate', 'endDate'] as any,
  )

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const isEveryYear = methods.watch('isEveryYear')
  const startDate = methods.watch('startDate')
  const endDate = methods.watch('endDate')

  useEffect(() => {
    if (!startDate || !endDate) return

    if (
      moment(new Date(startDate)).unix() <= moment(new Date(endDate)).unix()
    ) {
      methods.clearErrors('startDate')
      methods.clearErrors('endDate')
    }
  }, [startDate, endDate])

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

  const {
    data: event,
    isLoading,
    fetchStatus,
    isError,
    error,
  }: UseQueryResult<IEventDetail, Error> = useQuery<IEventDetail, Error>(
    ['event', eventId],
    () => getEventDetail(Number(eventId ?? 0)),
    {
      enabled: !!eventId,
      staleTime: 5 * 60 * 1000,
    },
  )

  const formatDateToISO = (
    date?: string,
    isEveryYear?: 0 | 1,
    check?: boolean,
  ) => {
    if (!date) return ''
    const darr = date.split('/') // ["25", "09", "2019"]
    const ISOFormat = new Date(
      isEveryYear === 1
        ? check
          ? new Date().getFullYear() + 1
          : new Date().getFullYear()
        : parseInt(darr[2]),
      parseInt(darr[1]) - 1,
      parseInt(darr[0]),
    )

    return ISOFormat.toISOString()
  }

  const compareDate = (start?: string, end?: string) => {
    if (!start || !end) return false
    const darrStart = start.split('/')
    const darrEnd = end.split('/')

    if (parseInt(darrEnd[1]) < parseInt(darrStart[1])) return true
    return false
  }

  useEffect(() => {
    initDefaultValues(event)
  }, [event])

  const initDefaultValues = (event?: IEventDetail) => {
    if (event) {
      defaultValues.name = event.name
      defaultValues.isEveryYear = event.isEveryYear === 1 ? true : false
      defaultValues.hashtag = event.tags
      defaultValues.amount = event.amount
      defaultValues.status = event.status
      defaultValues.editor_content = event.content
      const check =
        event.isEveryYear === 1 && compareDate(event.startDate, event.endDate)

      defaultValues.startDate = formatDateToISO(
        event.startDate,
        event.isEveryYear,
      )
      defaultValues.endDate = formatDateToISO(
        event.endDate,
        event.isEveryYear,
        check,
      )
      defaultValues.editor_content = event.content
      defaultValues.type =
        event.medias && event.medias.length && event.medias[0].mediaFormat

      if (
        event.medias &&
        event.medias.length &&
        event.medias[0].mediaFormat === EMediaFormat.IMAGE
      ) {
        setFileConfigs(prev => ({
          ...prev,
          mediaFormat: EMediaFormat.IMAGE,
          multiple: true,
          accept: 'image/*',
        }))
      } else {
        setFileConfigs(prev => ({
          ...prev,
          mediaFormat: EMediaFormat.VIDEO,
          accept: 'video/*',
          multiple: false,
        }))
      }
      setMediasSrcPreviewer([
        ...(event.medias?.filter(f => f.mediaType === 3) ?? []),
      ])
      setInitialFileInfos([
        ...(event.medias?.filter(f => f.mediaType === 3) ?? []),
      ])
    } else {
      setMediasSrcPreviewer([])
    }

    // removeUploadedFiles() // refactor here , remove this line ???
    methods.reset({ ...defaultValues })
  }

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    const amount = values?.amount?.toString().replace(/,(?=\d{3})/g, '') ?? 0

    const files = (fileInfos as IMediaOverall[])
      .filter(
        (f: IMediaOverall) =>
          f.mediaFormat === fileConfigs.mediaFormat &&
          !f.thumbnail &&
          f.mediaType === 3,
      )
      .map((file: IMediaOverall) => ({
        mediaType: EMediaType.POST,
        mediaFormat: fileConfigs.mediaFormat,
        url: file.url,
        detail: file.detail ?? null,
      }))

    let thumbnails = (fileInfos as IMediaOverall[]).filter(
      (f: IMediaOverall) => f.thumbnail,
    )

    if (fileConfigs.mediaFormat == EMediaFormat.IMAGE) {
      thumbnails = thumbnails
        .filter((f: IMediaOverall) => f.thumbnail?.type === 'image')
        .map((file: IMediaOverall) => ({
          mediaType: EMediaType.COVER,
          mediaFormat: EMediaFormat.IMAGE,
          url: file.url,
        }))
    } else if (fileConfigs.mediaFormat == EMediaFormat.VIDEO) {
      thumbnails = thumbnails
        .filter((f: IMediaOverall) => f.thumbnail?.type === 'video')
        .map((file: IMediaOverall) => ({
          mediaType: EMediaType.COVER,
          mediaFormat: EMediaFormat.IMAGE,
          url: file.url,
        }))
    }

    let medias: IMediaOverall[] = []
    if (fileConfigs.mediaFormat === EMediaFormat.VIDEO) {
      medias = [
        {
          ...files[files.length - 1],
          detail:
            thumbnails && thumbnails.length
              ? {
                  ...files[files.length - 1].detail,
                  coverImgUrl: thumbnails[thumbnails.length - 1].url,
                }
              : null,
        },
      ]
    } else if (fileConfigs.mediaFormat === EMediaFormat.IMAGE) {
      medias =
        thumbnails && thumbnails.length ? [thumbnails[0], ...files] : files
    }

    const payload: IEventDetail = {
      name: values.name,
      content: values.editor_content,
      medias: medias,
      isEveryYear: values.isEveryYear ? 1 : 0,
      startDate: GtmToYYYYMMDD(values.startDate as string),
      endDate: GtmToYYYYMMDD(values.endDate as string),
      amount: Number(amount),
      status: Number(values.status ?? -1),
      tags: values.hashtag ?? [],
    }
    if (eventId) {
      edit({ ...payload, id: Number(eventId) })
    } else {
      add(payload)
    }
  }
  const onRowUpdateSuccess = (data: any, message?: string) => {
    toastSuccess({ message: message ?? '' })
    navigate(-1)
    methods.reset()
  }
  const { mutate: add, isLoading: createLoading } = useCreateEvent(() =>
    onRowUpdateSuccess(null, 'Thêm mới thành công'),
  )

  const { mutate: edit, isLoading: editLoading } = useUpdateEvent(() =>
    onRowUpdateSuccess(null, 'Cập nhật thành công'),
  )

  const { mutate: deleteEvent, isLoading: deleteLoading } = useDeleteEvent(() =>
    onRowUpdateSuccess(null, 'Xoá sự kiện thành công'),
  )

  const onDeleteEvent = () => {
    if (eventId) deleteEvent(Number(eventId))
  }

  const openDeleteDialog = () => {
    setDialogData(prev => ({
      ...prev,
      title: 'Xoá sự kiện',
      message: 'Bạn có chắc chắn muốn xoá sự kiện?',
      type: 'delete',
    }))
    setOpenDialog(true)
  }

  useEffect(() => {
    if (Number(methods.watch('type') ?? 0) === EMediaFormat.IMAGE) {
      setFileConfigs(prev => ({
        ...prev,
        mediaFormat: EMediaFormat.IMAGE,
        multiple: true,
        accept: 'image/*',
      }))
    } else {
      setFileConfigs(prev => ({
        ...prev,
        mediaFormat: EMediaFormat.VIDEO,
        accept: 'video/*',
        multiple: false,
      }))
    }
    methods.setValue('files', null)
  }, [methods.watch('type')])

  if (isLoading && fetchStatus === 'fetching') return <MuiLoading />

  if (isError)
    return (
      <Box my={2} textAlign="center">
        <MuiTypography variant="h5">
          Have an errors: {error.message}
        </MuiTypography>
      </Box>
    )
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý sự kiện', path: '/quan-ly-su-kien' },
            { name: eventId ? 'Chi tiết sự kiện' : 'Thêm mới sự kiện' },
          ]}
        />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 999 }}
      >
        <MuiButton
          title="Lưu"
          variant="contained"
          color="primary"
          onClick={methods.handleSubmit(onSubmitHandler)}
          loading={createLoading || editLoading}
          startIcon={<Icon>done</Icon>}
          disabled={uploading}
        />
        <MuiButton
          disabled={uploading}
          title="Huỷ"
          variant="contained"
          color="warning"
          onClick={() => {
            removeUploadedFiles(undefined, fileConfigs.mediaFormat)
            initDefaultValues(event)
          }}
          startIcon={<Icon>cached</Icon>}
        />

        {eventId && (
          <MuiButton
            disabled={uploading}
            title="Xoá"
            variant="contained"
            color="error"
            onClick={openDeleteDialog}
            startIcon={<Icon>delete</Icon>}
          />
        )}

        <MuiButton
          title="Quay lại"
          variant="contained"
          color="inherit"
          onClick={() => navigate(-1)}
          startIcon={<Icon>keyboard_return</Icon>}
        />
      </Stack>
      {/* <button onClick={() => setIsFileDialogOpen(true)}>Open Click</button> */}

      <SimpleCard>
        <form
          onSubmit={methods.handleSubmit(onSubmitHandler)}
          noValidate
          autoComplete="off"
        >
          <FormProvider {...methods}>
            <Grid container spacing={3}>
              <Grid item sm={5} xs={12}>
                <Stack gap={3}>
                  {(createLoading || editLoading) && (
                    <LinearProgress sx={{ mt: 0.5 }} />
                  )}

                  <Stack>
                    <FormInputText
                      type="text"
                      name="name"
                      label={'Tên sự kiện'}
                      defaultValue=""
                      placeholder="Nhập tên events"
                      fullWidth
                    />
                  </Stack>
                  <Stack flexDirection={'column'}>
                    <Stack
                      flexDirection={'row'}
                      gap={1.5}
                      alignItems={'center'}
                    >
                      <MuiTypography variant="subtitle2" pb={1}>
                        Thời gian diễn ra:
                      </MuiTypography>
                      <Box mt={-1}>
                        <MuiCheckBox name="isEveryYear" label="Hàng năm" />
                      </Box>
                    </Stack>

                    <Stack flexDirection={'row'} gap={3}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {isEveryYear && (
                          <>
                            <Stack flexDirection={'row'} gap={1}>
                              <MuiRHFDatePicker
                                name="startDate"
                                label="Ngày bắt đầu"
                                inputFormat={'DD/MM'}
                              />
                            </Stack>
                            <Stack flexDirection={'row'} gap={1}>
                              <MuiRHFDatePicker
                                name="endDate"
                                label="Ngày kết thúc"
                                inputFormat={'DD/MM'}
                              />
                            </Stack>
                          </>
                        )}
                        {!isEveryYear && (
                          <>
                            <Stack flexDirection={'row'} gap={1}>
                              <MuiRHFDatePicker
                                name="startDate"
                                label="Ngày bắt đầu"
                                inputFormat={'DD/MM/YYYY'}
                              />
                            </Stack>
                            <Stack flexDirection={'row'} gap={1}>
                              <MuiRHFDatePicker
                                name="endDate"
                                label="Ngày kết thúc"
                                inputFormat={'DD/MM/YYYY'}
                              />
                            </Stack>
                          </>
                        )}
                      </LocalizationProvider>
                      {/* <CalPicker
                        label="Select date and time"
                        name="startDate"
                      /> */}
                    </Stack>
                  </Stack>
                  <Stack>
                    <SelectDropDown
                      name="type"
                      label="Loại file tải lên"
                      disabled={uploading}
                    >
                      <MenuItem value={1}>Video</MenuItem>
                      <MenuItem value={2}>Ảnh</MenuItem>
                    </SelectDropDown>
                  </Stack>
                  <Stack>
                    <MuiAutocompleteWithTags name="hashtag" label="Hashtag" />
                  </Stack>

                  <MuiRHFNumericFormatInput
                    type="text"
                    name="amount"
                    label="Giá tham gia"
                    placeholder="Nhập giá"
                    iconEnd={
                      <MuiTypography variant="subtitle2">VNĐ</MuiTypography>
                    }
                    fullWidth
                  />

                  <Stack>
                    <SelectDropDown name="status" label="Trạng thái">
                      <MenuItem value="1">Hoạt động</MenuItem>
                      <MenuItem value="-1">Không hoạt động</MenuItem>
                    </SelectDropDown>
                  </Stack>
                </Stack>
              </Grid>

              <Grid
                item
                sm={7}
                xs={12}
                justifyContent="center"
                alignItems={'center'}
              >
                <Stack
                  gap={2}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Box
                    width={{
                      sx: '100%',
                      md:
                        fileConfigs.mediaFormat === EMediaFormat.VIDEO
                          ? 300
                          : 450,
                    }}
                    position="relative"
                  >
                    <UploadPreviewer
                      name="files"
                      initialMedias={event?.medias ?? []}
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
                      isFileDialogOpen={isFileDialogOpen}
                      setIsFileDialogOpen={setIsFileDialogOpen}
                      message={message}
                    />
                  </Box>
                </Stack>
              </Grid>

              <Grid item sm={12}>
                <Stack>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Nội dung
                  </MuiTypography>
                  <RHFWYSIWYGEditor name="editor_content" />
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </form>
      </SimpleCard>

      <DiagLogConfirm
        title={dialogData.title ?? ''}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={onDeleteEvent}
        submitText={'Xoá'}
        cancelText={'Huỷ'}
        isLoading={deleteLoading}
      >
        <Stack py={5} justifyContent={'center'} alignItems="center">
          <MuiTypography variant="subtitle1">
            {dialogData.message ?? ''}
          </MuiTypography>
          <MuiTypography variant="subtitle1" color="primary">
            {event?.name}
          </MuiTypography>
        </Stack>
      </DiagLogConfirm>
    </Container>
  )
}
