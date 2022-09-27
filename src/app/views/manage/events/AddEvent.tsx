import { yupResolver } from '@hookform/resolvers/yup'
import { ApprovalRounded, CancelSharp } from '@mui/icons-material'
import { Grid, LinearProgress, MenuItem, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { createEvent, getEventDetail } from 'app/apis/events/event.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiAutocompleteWithTags } from 'app/components/common/MuiAutocompleteWithTags'
import { MuiButton } from 'app/components/common/MuiButton'
import { MuiCheckBox } from 'app/components/common/MuiCheckbox'
import FormInputText from 'app/components/common/MuiInputText'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
import { SelectDropDown } from 'app/components/common/MuiSelectDropdown'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { UploadMedias } from 'app/components/common/UploadPreviewer'
import WYSIWYGEditor from 'app/components/common/WYSIWYGEditor'
import { checkIfFilesAreTooBig } from 'app/helpers/validateUploadFiles'
import { useUploadFiles } from 'app/hooks/useFilesUpload'
import { IEventDetail, IMediaOverall, ITags } from 'app/models'
import moment from 'moment'
import { useEffect, useState } from 'react'
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'

export interface Props {}

type SchemaType = {
  name?: string
  typeFile?: number
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
  const { eventId } = useParams()
  const [loading, setLoading] = useState(false)
  const [fileConfigs, setFileConfigs] = useState({
    mediaFormat: 2,
    accept: 'image/*',
    multiple: true,
  })
  const [mediasSrcPreviewer, setMediasSrcPreviewer] = useState<IMediaOverall[]>(
    [],
  )

  const [defaultValues] = useState<SchemaType>({
    typeFile: 2,
    isEveryYear: false,
    hashtag: [{ value: 'hashtag' }],
    status: 1,
    amount: 0,
  })

  const validationSchema = Yup.object().shape({
    startDate: Yup.string()
      .nullable()
      .test('startDate', 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc', value => {
        console.log(
          moment().diff(moment(new Date(value as any), 'YYYY-MM-DD'), 'years'),
        )
        return moment().diff(moment(value, 'YYYY-MM-DD'), 'days') >= 1
      })
      .required('Chọn ngày bắt đầu'),
    endDate: Yup.string().nullable().required('Chọn ngày kết thúc'),
    name: Yup.string().required('Tên không được bỏ trống'),
    files: Yup.mixed()
      .required('Vui lòng chọn file')
      .test(
        'fileSize',
        'Dung lượng file quá lớn (10MB/ảnh và 3phút/video)',
        files => checkIfFilesAreTooBig(files, fileConfigs.mediaFormat),
      ),
  })

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const [selectFiles, uploadFiles, progressInfos, message, fileInfos] =
    useUploadFiles()

  const {
    data: event,
    isLoading,
    fetchStatus,
    isError,
    error,
  }: UseQueryResult<IEventDetail, Error> = useQuery<IEventDetail, Error>(
    ['feeds', eventId],
    () => getEventDetail(Number(eventId ?? 0)),
    {
      enabled: !!eventId,
    },
  )

  useEffect(() => {
    if (event) {
      defaultValues.name = event.name
      defaultValues.isEveryYear = event.isEveryYear === 1 ? true : false
      defaultValues.hashtag = event.tags
      defaultValues.amount = event.amount
      defaultValues.status = event.status
      defaultValues.editor_content = event.content

      setMediasSrcPreviewer(event.medias ?? [])

      methods.reset({ ...defaultValues })
    }
  }, [event])

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    console.log(values)
    setLoading(true)
    uploadFiles()
  }

  const createNewEvent = async (payload: any) => {
    try {
      const response = await createEvent(payload)
      setLoading(false)
    } catch (error) {}
  }

  useEffect(() => {
    if (fileInfos && fileInfos.length) {
      console.log('getValues:', methods.getValues())
      const files =
        fileConfigs.mediaFormat === 1
          ? [
              {
                mediaType: 6,
                mediaFormat: 1,
                url: fileInfos[0].url,
              },
            ]
          : fileInfos.map(file =>
              Object.assign(
                {},
                {
                  mediaType: 6,
                  mediaFormat: 2,
                  url: file.url,
                },
              ),
            )
      const payload = {
        name: methods.getValues('name'),
        content: methods.getValues('editor_content'),
        medias: files,
        isEveryYear: methods.getValues('isEveryYear') ? 1 : 0,
        startDate: '2022-09-27',
        endDate: '2022-09-27',
        amount: Number(methods.getValues('amount') ?? 0),
        status: Number(methods.getValues('status') ?? -1),
        tags: methods.getValues('hashtag'),
      }
      createNewEvent(payload)
    }
  }, [fileInfos])

  useEffect(() => {
    if (Number(methods.watch('typeFile') ?? 0) === 2) {
      setFileConfigs(prev => ({
        ...prev,
        mediaFormat: 2,
        multiple: true,
        accept: 'image/*',
      }))
    } else {
      setFileConfigs(prev => ({
        ...prev,
        mediaFormat: 1,
        accept: 'video/*',
        multiple: false,
      }))
    }
    methods.setValue('files', null)
  }, [methods.watch('typeFile')])

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
            { name: 'Thêm mới sự kiện' },
          ]}
        />
      </Box>
      <SimpleCard title="Thêm mới">
        <form
          onSubmit={methods.handleSubmit(onSubmitHandler)}
          noValidate
          autoComplete="off"
        >
          <FormProvider {...methods}>
            <Grid container spacing={3}>
              <Grid item sm={5} xs={12}>
                <Stack gap={3}>
                  <Grid container spacing={2}>
                    <Grid item sm={6} xs={6}>
                      <MuiButton
                        title="Lưu"
                        loading={false}
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ width: '100%' }}
                        startIcon={<ApprovalRounded />}
                      />
                    </Grid>
                    <Grid item sm={6} xs={6}>
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

                  {loading && <LinearProgress sx={{ mt: 0.5 }} />}

                  <Stack>
                    <FormInputText
                      type="text"
                      name="name"
                      label={'Tên sự kiện'}
                      defaultValue=""
                      size="small"
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
                        <Stack flexDirection={'row'} gap={1}>
                          <MuiRHFDatePicker
                            name="startDate"
                            label="Ngày bắt đầu"
                          />
                        </Stack>
                        <Stack flexDirection={'row'} gap={1}>
                          <MuiRHFDatePicker
                            name="endDate"
                            label="Ngày kết thúc"
                          />
                        </Stack>
                      </LocalizationProvider>
                      {/* <CalPicker
                        label="Select date and time"
                        name="startDate"
                      /> */}
                    </Stack>
                  </Stack>
                  <Stack>
                    <SelectDropDown name="typeFile" label="Loại file tải lên">
                      <MenuItem value={1}>Video</MenuItem>
                      <MenuItem value={2}>Ảnh</MenuItem>
                    </SelectDropDown>
                  </Stack>
                  <Stack>
                    <MuiAutocompleteWithTags name="hashtag" label="Hashtag" />
                  </Stack>

                  <Stack>
                    <FormInputText
                      type="number"
                      name="amount"
                      label={'Giá tham gia'}
                      defaultValue=""
                      placeholder="0"
                      fullWidth
                      iconEnd={
                        <MuiTypography variant="subtitle2">VNĐ</MuiTypography>
                      }
                    />
                  </Stack>

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
                      md: fileConfigs.mediaFormat === 1 ? 300 : 500,
                    }}
                    position="relative"
                  >
                    <UploadMedias
                      name="files"
                      mediasSrcPreviewer={mediasSrcPreviewer}
                      setMediasSrcPreviewer={setMediasSrcPreviewer}
                      mediaConfigs={fileConfigs}
                      selectFiles={selectFiles}
                      progressInfos={progressInfos}
                    />
                  </Box>
                </Stack>
              </Grid>

              <Grid item sm={12}>
                <Stack>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Nội dung
                  </MuiTypography>
                  <Controller
                    name="editor_content"
                    control={methods.control}
                    defaultValue=""
                    render={({ field }) => <WYSIWYGEditor {...field} />}
                  />
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </form>
      </SimpleCard>
    </Container>
  )
}
