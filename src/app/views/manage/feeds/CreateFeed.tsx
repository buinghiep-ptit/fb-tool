import { yupResolver } from '@hookform/resolvers/yup'
import {
  Chip,
  Grid,
  LinearProgress,
  MenuItem,
  Stack,
  styled,
} from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import {
  customerSystemDefault,
  fetchCustomers,
} from 'app/apis/accounts/customer.service'
import { fetchAudios } from 'app/apis/audio/audio.service'
import {
  fetchCampAreas,
  fetchCampGrounds,
  fetchFeedDetail,
} from 'app/apis/feed/feed.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { ImageUploadPreviewer } from 'app/components/common/ImageUploadPreviewer'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiRHFAutoComplete } from 'app/components/common/MuiRHFAutoComplete'
import { MuiAutocompleteWithTags } from 'app/components/common/MuiRHFAutocompleteWithTags'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { TopRightButtonList } from 'app/components/common/TopRightButtonList'
import UploadProgress from 'app/components/common/UploadProgress/UploadProgress'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useCreateFeed,
  useDeleteFeed,
  useUpdateFeed,
} from 'app/hooks/queries/useFeedsData'
import {
  ICustomer,
  ICustomerDetail,
  ICustomerResponse,
  ICustomerTiny,
  IFeedDetail,
  IMediaOverall,
  ITags,
} from 'app/models'
import { IAudioOverall, IAudioResponse } from 'app/models/audio'
import { ICampArea, ICampAreaResponse } from 'app/models/camp'
import {
  setInitialFile,
  setUploadFile,
} from 'app/redux/reducers/upload/uploadFile.actions'
import { EMediaFormat } from 'app/utils/enums/medias'
import { messages } from 'app/utils/messages'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { DiagLogConfirm } from '../orders/details/ButtonsLink/DialogConfirm'

export interface Props {}

type SchemaType = {
  type?: 1 | 2 | number
  audio?: IAudioOverall
  cusType?: number | string
  customer?: any // idCustomer
  idSrcType?: number | string
  camp?: any // idSrc
  webUrl?: string
  content?: string
  files?: any
  hashtag?: ITags[]
}

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

const extractCamps = (camps?: any[]) => {
  if (!camps || !camps.length) return
  return camps.map(camp =>
    Object.assign(camp, {
      icon: () => (
        <Chip
          label={camp.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
          size="small"
          color={camp.status === 1 ? 'primary' : 'default'}
        />
      ),
    }),
  )
}

function CreateFeed(props: any) {
  const navigate = useNavigate()
  const { feedId } = useParams()
  const [accountList, setAccountList] = useState<ICustomer[]>([])
  const audioRef = useRef() as any
  const [defaultValues] = useState<SchemaType>({
    type: EMediaFormat.IMAGE,
    cusType: '',
    idSrcType: 0,
    hashtag: [],
  })
  const [filters, setFilters] = useState({ cusType: 1 })

  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string
    type?: string
  }>({})
  const [openDialog, setOpenDialog] = useState(false)
  const [isReset, setIsReset] = useState(false)

  const validationSchema = Yup.object().shape(
    {
      type: Yup.string(),
      cusType: Yup.string().required(messages.MSG1),
      customer: Yup.object()
        .nullable()
        .when(['cusType'], {
          is: (cusType: string) => !!cusType && Number(cusType) !== 1,
          then: Yup.object().required(messages.MSG1).nullable(),
        }),
      idSrcType: Yup.string().required(messages.MSG1),
      camp: Yup.object()
        .nullable()
        .when(['idSrcType'], {
          is: (idSrcType: any) =>
            !!idSrcType && Number(idSrcType) !== 4 && idSrcType != 0,
          then: Yup.object().required(messages.MSG1).nullable(), // when camp selected empty
        })
        .nullable(),
      audio: Yup.object()
        .when('type', {
          is: (type: string) => Number(type) == 2,
          then: Yup.object().required(messages.MSG1).nullable(),
        })
        .nullable(),
      webUrl: Yup.string()
        .nullable()
        .when(['idSrcType'], {
          is: (idSrcType: any) =>
            !!idSrcType && Number(idSrcType) === 4 && idSrcType != 0,
          then: Yup.string().required(messages.MSG1).nullable(),
        }),
      files: Yup.mixed().required(messages.MSG1),
      content: Yup.string()
        .required(messages.MSG1)
        .max(2200, 'Nội dung tối đa 2200 ký tự'),
      hashtag: Yup.array().max(50, 'Hashtag tối đa là 50').nullable(),
    },
    [['files', 'files']],
  )

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const fileType = methods.watch('type')
  const idSrcType = methods.watch('idSrcType')
  const cusType = methods.watch('cusType')
  const audio = methods.watch('audio')

  const { data: feed } = useQuery<IFeedDetail, Error>(
    ['feed', feedId],
    () => fetchFeedDetail(Number(feedId ?? 0)),
    {
      enabled: !!feedId,
      staleTime: 5 * 60 * 1000,
    },
  )

  const { data: audios } = useQuery<IAudioResponse, Error>(['audios'], () =>
    fetchAudios({ size: 500, page: 0, status: 1 }),
  )

  const { data: campAreas } = useQuery<ICampArea[], Error>(['camp-areas'], () =>
    fetchCampAreas({ size: 500, page: 0 }),
  )

  const { data: campGrounds } = useQuery<ICampAreaResponse, Error>(
    ['camp-grounds'],
    () => fetchCampGrounds({ size: 500, page: 0 }),
  )

  const {
    data: customers,
    isLoading,
    fetchStatus,
    isError,
    error,
  } = useQuery<ICustomerResponse, Error>(
    ['customers', filters],
    () => fetchCustomers(filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!filters,
    },
  )

  const { data: customerCampdi } = useQuery<ICustomerTiny, Error>(
    ['customer-campdi', filters],
    () => customerSystemDefault(),
    {
      refetchOnWindowFocus: false,
      enabled: !!filters && filters.cusType === 1,
    },
  )

  useEffect(() => {
    if (!feed || !campGrounds || !campGrounds.content || !campAreas) return
    // methods.setValue('camp', null)
    if (isReset) {
      setIsReset(false)
      return
    }

    let camp
    if (idSrcType == 1) {
      camp = campAreas.find(c => c.id == feed.idSrc)
      methods.setValue('camp', camp || undefined)
    } else if (idSrcType == 2) {
      camp = campGrounds.content.find(c => c.id == feed.idSrc)
      methods.setValue('camp', camp || undefined)
    }
  }, [idSrcType, isReset])

  useEffect(() => {
    if (feed) return
    methods.setValue(
      'audio',
      fileType == 1 ? { name: 'Âm thanh của video' } : undefined,
    )
    methods.setValue('files', null)
  }, [fileType])

  useEffect(() => {
    if (isReset) {
      setIsReset(false)
      return
    }
    methods.setValue('customer', null)
  }, [cusType, isReset])

  console.log(methods.formState.errors)

  useEffect(() => {
    initDefaultValues(feed)
  }, [feed, audios, customers, campGrounds, campAreas])

  const initDefaultValues = (feed?: IFeedDetail) => {
    if (!feed) return
    defaultValues.type = feed.type ?? 0
    defaultValues.cusType = feed.customerInfo?.type // check lai
    defaultValues.idSrcType = feed.idSrcType ?? 0
    defaultValues.content = feed.content
    defaultValues.hashtag = feed.tags
    defaultValues.webUrl = feed.webUrl ?? ''

    props.setInitialFile(feed.images)

    if (feed.customerInfo?.type && feed.customerInfo?.type === 1) {
      methods.setValue('customer', customerCampdi ?? undefined)
      defaultValues.customer = customerCampdi ?? undefined
    } else {
      if (customers && customers.content) {
        const cus = customers.content.find(
          c => c.customerId === feed.idCustomer,
        ) as ICustomerDetail
        if (cus) {
          defaultValues.customer = Object.assign(cus, {
            labelText:
              (cus?.fullName ?? '') +
              '_' +
              (cus?.email ?? '') +
              '_' +
              (cus?.mobilePhone ?? ''),
          })
        }
      }
    }
    if (audios && audios.content) {
      const audio = audios.content.find(a => a.id == feed.idAudio)
      defaultValues.audio = audio ?? undefined
    }
    if (campGrounds && campGrounds.content && campAreas) {
      let camp
      if (feed.idSrcType == 1) {
        camp = campAreas.find(c => c.id == feed.idSrc)
      } else if (feed.idSrcType == 2) {
        camp = campGrounds.content.find(c => c.id == feed.idSrc)
      }
      defaultValues.camp = camp ?? undefined
    }

    methods.reset({ ...defaultValues })
  }

  useEffect(() => {
    if (audioRef.current && audio?.urlAudio) {
      audioRef.current.pause()
      audioRef.current.load()
      audioRef.current.play()
    }
  }, [audio])

  useEffect(() => {
    let accounts: any[] = []
    if (parseInt((cusType ?? 1) as unknown as string, 10) !== 1) {
      accounts = customers?.content ?? []
    } else {
      accounts = [customerCampdi] ?? []
    }
    const newAccounts = accounts.map((acc: ICustomerDetail) => {
      const labelText =
        (acc?.fullName ?? '') +
        '_' +
        (acc?.email ?? '') +
        '_' +
        (acc?.mobilePhone ?? '')
      return {
        ...acc,
        labelText,
      }
    })

    setAccountList([...newAccounts])
  }, [methods.setValue, cusType, customers, customerCampdi])

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    const payload: IFeedDetail = {
      type: Number(values.type ?? 0),
      idSrcType: values.idSrcType != 0 ? Number(values.idSrcType) : null,
      idSrc:
        values.idSrcType != 4 && values.idSrcType != 0
          ? Number(values.camp?.id)
          : null,
      webUrl: values.idSrcType == 4 ? values.webUrl : null,
      idCustomer:
        Number(values.cusType) === 1
          ? customerCampdi && (customerCampdi as any)?.id
          : values.customer.customerId,
      content: values.content,
      video: {},
      images: [],
      idAudio: values.audio?.id ?? null,
      tags: values.hashtag ?? [],
      viewScope: 1,
      isAllowComment: 1,
      status: 1,
    }

    if (feedId) {
      edit({ ...payload, id: Number(feedId) })
    } else {
      add(payload)
    }
  }

  const onReset = () => {
    setIsReset(true)
    initDefaultValues(feed)
  }

  const onRowUpdateSuccess = (data: any, message: string) => {
    toastSuccess({ message: message })
    navigate('/quan-ly-feeds', {})
    methods.reset()
  }
  const { mutate: add, isLoading: createLoading } = useCreateFeed(() =>
    onRowUpdateSuccess(null, 'Thêm mới thành công'),
  )

  const { mutate: edit, isLoading: editLoading } = useUpdateFeed(() =>
    onRowUpdateSuccess(null, 'Cập nhật thành công'),
  )

  const { mutate: deletedFeed } = useDeleteFeed(() =>
    onRowUpdateSuccess(null, 'Xoá bài thành công'),
  )

  const onDeleteFeed = () => {
    if (feedId) deletedFeed(Number(feedId))
  }

  const openDeleteDialog = () => {
    setDialogData(prev => ({
      ...prev,
      title: 'Xoá bài feed',
      message: 'Bạn có chắc chắn muốn xoá bài feed này?',
      type: 'delete',
    }))
    setOpenDialog(true)
  }

  const getTitleLinked = (type?: number | string) => {
    switch (type) {
      case 1:
        return 'Chọn địa danh'
      case 2:
        return 'Chọn điểm camp'
      case 4:
        return 'Chèn link SP'
      default:
        return ''
    }
  }

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
            { name: feedId ? 'Chỉnh sửa Feed' : 'Thêm mới Feed' },
          ]}
        />
      </Box>

      <TopRightButtonList
        isLoading={createLoading || editLoading}
        onSave={methods.handleSubmit(onSubmitHandler)}
        onCancel={() => onReset()}
        onDelete={!!feedId ? openDeleteDialog : undefined}
        onGoBack={() => navigate(-1)}
      />

      <SimpleCard>
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <FormProvider {...methods}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <Stack gap={3}>
                  <Stack>
                    <SelectDropDown name="type" label="Loại post*">
                      <MenuItem value={1}>Video</MenuItem>
                      <MenuItem value={2}>Ảnh</MenuItem>
                    </SelectDropDown>
                  </Stack>

                  <Stack gap={1.5} justifyContent="center">
                    <MuiRHFAutoComplete
                      name="audio"
                      label="Nhạc nền"
                      options={
                        fileType == 1
                          ? [
                              { name: 'Âm thanh của video' },
                              ...(audios?.content ?? []),
                            ]
                          : audios?.content ?? []
                      }
                      optionProperty="name"
                      getOptionLabel={option => option.name ?? ''}
                      defaultValue=""
                    />
                    {audio?.urlAudio && (
                      <Stack flexDirection={'row'}>
                        <MuiTypography
                          fontSize="12px"
                          fontStyle="italic"
                          flex={1}
                        >
                          Âm thanh:
                        </MuiTypography>
                        <audio controls autoPlay ref={audioRef}>
                          <source src={audio?.urlAudio} type="audio/mpeg" />
                        </audio>
                      </Stack>
                    )}
                  </Stack>

                  <Stack>
                    <SelectDropDown name="cusType" label="Loại tài khoản*">
                      <MenuItem value="1">Campdi</MenuItem>
                      <MenuItem value="3">Campdi (food)</MenuItem>
                      <MenuItem value="2">KOL</MenuItem>
                    </SelectDropDown>
                  </Stack>

                  {cusType && cusType != 1 && (
                    <Stack
                      flexDirection={'row'}
                      gap={1.5}
                      justifyContent="center"
                    >
                      <MuiTypography fontSize="12px" fontStyle="italic">
                        Tài khoản post*
                      </MuiTypography>
                      <Box sx={{ flex: 1 }}>
                        <MuiRHFAutoComplete
                          name="customer"
                          label="Tài khoản post"
                          options={accountList ?? []}
                          optionProperty="labelText"
                          getOptionLabel={option => option.labelText ?? ''}
                          defaultValue=""
                        />
                      </Box>
                    </Stack>
                  )}

                  <Stack>
                    <SelectDropDown name="idSrcType" label="Liên kết với">
                      <MenuItem value="0">Không liên kết</MenuItem>
                      <MenuItem value="1">Địa danh</MenuItem>
                      <MenuItem value="2">Điểm Camp</MenuItem>
                      <MenuItem value="4">Sản phẩm</MenuItem>
                    </SelectDropDown>
                  </Stack>
                  {!!idSrcType && idSrcType != 0 && (
                    <Stack
                      flexDirection={'row'}
                      gap={1.5}
                      justifyContent="center"
                    >
                      <MuiTypography fontSize="12px" fontStyle="italic">
                        {getTitleLinked(Number(idSrcType))} *
                      </MuiTypography>

                      <Box sx={{ flex: 1 }}>
                        {idSrcType != 4 ? (
                          <MuiRHFAutoComplete
                            name="camp"
                            options={
                              idSrcType == 1
                                ? extractCamps(campAreas) ?? []
                                : extractCamps(campGrounds?.content) ?? []
                            }
                            optionProperty="name"
                            getOptionLabel={option => option.name ?? ''}
                            defaultValue=""
                          />
                        ) : (
                          <FormInputText
                            type="text"
                            name="webUrl"
                            placeholder="Chèn link"
                            size="small"
                            fullWidth
                            defaultValue=""
                          />
                        )}
                      </Box>
                    </Stack>
                  )}
                  <Stack>
                    <MuiAutocompleteWithTags name="hashtag" label="Hashtag" />
                  </Stack>
                  <Stack>
                    <FormTextArea
                      name="content"
                      defaultValue={''}
                      placeholder="Nội dung (tối đa 2200 ký tự)"
                    />
                  </Stack>

                  {(createLoading || editLoading) && (
                    <LinearProgress sx={{ mt: 0.5 }} />
                  )}
                </Stack>
              </Grid>

              <Grid item sm={6} xs={12}>
                <ImageUploadPreviewer
                  images={props.fileInfos}
                  setUploadFile={props.setUploadFile}
                  setInitialFile={props.setInitialFile}
                />
                <UploadProgress />
              </Grid>
            </Grid>
          </FormProvider>
        </form>
      </SimpleCard>
      <DiagLogConfirm
        title={dialogData.title ?? ''}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={onDeleteFeed}
        submitText={'Xoá'}
        cancelText={'Huỷ'}
      >
        <Stack py={5} justifyContent={'center'} alignItems="center">
          <MuiTypography variant="subtitle1">
            {dialogData.message ?? ''}
          </MuiTypography>
        </Stack>
      </DiagLogConfirm>
    </Container>
  )
}

const mapStateToProps = (state: any) => ({
  fileInfos: state.UploadFile.fileInfos,
})
const mapDispatchToProps = (dispatch: any) => ({
  setUploadFile: (files: any) => dispatch(setUploadFile(files)),
  setInitialFile: (files: any) => dispatch(setInitialFile(files)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateFeed)
