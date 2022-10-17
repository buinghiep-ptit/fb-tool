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
import { fetchCampAreas, fetchCampGrounds } from 'app/apis/feed/feed.service'
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
import { useCreateFeed } from 'app/hooks/queries/useFeedsData'
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
import { ICampAreaResponse, ICampGroundResponse } from 'app/models/camp'
import { EMediaFormat, EMediaType } from 'app/utils/enums/medias'
import { messages } from 'app/utils/messages'
import { useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

export interface Props {}

type SchemaType = {
  type?: 1 | 2
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
  const [fileConfigs, setFileConfigs] = useState({
    mediaFormat: EMediaFormat.IMAGE,
    accept: 'image/*',
    multiple: true,
    mediaType: EMediaType.POST,
  })
  const [defaultValues] = useState<SchemaType>({
    type: EMediaFormat.IMAGE,
    cusType: '',
    idSrcType: '',
    hashtag: [],
  })
  const [filters, setFilters] = useState({ cusType: 0 })

  const validationSchema = Yup.object().shape(
    {
      cusType: Yup.string().required(messages.MSG1),
      customer: Yup.object()
        .nullable()
        .when(['cusType'], {
          is: (cusType: string) => !!cusType && Number(cusType) !== 0,
          then: Yup.object().required(messages.MSG1).nullable(),
        }),
      idSrcType: Yup.string().required(messages.MSG1),
      camp: Yup.object()
        .nullable()
        .when(['idSrcType'], {
          is: (idSrcType: any) => !!idSrcType && Number(idSrcType) !== 4,
          then: Yup.object().required(messages.MSG1).nullable(), // when camp selected empty
        })
        .nullable(),
      webUrl: Yup.string()
        .nullable()
        .when(['idSrcType'], {
          is: (idSrcType: any) => !!idSrcType && Number(idSrcType) === 4,
          then: Yup.string().required(messages.MSG1).nullable(),
        }),
      files: Yup.mixed()
        .test('empty', messages.MSG1, files => {
          const media = ((fileInfos ?? []) as IMediaOverall[]).find(
            media => media.mediaFormat === fileConfigs.mediaFormat,
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
      hashtag: Yup.array().max(50, 'Hashtag tối đa là 50').nullable(),
    },
    [['files', 'files']],
  )

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { data: campAreas }: UseQueryResult<ICampAreaResponse, Error> =
    useQuery<ICampAreaResponse, Error>(
      ['camp-areas'],
      () => fetchCampAreas({ size: 200, page: 0 }),
      {
        enabled: Number(methods.watch('idSrcType')) === 1,
      },
    )

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
        enabled: !!filters && filters.cusType === 0,
      },
    )

  useEffect(() => {
    let accounts: any[] = []
    if (
      parseInt((methods.watch('cusType') ?? 0) as unknown as string, 10) !== 0
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
    // methods.setValue('customer', accounts.length && accounts[0])
  }, [methods.setValue, methods.watch('cusType'), customers, customerCampdi])

  const [
    selectFiles,
    uploadFiles,
    removeUploadedFiles,
    cancelUploading,
    uploading,
    progressInfos,
    message,
    setFileInfos,
    fileInfos,
  ] = useUploadFiles()

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    const files = (fileInfos as IMediaOverall[])
      .filter((f: IMediaOverall) => f.mediaFormat === fileConfigs.mediaFormat)
      .map((file: IMediaOverall) => ({
        mediaType: EMediaType.POST,
        mediaFormat: fileConfigs.mediaFormat,
        url: file.url,
      }))

    const payload: IFeedDetail = {
      type: Number(values.type ?? 0),
      idSrcType: Number(values.idSrcType ?? 0),
      idSrc: Number(values.camp?.id ?? 0),
      webUrl: values.webUrl,
      idCustomer:
        Number(values.cusType) === 0
          ? customerCampdi && (customerCampdi as any)?.id
          : values.customer.customerId,
      content: values.content,
      video: fileConfigs.mediaFormat === EMediaFormat.VIDEO ? files[0] : {},
      images: fileConfigs.mediaFormat === EMediaFormat.IMAGE ? files : [],
      tags: values.hashtag ?? [],
      viewScope: 1,
      isAllowComment: 1,
      status: Number(values.cusType ?? 0) === 2 ? 0 : 1,
    }
    add(payload)
  }

  const onRowUpdateSuccess = (data: any) => {
    toastSuccess({ message: 'Thêm mới thành công' })
    navigate('/quan-ly-feeds', {})
    setMediasSrcPreviewer([])
    methods.reset()
  }
  const { mutate: add, isLoading: createLoading } =
    useCreateFeed(onRowUpdateSuccess)

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
        <Breadcrumb routeSegments={[{ name: 'Post bài Feed' }]} />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 1 }}
      >
        <MuiButton
          title="Lưu"
          disabled={uploading}
          variant="contained"
          color="primary"
          type="submit"
          onClick={methods.handleSubmit(onSubmitHandler)}
          startIcon={<Icon>done</Icon>}
        />
        <MuiButton
          title="Xoá"
          disabled={uploading}
          variant="contained"
          color="warning"
          onClick={() => {
            setMediasSrcPreviewer([])
            removeUploadedFiles()
            methods.reset()
          }}
          startIcon={<Icon>clear</Icon>}
        />
        <MuiButton
          title="Quay lại"
          variant="contained"
          color="inherit"
          onClick={() => navigate('/quan-ly-feeds', {})}
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
                  <Stack>
                    <SelectDropDown name="cusType" label="Loại tài khoản*">
                      <MenuItem value="0">Campdi</MenuItem>
                      <MenuItem value="3">Campdi (food)</MenuItem>
                      <MenuItem value="2">KOL</MenuItem>
                    </SelectDropDown>
                  </Stack>

                  {Number(methods.watch('cusType') ?? 0) !== 0 && (
                    <Stack
                      flexDirection={'row'}
                      gap={1.5}
                      justifyContent="center"
                    >
                      <MuiTypography fontSize="12px" fontStyle="italic">
                        Tài khoản post*
                      </MuiTypography>
                      <Box sx={{ flex: 1 }}>
                        {/* <MuiAutoComplete
                        itemList={accountList}
                        name="customer"
                        disabled={Number(methods.getValues('cusType')) === 0}
                      /> */}
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
                      <MenuItem value="1">Địa danh</MenuItem>
                      <MenuItem value="2">Điểm Camp</MenuItem>
                      <MenuItem value="4">Sản phẩm</MenuItem>
                    </SelectDropDown>
                  </Stack>
                  {!!methods.watch('idSrcType') && (
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
                                ? campAreas?.content ?? []
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
                      placeholder="Nội dung"
                    />
                  </Stack>
                  <Stack>
                    <MuiAutocompleteWithTags name="hashtag" label="Hashtag" />
                  </Stack>

                  {createLoading && <LinearProgress sx={{ mt: 0.5 }} />}
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
              </Grid>
            </Grid>
          </FormProvider>
        </form>
      </SimpleCard>
    </Container>
  )
}
