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
import { useQuery, UseQueryResult } from '@tanstack/react-query'
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
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiRHFAutoComplete } from 'app/components/common/MuiRHFAutoComplete'
import { MuiAutocompleteWithTags } from 'app/components/common/MuiRHFAutocompleteWithTags'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { UploadPreviewer } from 'app/components/common/UploadPreviewer'
import { toastSuccess } from 'app/helpers/toastNofication'
import { checkIfFilesAreTooBig } from 'app/helpers/validateUploadFiles'
import {
  useCreateFeed,
  useDeleteFeed,
  useUpdateFeed,
} from 'app/hooks/queries/useFeedsData'
import { useUploadFiles } from 'app/hooks/useFilesUpload'
import {
  ICustomer,
  ICustomerDetail,
  ICustomerResponse,
  ICustomerTiny,
  IFeedDetail,
  IMediaOverall,
  ITags,
} from 'app/models'
import { IAudioOverall } from 'app/models/audio'
import {
  ICampArea,
  ICampAreaResponse,
  ICampGroundResponse,
} from 'app/models/camp'
import { EMediaFormat, EMediaType } from 'app/utils/enums/medias'
import { messages } from 'app/utils/messages'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
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

export default function CreateFeed(props: Props) {
  const navigate = useNavigate()
  const [accountList, setAccountList] = useState<ICustomer[]>([])
  const [mediasSrcPreviewer, setMediasSrcPreviewer] = useState<IMediaOverall[]>(
    [],
  )
  const audioRef = useRef() as any

  const { feedId } = useParams()
  const [fileConfigs, setFileConfigs] = useState({
    mediaFormat: EMediaFormat.IMAGE,
    accept: 'image/*',
    multiple: true,
    mediaType: EMediaType.POST,
    isLimitFiles: true,
  })
  const [defaultValues] = useState<SchemaType>({
    type: EMediaFormat.IMAGE,
    cusType: '',
    idSrcType: 0,
    hashtag: [],
    customer: [
      {
        fullName: 'Bùi Văn Nghiệp',
        customerId: 32,
        dateCreated: '2022-09-13T07:41:19Z',
        mobilePhone: '0975452750',
        email: 'nghiepbvptit@gmail.com',
        lastLoginDate: null,
        status: -3,
      },
    ],
  })
  const [filters, setFilters] = useState({ cusType: 1 })

  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string
    type?: string
  }>({})
  const [openDialog, setOpenDialog] = useState(false)

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
      files: Yup.mixed()
        .test('empty', messages.MSG1, files => {
          const media = ((fileInfos ?? []) as IMediaOverall[]).find(
            media =>
              media.mediaFormat === fileConfigs.mediaFormat &&
              media.mediaType === 3,
          )
          if (files && files.length) {
            return true
          }

          return !!media
        })
        .test(
          'fileSize',
          fileConfigs.mediaFormat === EMediaFormat.VIDEO
            ? 'Dung lượng video tối đa 3 phút'
            : 'Dung lượng ảnh tối đa 10MB/ảnh',
          files => checkIfFilesAreTooBig(files, fileConfigs.mediaFormat),
        ),
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

  const { data: feed }: UseQueryResult<IFeedDetail, Error> = useQuery<
    IFeedDetail,
    Error
  >(['feed', feedId], () => fetchFeedDetail(Number(feedId ?? 0)), {
    enabled: !!feedId,
    staleTime: 5 * 60 * 1000,
  })

  const { data: audios }: UseQueryResult<ICampAreaResponse, Error> = useQuery<
    ICampAreaResponse,
    Error
  >(['audios'], () => fetchAudios({ size: 200, page: 0, status: 1 }), {
    enabled: true,
  })

  const { data: campAreas }: UseQueryResult<ICampArea[], Error> = useQuery<
    ICampArea[],
    Error
  >(['camp-areas'], () => fetchCampAreas({ size: 200, page: 0 }), {
    enabled: Number(methods.watch('idSrcType')) === 1,
  })

  const { data: campGrounds }: UseQueryResult<ICampGroundResponse, Error> =
    useQuery<ICampAreaResponse, Error>(
      ['camp-grounds'],
      () => fetchCampGrounds({ size: 200, page: 0 }),
      {
        enabled: Number(methods.watch('idSrcType')) === 2,
      },
    )

  const {
    data: customers,
    isLoading,
    fetchStatus,
    isError,
    error,
  }: UseQueryResult<ICustomerResponse, Error> = useQuery<
    ICustomerResponse,
    Error
  >(['customers', filters], () => fetchCustomers(filters), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!filters,
  })

  const { data: customerCampdi }: UseQueryResult<ICustomerTiny, Error> =
    useQuery<ICustomerTiny, Error>(
      ['customer-campdi', filters],
      () => customerSystemDefault(),
      {
        refetchOnWindowFocus: false,
        enabled: !!filters && filters.cusType === 1,
      },
    )

  useEffect(() => {
    initDefaultValues(feed)
  }, [feed])

  useEffect(() => {
    if (!feed) {
      if (methods.watch('type') == 1) {
        methods.setValue('audio', { name: 'Âm thanh của video' })
      } else {
        methods.setValue('audio', undefined)
      }
      return
    }
    if (feed.customerInfo?.type && feed.customerInfo?.type === 1) {
      methods.setValue('customer', customerCampdi ?? undefined)
    } else {
      if (customers && customers.content) {
        const cus = customers.content.find(
          c => c.customerId === feed.idCustomer,
        ) as ICustomerDetail
        if (cus) {
          methods.setValue(
            'customer',
            Object.assign(cus, {
              labelText:
                (cus?.fullName ?? '') +
                '_' +
                (cus?.email ?? '') +
                '_' +
                (cus?.mobilePhone ?? ''),
            }),
          )
        }
      }
    }
    if (audios && audios.content) {
      const audio = audios.content.find(a => a.id == feed.idAudio)
      methods.setValue(
        'audio',
        audio
          ? audio
          : methods.watch('type') == 1
          ? { name: 'Âm thanh của video' }
          : undefined,
      )
    }
    if (campGrounds && campGrounds.content) {
      const campGround = campGrounds.content.find(c => c.id == feed.idSrc)
      methods.setValue('camp', campGround ?? undefined)
    } else if (campAreas) {
      const campArea = campAreas.find(c => c.id == feed.idSrc)
      methods.setValue('camp', campArea ?? undefined)
    }
  }, [feed, audios, customers, campGrounds, campAreas, methods.watch('type')])

  const initDefaultValues = (feed?: IFeedDetail) => {
    if (feed) {
      defaultValues.type = feed.type ?? 0
      defaultValues.cusType = feed.customerInfo?.type // check lai
      defaultValues.idSrcType = feed.idSrcType ?? 0
      defaultValues.content = feed.content
      defaultValues.hashtag = feed.tags
      defaultValues.webUrl = feed.webUrl ?? ''

      if (
        feed.images &&
        feed.images.length &&
        feed.images[0].mediaFormat === EMediaFormat.IMAGE
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
      setMediasSrcPreviewer(
        (feed.video && [feed.video]) ??
          feed.images?.filter(f => f.mediaType === 3) ??
          [],
      )
      setInitialFileInfos(
        (feed.video && [feed.video]) ??
          feed.images?.filter(f => f.mediaType === 3) ??
          [],
      )
    } else {
      setMediasSrcPreviewer([])
    }

    methods.reset({ ...defaultValues })
  }

  useEffect(() => {
    if (audioRef.current && methods.watch('audio')?.urlAudio) {
      audioRef.current.pause()
      audioRef.current.load()
      audioRef.current.play()
    }
  }, [methods.watch('audio')])

  useEffect(() => {
    let accounts: any[] = []
    if (
      parseInt((methods.watch('cusType') ?? 1) as unknown as string, 10) !== 1
    ) {
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
  }, [methods.setValue, methods.watch('cusType'), customers, customerCampdi])

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

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
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
      video:
        fileConfigs.mediaFormat === EMediaFormat.VIDEO
          ? {
              ...files[files.length - 1],
              detail:
                thumbnails && thumbnails.length
                  ? {
                      ...files[files.length - 1].detail,
                      coverImgUrl: thumbnails[thumbnails.length - 1].url,
                    }
                  : null,
            }
          : {},
      images:
        fileConfigs.mediaFormat === EMediaFormat.IMAGE
          ? thumbnails && thumbnails.length
            ? [thumbnails[0], ...files]
            : files
          : [],
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

  const onRowUpdateSuccess = (data: any, message: string) => {
    toastSuccess({ message: message })
    navigate('/quan-ly-feeds', {})
    setMediasSrcPreviewer([])
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

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      cusType: Number(methods.getValues('cusType') ?? 0),
    }))
    methods.clearErrors('customer')
  }, [methods.watch('cusType')])

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
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 1 }}
      >
        <MuiButton
          title="Lưu"
          disabled={uploading || createLoading || editLoading}
          variant="contained"
          color="primary"
          type="submit"
          onClick={methods.handleSubmit(onSubmitHandler)}
          startIcon={<Icon>done</Icon>}
        />
        <MuiButton
          title="Huỷ"
          disabled={uploading}
          variant="contained"
          color="warning"
          onClick={() => {
            setMediasSrcPreviewer([])
            removeUploadedFiles(undefined, fileConfigs.mediaFormat)

            initDefaultValues(feed)
          }}
          startIcon={<Icon>cached</Icon>}
        />
        {feedId && (
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
          onClick={() => {
            if (feedId) navigate(-1)
            else navigate('/quan-ly-feeds', {})
          }}
          startIcon={<Icon>keyboard_return</Icon>}
        />
      </Stack>
      <SimpleCard>
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <FormProvider {...methods}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <Stack gap={3}>
                  <Stack>
                    <SelectDropDown
                      name="type"
                      label="Loại post*"
                      disabled={uploading}
                    >
                      <MenuItem value={1}>Video</MenuItem>
                      <MenuItem value={2}>Ảnh</MenuItem>
                    </SelectDropDown>
                  </Stack>

                  <Stack gap={1.5} justifyContent="center">
                    <MuiRHFAutoComplete
                      name="audio"
                      label="Nhạc nền"
                      options={
                        methods.watch('type') == 1
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
                    {methods.watch('audio')?.urlAudio && (
                      <Stack flexDirection={'row'}>
                        <MuiTypography
                          fontSize="12px"
                          fontStyle="italic"
                          flex={1}
                        >
                          Âm thanh:
                        </MuiTypography>
                        <audio controls autoPlay ref={audioRef}>
                          <source
                            src={methods.watch('audio')?.urlAudio}
                            type="audio/mpeg"
                          />
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

                  {methods.watch('cusType') &&
                    Number(methods.watch('cusType') ?? 0) !== 1 && (
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
                  {!!methods.watch('idSrcType') &&
                    methods.watch('idSrcType') != 0 && (
                      <Stack
                        flexDirection={'row'}
                        gap={1.5}
                        justifyContent="center"
                      >
                        <MuiTypography fontSize="12px" fontStyle="italic">
                          {getTitleLinked(Number(methods.watch('idSrcType')))} *
                        </MuiTypography>

                        <Box sx={{ flex: 1 }}>
                          {Number(methods.watch('idSrcType')) !== 4 ? (
                            <MuiRHFAutoComplete
                              name="camp"
                              options={
                                Number(methods.watch('idSrcType')) === 1
                                  ? campAreas ?? []
                                  : campGrounds?.content ?? []
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
                    <FormTextArea
                      name="content"
                      defaultValue={''}
                      placeholder="Nội dung (tối đa 2200 ký tự)"
                    />
                  </Stack>
                  <Stack>
                    <MuiAutocompleteWithTags name="hashtag" label="Hashtag" />
                  </Stack>

                  {(createLoading || editLoading) && (
                    <LinearProgress sx={{ mt: 0.5 }} />
                  )}
                </Stack>
              </Grid>

              <Grid
                item
                sm={6}
                xs={12}
                justifyContent="center"
                alignItems={'center'}
              >
                <Stack
                  gap={2}
                  flexDirection={'column'}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <Box
                    width={{
                      sx: '100%',
                      md: fileConfigs.mediaFormat === 1 ? 300 : 450,
                    }}
                    position="relative"
                  >
                    <UploadPreviewer
                      name="files"
                      initialMedias={
                        (feed?.images ?? [feed?.video] ?? []) as IMediaOverall[]
                      }
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
