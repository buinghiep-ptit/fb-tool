import * as React from 'react'
import {
  Box,
  Grid,
  styled,
  InputLabel,
  TextField,
  MenuItem,
  Stack,
  LinearProgress,
} from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import {
  ICampArea,
  ICampAreaResponse,
  ICampGround,
  ICampGroundResponse,
} from 'app/models/camp'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchCampAreas, fetchCampGrounds } from 'app/apis/feed/feed.service'
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { MuiRHFAutoComplete } from 'app/components/common/MuiRHFAutoComplete'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import * as Yup from 'yup'
import { checkIfFilesAreTooBig } from 'app/helpers/validateUploadFiles'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import { ApprovalRounded, CancelSharp, HelpOutline } from '@mui/icons-material'
import { MuiButton } from 'app/components/common/MuiButton'
import { UploadPreviewer } from 'app/components/common/UploadPreviewer'
import { IMediaOverall } from 'app/models'
import { useUploadFiles } from 'app/hooks/useFilesUpload'
import MuiRHFNumericFormatInput from 'app/components/common/MuiRHFWithNumericFormat'
import { MuiTypography } from 'app/components/common/MuiTypography'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { DetailService, WeekdayPrices } from 'app/models/service'
import { getServiceDetail } from 'app/apis/services/services.service'
import { useNavigate, useParams } from 'react-router-dom'
import { EMediaFormat, EMediaType } from 'app/utils/enums/medias'
import { messages } from 'app/utils/messages'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useCreateService,
  useUpdateService,
} from 'app/hooks/queries/useServicesData'
import RHFWYSIWYGEditor from 'app/components/common/RHFWYSIWYGEditor'
import ca from 'date-fns/esm/locale/ca/index.js'
import { any } from 'prop-types'
const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))
export interface Props {}
type TypeElement = {
  camp?: ICampGround
  files?: any
  description?: string
  rentalType?: number | string
  capacity?: number
  name?: string
  status?: number | string
  amount?: WeekdayPrices[]
  weekdayPrices?: WeekdayPrices[]
}
export default function ServiceDetail(props: Props) {
  const navigate = useNavigate()
  const { serviceId } = useParams()
  const [loading, setLoading] = useState(false)
  const [mediasSrcPreviewer, setMediasSrcPreviewer] = useState<IMediaOverall[]>(
    [],
  )

  const calendar = [
    { day: 2 },
    { day: 3 },
    { day: 4 },
    { day: 5 },
    { day: 6 },
    { day: 7 },
    { day: 1 },
  ]

  const [fileConfigs, setFileConfigs] = useState({
    mediaType: EMediaType.POST,
    mediaFormat: EMediaFormat.IMAGE,
    accept: 'image/*',
    multiple: true,
  })
  const [defaultValues] = useState<TypeElement>({
    status: '',
    rentalType: '',
    description: '',
  })

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(messages.MSG1),
    description: Yup.string().nullable(),
    files: Yup.mixed()
      .test('empty', messages.MSG1, files => {
        // if (!!Number(eventId ?? 0)) {
        const media = ((fileInfos ?? []) as IMediaOverall[]).find(
          media => media.mediaFormat === fileConfigs.mediaFormat,
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
    weekdayPrices: Yup.lazy(() =>
      Yup.array().of(
        Yup.object().shape({
          amount: Yup.string().required(messages.MSG1),
        }),
      ),
    ),
  })

  const methods = useForm<TypeElement>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { fields, append, remove } = useFieldArray<TypeElement>({
    name: 'weekdayPrices',
    control: methods.control,
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
  const {
    data: campService,
    isLoading,
    fetchStatus,
    isError,
    error,
  }: UseQueryResult<DetailService, Error> = useQuery<DetailService, Error>(
    ['campService', serviceId],
    () => getServiceDetail(Number(serviceId ?? 0)),
    {
      enabled: !!serviceId,
      staleTime: 5 * 60 * 1000, // 5min
    },
  )

  const onSubmitHandler: SubmitHandler<TypeElement> = (values: TypeElement) => {
    if (values.weekdayPrices && values.weekdayPrices.length) {
      values.weekdayPrices = values.weekdayPrices.map(item => ({
        ...item,
        amount: Number(item.amount?.toString().replace(/,(?=\d{3})/g, '') ?? 0),
      })) as any
    }
    console.log(values)

    const files = (fileInfos as IMediaOverall[])
      .filter((f: IMediaOverall) => f.mediaFormat === fileConfigs.mediaFormat)
      .map((file: IMediaOverall) => ({
        mediaType: EMediaType.POST,
        mediaFormat: fileConfigs.mediaFormat,
        url: file.url,
      }))

    const payload: DetailService = {
      name: values.name,
      campGroundId: values.camp?.id,
      rentalType: Number(values.rentalType),
      capacity: values.capacity,
      description: values.description ?? '',
      images:
        fileConfigs.mediaFormat === EMediaFormat.IMAGE
          ? files
          : [files[files.length - 1]],
      status: Number(values.status ?? -1),
      weekdayPrices: values.weekdayPrices ?? [],
    }
    if (serviceId) {
      edit({ ...payload, serviceId: Number(serviceId) })
    } else {
      add(payload)
    }
  }

  const onRowUpdateSuccess = (data: any, message?: string) => {
    toastSuccess({ message: message ?? '' })
    // setMediasSrcPreviewer([])
    navigate(-1)
    methods.reset()
  }
  const { mutate: add, isLoading: createLoading } = useCreateService(() =>
    onRowUpdateSuccess(null, 'Thêm mới thành công'),
  )

  const { mutate: edit, isLoading: editLoading } = useUpdateService(() =>
    onRowUpdateSuccess(null, 'Cập nhật thành công'),
  )

  const { data: campGrounds }: UseQueryResult<ICampGroundResponse, Error> =
    useQuery<ICampAreaResponse, Error>(['camp-grounds'], () =>
      fetchCampGrounds({ size: 200, page: 0 }),
    )

  React.useEffect(() => {
    if (campService) {
      defaultValues.rentalType = campService.rentalType
      defaultValues.status = campService.status
      defaultValues.capacity = campService.capacity
      defaultValues.name = campService.name
      defaultValues.description = campService.description
      defaultValues.weekdayPrices = campService.weekdayPrices
      if (campGrounds && campGrounds.content) {
        const getCamp = campGrounds.content.find(
          camp => camp.id == campService.campGroundId,
        )
        defaultValues.camp = getCamp ?? {}
      }
      setMediasSrcPreviewer([...(campService?.images ?? [])])
      setInitialFileInfos([...(campService.images ?? [])])
    } else {
      setMediasSrcPreviewer([])
    }

    methods.reset({ ...defaultValues })
  }, [campService, campGrounds])

  React.useEffect(() => {
    const currentProp = campService?.weekdayPrices.length ?? calendar.length
    const previousProp = fields.length
    if (currentProp > previousProp) {
      for (let i = previousProp; i < currentProp; i++) {
        append({ day: calendar[i].day, amount: '' })
      }
    } else {
      for (let i = previousProp; i > currentProp; i--) {
        remove(i - 1)
      }
    }
    console.log(calendar)
  }, [campService?.weekdayPrices, fields])
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
        <Breadcrumb routeSegments={[{ name: 'Chi tiết dịch vụ' }]} />
      </Box>
      <SimpleCard>
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item sm={3} xs={3}>
                <MuiButton
                  title="Lưu"
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ width: '100%' }}
                  startIcon={<ApprovalRounded />}
                />
              </Grid>

              <Grid item sm={3} xs={3}>
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
            <Grid
              container
              sx={{ marginLeft: '8px', marginTop: '10px ' }}
              rowSpacing={1}
            >
              <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  required
                  sx={{ color: 'Black', fontSize: '15px', fontWeight: '500' }}
                >
                  Địa điểm camp:
                </InputLabel>
              </Grid>
              <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <MuiRHFAutoComplete
                  name="camp"
                  options={campGrounds?.content ?? []}
                  optionProperty="name"
                  getOptionLabel={option => option.name ?? ''}
                  defaultValue=""
                />
              </Grid>
              <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  required
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Loại dịch vụ:
                </InputLabel>
              </Grid>
              <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <SelectDropDown name="rentalType" label="">
                  <MenuItem value="1">Gói dịch vụ</MenuItem>
                  <MenuItem value="2">Gói lưu trú</MenuItem>
                  <MenuItem value="3">Khác</MenuItem>
                </SelectDropDown>
              </Grid>
              <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  required
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Áp dụng:
                </InputLabel>
              </Grid>
              <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <MuiRHFNumericFormatInput
                  type="text"
                  name="capacity"
                  label=""
                  placeholder=""
                  iconEnd={
                    <MuiTypography variant="subtitle2">Người</MuiTypography>
                  }
                />
              </Grid>
              <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  required
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Tên dịch vụ:
                </InputLabel>
              </Grid>
              <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormInputText
                  type="text"
                  name="name"
                  label={''}
                  defaultValue=""
                  placeholder=""
                  sx={{ width: '50%' }}
                />
              </Grid>
              <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Trạng thái:
                </InputLabel>
              </Grid>
              <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <SelectDropDown name="status" label="" sx={{ width: '50%' }}>
                  <MenuItem value="1">Hiệu lực</MenuItem>
                  <MenuItem value="-1">Không hiệu lực</MenuItem>
                </SelectDropDown>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Mô tả
                </InputLabel>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <RHFWYSIWYGEditor name="description" />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Hình ảnh:
                </InputLabel>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <Stack
                  gap={2}
                  flexDirection={'column'}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <Box
                    width={{
                      sx: '100%',
                      md: fileConfigs.mediaFormat === 1 ? 300 : 500,
                    }}
                    position="relative"
                  >
                    <UploadPreviewer
                      name="files"
                      initialMedias={campService?.images ?? []}
                      fileInfos={fileInfos}
                      mediasSrcPreviewer={mediasSrcPreviewer}
                      setMediasSrcPreviewer={setMediasSrcPreviewer}
                      mediaConfigs={fileConfigs as any}
                      selectFiles={selectFiles}
                      uploadFiles={uploadFiles}
                      removeUploadedFiles={removeUploadedFiles}
                      cancelUploading={cancelUploading}
                      uploading={uploading}
                      progressInfos={progressInfos}
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Giá dịch vụ:
                </InputLabel>
              </Grid>

              {(fields as unknown as WeekdayPrices[]).map(
                ({ id, day, amount }: any, index) => (
                  <Stack
                    key={id}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent={'space-between'}
                  >
                    <Grid item xs={2}>
                      <MuiTypography>{day}</MuiTypography>
                    </Grid>
                    <Grid
                      item
                      xs={10}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: 3,
                        marginTop: 2,
                        marginBottom: 1,
                      }}
                    >
                      <MuiRHFNumericFormatInput
                        label={''}
                        name={`weekdayPrices.${index}.amount`}
                        iconEnd={
                          <MuiTypography variant="subtitle2">
                            VNĐ/Ngày
                          </MuiTypography>
                        }
                        fullWidth
                      />
                    </Grid>
                  </Stack>
                ),
              )}
            </Grid>
          </FormProvider>
        </form>
      </SimpleCard>
    </Container>
  )
}
