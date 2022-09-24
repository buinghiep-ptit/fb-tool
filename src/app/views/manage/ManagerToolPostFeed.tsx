import { yupResolver } from '@hookform/resolvers/yup'
import {
  ApprovalRounded,
  CancelSharp,
  CloseRounded,
  UploadFile,
  UploadFileSharp,
} from '@mui/icons-material'
import {
  Button,
  Grid,
  IconButton,
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
import { uploadImage } from 'app/apis/uploads/image.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { UploadFiles } from 'app/components/common/FilesUpload'
import { MuiAutoComplete } from 'app/components/common/MuiAutoComplete'
import { MuiAutocompleteWithTags } from 'app/components/common/MuiAutocompleteWithTags'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiInputText'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiRHFAutoComplete } from 'app/components/common/MuiRHFAutoComplete'
import { SelectDropDown } from 'app/components/common/MuiSelectDropdown'
import FormTextArea from 'app/components/common/MuiTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { UploadMedias } from 'app/components/common/UploadPreviewer'
import { ICustomer, ICustomerResponse, ICustomerTiny } from 'app/models'
import { ICampAreaResponse, ICampGroundResponse } from 'app/models/camp'
import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import * as Yup from 'yup'
import { ImageListView } from './feeds/components/ImageListCustomize'

export interface Props {}

type SchemaType = {
  type?: 1 | 2
  cusType?: number
  customer?: any // idCustomer
  idSrcType?: number
  camp?: any // idSrc
  webUrl?: string
  content?: string
  files?: any
  hashtag?: any
}

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function ManagerToolPostFeed(props: Props) {
  const [accountList, setAccountList] = useState<ICustomer[]>([])
  const [files, setFiles] = useState([])
  const [videoSrc, seVideoSrc] = useState('')
  const fileRef = useRef()
  const [fileConfigs, setFileConfigs] = useState({
    mediaFormat: 2,
    accept: 'image/*',
    multiple: true,
  })
  const [defaultValues] = useState<SchemaType>({
    type: 2,
    cusType: 0,
    idSrcType: 1,
    customer: null,
    hashtag: [],
  })
  const [filters, setFilters] = useState({ cusType: 0 })

  const validationSchema = Yup.object().shape({
    customer: Yup.object().required('Thông tin bắt buốc').nullable(),
    idSrcType: Yup.string().required(),
    camp: Yup.object()
      .when(['idSrcType'], {
        is: (idSrcType: any) => Number(idSrcType) !== 4,
        then: Yup.object().required('Thông tin bắt buốc').nullable(), // when camp selected empty
      })
      .nullable(),
    webUrl: Yup.string().when(['idSrcType'], {
      is: (idSrcType: any) => Number(idSrcType) === 4,
      then: Yup.string().required('Thông tin bắt buốc'),
    }),
    content: Yup.string().required('Nội dung không được bỏ trống'),
  })

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
    enabled: !!filters && filters.cusType !== 0,
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
    setAccountList([...accounts])
    methods.setValue('customer', accounts.length && accounts[0])
  }, [methods.setValue, methods.watch('cusType'), customers, customerCampdi])

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    console.log(values)
  }

  useEffect(() => {
    if (Number(methods.watch('type') ?? 0) === 2) {
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
  }, [methods.watch('type')])

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      cusType: Number(methods.getValues('cusType') ?? 0),
    }))
    methods.clearErrors('customer')
  }, [methods.watch('cusType')])

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL((file as any).url))
  }, [])

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

  const upload = async () => {
    const files = methods.getValues('files')
    const formData = new FormData()
    formData.append('file', files[0])

    try {
      const result: any = await uploadImage(formData)
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
  // const [selectedFiles, setSelectedFiles] = useState(undefined)
  // const onSelectFiles = (event: any) => {
  //   setSelectedFiles(event.target.files)
  // }

  const [selectFiles, uploadFiles, progressInfos, message, fileInfos] =
    UploadFiles()

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
      <SimpleCard title="Post bài">
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <FormProvider {...methods}>
            <Grid container spacing={3}>
              <Grid item sm={5} xs={12}>
                <Stack gap={1.5}>
                  <Stack>
                    <MuiTypography variant="subtitle2" pb={1}>
                      Loại
                    </MuiTypography>
                    <SelectDropDown name="cusType">
                      <MenuItem value="0">Campdi</MenuItem>
                      <MenuItem value="1">Campdi (food)</MenuItem>
                      <MenuItem value="2">KOL</MenuItem>
                    </SelectDropDown>
                  </Stack>
                  <Stack
                    flexDirection={'row'}
                    gap={1.5}
                    justifyContent="center"
                    alignItems={'center'}
                  >
                    <MuiTypography fontSize="12px" pb={1} fontStyle="italic">
                      Tài khoản post *
                    </MuiTypography>
                    <Box sx={{ flex: 1 }}>
                      <MuiAutoComplete
                        itemList={accountList}
                        name="customer"
                        disabled={Number(methods.getValues('cusType')) === 0}
                      />
                    </Box>
                  </Stack>
                  <Stack>
                    <MuiTypography variant="subtitle2" pb={1}>
                      Liên kết với
                    </MuiTypography>

                    <SelectDropDown name="idSrcType">
                      <MenuItem value="1">Địa danh</MenuItem>
                      <MenuItem value="2">Điểm Camp</MenuItem>
                      <MenuItem value="4">Sản phẩm</MenuItem>
                    </SelectDropDown>
                  </Stack>
                  <Stack
                    flexDirection={'row'}
                    gap={1.5}
                    justifyContent="center"
                    alignItems={'center'}
                  >
                    <MuiTypography fontSize="12px" pb={1} fontStyle="italic">
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
                          defaultValue={'https://shopee.vn/'}
                        />
                      )}
                    </Box>
                  </Stack>

                  <Stack>
                    <MuiTypography variant="subtitle2" pb={1}>
                      Nội dung
                    </MuiTypography>
                    <FormTextArea
                      name="content"
                      defaultValue={''}
                      placeholder="Nội dung"
                    />
                  </Stack>
                  <Stack>
                    <MuiTypography variant="subtitle2" pb={1}>
                      Gắn thẻ
                    </MuiTypography>
                    <MuiAutocompleteWithTags name="hashtag" />
                  </Stack>

                  <Grid container spacing={2} mt={1.5}>
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
                </Stack>
              </Grid>

              <Grid
                item
                sm={7}
                xs={12}
                justifyContent="center"
                alignItems={'center'}
              >
                <Stack gap={2} alignItems={'center'}>
                  <Stack justifyContent="flex-end">
                    <MuiTypography variant="subtitle2" pb={1}>
                      Chọn loại tập tin tải lên
                    </MuiTypography>

                    <SelectDropDown name="type">
                      <MenuItem value={1}>Video</MenuItem>
                      <MenuItem value={2}>Ảnh</MenuItem>
                    </SelectDropDown>
                  </Stack>
                  <Box width={'66.66%'} position="relative">
                    {files.length ? (
                      <Box>
                        <ImageListView medias={files} />
                      </Box>
                    ) : null}
                    <label>
                      <Controller
                        name="files"
                        control={methods.control}
                        defaultValue={[]}
                        render={({ field }) => (
                          <input
                            ref={fileRef as any}
                            style={{ display: 'none' }}
                            type="file"
                            name="avatar"
                            accept={fileConfigs.accept}
                            multiple={fileConfigs.multiple}
                            {...props}
                            onChange={event => {
                              if (event.target.files?.length) {
                                field.onChange([
                                  ...files,
                                  ...event.target.files,
                                ])
                                const reader = new FileReader()
                                console.log(event.target.files[0])
                                const url = URL.createObjectURL(
                                  event.target.files[0],
                                )
                                seVideoSrc(url)

                                // const newFiles = [...event.target.files].map(
                                //   (file, index) =>
                                //     Object.assign(file, {
                                //       id: index + files.length,
                                //       url: URL.createObjectURL(file),
                                //     }),
                                // )
                                // setFiles(prev => [...prev, ...newFiles] as any)
                              }
                            }}
                          />
                        )}
                      />

                      {!files.length ? (
                        <Box
                          width={'100%'}
                          sx={{
                            position: 'relative',
                            aspectRatio: 'auto 16 / 9',
                            background: 'rgba(22, 24, 35, 0.03)',
                            borderRadius: 1.5,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            border: '2px dashed rgba(22, 24, 35, 0.2)',
                            '&:hover': {
                              border: '2px dashed #2F9B42',
                            },
                            p: 2,
                          }}
                        >
                          <Stack
                            flexDirection={'column'}
                            alignItems="center"
                            gap={1}
                          >
                            <MuiTypography fontSize={'1rem'}>
                              Chọn ảnh hoặc video để tải lên
                            </MuiTypography>
                            <UploadFile fontSize="medium" />
                            <MuiTypography fontSize={'0.75rem'}>
                              MP4 hoặc WebM với Video (tối đa 3 phút)
                            </MuiTypography>
                            <MuiTypography fontSize={'0.75rem'}>
                              PNG / JPEG / JPG với Ảnh (tối đa 10MB/ảnh)
                            </MuiTypography>

                            <MuiButton
                              title="Chọn tập tin"
                              variant="contained"
                              color="primary"
                              sx={{ mt: 2 }}
                              onClick={() =>
                                fileRef?.current &&
                                (fileRef.current as any).click()
                              }
                            />
                          </Stack>
                        </Box>
                      ) : (
                        <Stack
                          sx={{
                            position: 'absolute',
                            top: '28px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Stack
                            sx={{
                              cursor: 'pointer',
                              borderRadius: 1,
                              backgroundColor: 'white',
                              px: 2,
                              py: 1,
                              mx: 2,
                            }}
                            flexDirection={'row'}
                            gap={0.5}
                            alignItems={'center'}
                          >
                            <UploadFileSharp fontSize="small" />
                            <MuiTypography>Thêm ảnh/video</MuiTypography>
                          </Stack>

                          <IconButton
                            onClick={(e: any) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setFiles([])
                              methods.clearErrors('files')
                              methods.setValue('files', null)
                            }}
                          >
                            <CloseRounded
                              fontSize="medium"
                              sx={{
                                bgcolor: 'white',
                                borderRadius: 100,
                                mx: 1,
                              }}
                            />
                          </IconButton>
                        </Stack>
                      )}
                    </label>
                    <Button sx={{ my: 2 }} variant="outlined" onClick={upload}>
                      Upload
                    </Button>
                    <UploadMedias mediaConfigs={fileConfigs} />
                    <div>
                      {progressInfos &&
                        (progressInfos as any).val.length > 0 &&
                        (progressInfos as any).val.map(
                          (progressInfo: any, index: number) => (
                            <div className="mb-2" key={index}>
                              <span>{(progressInfo as any).fileName}</span>
                              <div className="progress">
                                {(progressInfo as any).percentage}%
                              </div>
                            </div>
                          ),
                        )}
                      <div className="row my-3">
                        <div className="col-8">
                          <label className="btn btn-default p-0">
                            <input
                              type="file"
                              multiple
                              onChange={event =>
                                selectFiles(event.target.files)
                              }
                            />
                          </label>
                        </div>

                        <div className="col-4">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={uploadFiles as any}
                          >
                            Upload
                          </button>
                        </div>
                      </div>

                      {(message as any[]).length > 0 && (
                        <div className="alert alert-secondary" role="alert">
                          <ul>
                            {(message as any).map((item: string, i: number) => {
                              return <li key={i}>{item}</li>
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
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
