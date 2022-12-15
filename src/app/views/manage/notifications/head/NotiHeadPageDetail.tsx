import { yupResolver } from '@hookform/resolvers/yup'
import {
  Chip,
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  styled,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import { fetchCampAreas, fetchCampGrounds } from 'app/apis/feed/feed.service'
import {
  checkExistActivePopup,
  notiHeadPageDetail,
} from 'app/apis/notifications/heads/notificationsHead.service'
import { uploadApi } from 'app/apis/uploads/upload.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { DropWrapper } from 'app/components/common/ImageUploadPreviewer'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiRHFAutoComplete } from 'app/components/common/MuiRHFAutoComplete'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import { MuiTypography } from 'app/components/common/MuiTypography'
import RHFWYSIWYGEditor from 'app/components/common/RHFWYSIWYGEditor'
import { TopRightButtonList } from 'app/components/common/TopRightButtonList'
import { compressImageFile } from 'app/helpers/compressFile'
import { toastError, toastSuccess } from 'app/helpers/toastNofication'
import {
  useCreateNotiHeadPage,
  useToggleStatusHeadPage,
  useUpdateNotiHeadPage,
} from 'app/hooks/queries/useNotificationsHeadPage'
import { IMediaOverall } from 'app/models'
import { ICampArea, ICampAreaResponse, ICampGround } from 'app/models/camp'
import { INotificationDetail } from 'app/models/notification'
import { EMediaFormat } from 'app/utils/enums/medias'
import { messages } from 'app/utils/messages'
import { useEffect, useRef, useState } from 'react'
import Dropzone from 'react-dropzone'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import CampAreaList from '../../feeds/detail/CampAreaList'
import CampgroundList from '../../feeds/detail/CampgroundList'
import { DiagLogConfirm } from '../../orders/details/ButtonsLink/DialogConfirm'

export interface Props {}

type SchemaType = {
  title?: string
  srcType?: number | string
  scope?: number | string
  campground?: any // idSrc
  campArea?: any
  webUrl?: string
  content?: string | null
  imageFile?: File
  urlImage?: string
}

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

function NotiHeadPageDetail(props: any) {
  const navigate = useNavigate()
  const { notiId } = useParams()

  const [defaultValues] = useState<SchemaType>({
    scope: 1,
    srcType: 0,
  })

  const [imagePreviewer, setImagePreviewer] = useState<IMediaOverall | null>(
    null,
  )

  const dropzoneImgRef = useRef(null) as any

  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string
    type?: string
    submitText?: string
    cancelText?: string
    payload?: INotificationDetail
  }>({})
  const [openDialog, setOpenDialog] = useState(false)

  const [selectedCampAreas, setSelectedCampAreas] = useState<
    readonly ICampArea[]
  >([])
  const [selectedCampgrounds, setSelectedCampgrounds] = useState<
    readonly ICampGround[]
  >([])

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(messages.MSG1),
    srcType: Yup.string().required(messages.MSG1),
    campArea: Yup.object()
      .nullable()
      .when(['srcType'], {
        is: (idSrcType: any) => idSrcType == 1,
        then: Yup.object().required(messages.MSG1).nullable(), // when camp selected empty
      })
      .nullable(),
    campground: Yup.object()
      .nullable()
      .when(['srcType'], {
        is: (idSrcType: any) => idSrcType == 2,
        then: Yup.object().required(messages.MSG1).nullable(), // when camp selected empty
      })
      .nullable(),

    webUrl: Yup.string()
      .nullable()
      .when(['srcType'], {
        is: (idSrcType: any) => !!idSrcType && Number(idSrcType) === 4,
        then: Yup.string().required(messages.MSG1).nullable(),
      }),

    content: Yup.string()
      .nullable()
      .when(['srcType'], {
        is: (idSrcType: any) => !!idSrcType && Number(idSrcType) === 13,
        then: Yup.string().required(messages.MSG1).nullable(),
      }),
    imageFile: Yup.mixed().test('empty', messages.MSG1, () => {
      return !!imagePreviewer
    }),
  })

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const srcType = methods.watch('srcType')
  const campArea = methods.watch('campArea')
  const campground = methods.watch('campground')

  useEffect(() => {
    if (selectedCampAreas.length) setSelectedCampAreas([])
    if (selectedCampgrounds.length) setSelectedCampgrounds([])
  }, [openDialog])

  useEffect(() => {
    if (campArea) {
      methods.clearErrors('campArea')
    } else if (campground) {
      methods.clearErrors('campground')
    }
  }, [campArea, campground])

  const {
    data: noti,
    isLoading,
    fetchStatus,
    isError,
    error,
  } = useQuery<INotificationDetail, Error>(
    ['noti-head', notiId],
    () => notiHeadPageDetail(Number(notiId ?? 0)),
    {
      enabled: !!notiId,
      refetchOnWindowFocus: false,
      staleTime: 30 * 60 * 1000,
    },
  )

  const { data: campAreas } = useQuery<ICampAreaResponse, Error>(
    ['camp-areas'],
    () => fetchCampAreas({ size: 200, page: 0 }),
    {
      refetchOnWindowFocus: false,
      staleTime: 30 * 60 * 1000,
    },
  )

  const { data: campGrounds } = useQuery<ICampAreaResponse, Error>(
    ['camp-grounds'],
    () => fetchCampGrounds({ size: 200, page: 0 }),
    {
      refetchOnWindowFocus: false,
      staleTime: 30 * 60 * 1000,
    },
  )

  useEffect(() => {
    initDefaultValues(noti)
  }, [noti, campGrounds, campAreas])

  const initDefaultValues = async (noti?: INotificationDetail) => {
    if (!noti) {
      methods.reset()
      return
    }
    defaultValues.title = noti.title ?? ''
    defaultValues.srcType = noti.srcType ?? 0
    defaultValues.content = noti.content
    defaultValues.webUrl = noti.webUrl ?? ''

    if (noti.imgUrl) {
      setImagePreviewer({
        mediaFormat: EMediaFormat.IMAGE,
        url: noti.imgUrl,
      })
    }

    if (campGrounds?.content && campAreas?.content) {
      if (noti.srcType == 1) {
        const campArea = campAreas.content.find(c => c.id == noti.idSrc)
        defaultValues.campArea = campArea ?? undefined
      } else if (noti.srcType == 2) {
        const campground = campGrounds.content.find(c => c.id == noti.idSrc)
        defaultValues.campground = campground ?? undefined
      }
    }

    methods.reset({ ...defaultValues })
  }

  const onSubmitHandler: SubmitHandler<SchemaType> = async (
    values: SchemaType,
    status?: any,
  ) => {
    let imgData
    if (values.imageFile) {
      const fileCompressed = await compressImageFile(values.imageFile)

      imgData = await uploadApi(fileCompressed, () => {}, null, {
        srcType: 13,
      })
    }

    const payload: INotificationDetail = {
      title: values.title,
      scope: Number(values.scope),
      srcType: values.srcType != 0 ? Number(values.srcType) : null,
      idSrc:
        values.srcType != 4 && values.srcType != 0 && values.srcType != 13
          ? Number(
              values.srcType == 1 ? values.campArea?.id : values.campground?.id,
            )
          : null,
      webUrl: values.srcType == 4 ? values.webUrl : null,
      imgUrl: imgData ? imgData.url : noti?.imgUrl || null,
      content: values.srcType == 13 ? values.content : null,
      status: (noti && noti.status) || (status as number) || 0,
    }

    if (status == 1) {
      !!notiId
        ? openSendDialog({ ...payload, id: Number(notiId) })
        : openSendDialog(payload)
    } else {
      if (notiId) {
        edit({ ...payload, id: Number(notiId) })
      } else {
        add(payload)
      }
    }
  }

  const openDialogFileImage = () => {
    if (dropzoneImgRef.current) {
      dropzoneImgRef.current.open()
    }
  }
  const removeImageSelected = () => {
    setImagePreviewer(null)
    methods.setValue('imageFile', undefined)
  }

  const onRowUpdateSuccess = (data: any, message: string) => {
    toastSuccess({ message: message })
    // navigate('/quan-ly-thong-bao/nguoi-dung', {})
    if (openDialog) setOpenDialog(false)
    methods.reset()
  }
  const { mutate: toggleStatus, isLoading: toggleLoading } =
    useToggleStatusHeadPage(() =>
      onRowUpdateSuccess(
        null,
        noti?.status === 1
          ? 'Tắt thông báo đầu trang thành công'
          : 'Bật thông báo thành công',
      ),
    )
  const { mutate: add, isLoading: createLoading } = useCreateNotiHeadPage(
    (data: any) => {
      if (data) {
        onRowUpdateSuccess(
          null,
          'Thông báo đã được thêm, bạn cần thực hiện nhấn “Bật” để thực hiện gửi thông báo cho người dùng. ',
        )
        navigate(`/quan-ly-thong-bao/dau-trang/${data.id}/chi-tiet`, {
          replace: true,
        })
      }
    },
  )

  const { mutate: edit, isLoading: editLoading } = useUpdateNotiHeadPage(() =>
    onRowUpdateSuccess(null, 'Cập nhật thông báo đầu trang thành công'),
  )

  //   const { mutate: deletedFeed } = useDeleteFeed(() =>
  //     onRowUpdateSuccess(null, 'Xoá thành công'),
  //   )

  const onDeleteFeed = () => {
    // if (notiId) deletedFeed(Number(notiId))
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

  const openSendDialog = async (payload?: INotificationDetail) => {
    const res = await checkExistActivePopup()

    setDialogData(prev => ({
      ...prev,
      title: noti?.status === 1 ? 'Tắt thông báo' : 'Bật thông báo',
      message:
        noti?.status === 1
          ? 'Sau khi tắt, thông báo sẽ không còn được hiển thị cho khách hàng. Bạn có chắc muốn tắt?'
          : res?.existActivePopup
          ? 'Sau khi bật sẽ thay thế cho thông báo lúc mở app hiện tại. Bạn có chắc muốn bật?'
          : 'Sau khi bật, thông báo sẽ được hiển thị ngay khi KH mở ứng dụng. Bạn có chắc muốn bật?',
      type: 'toggle-status',
      submitText: 'Có',
      cancelText: 'Không',
      payload: payload,
    }))
    setOpenDialog(true)
  }

  const openCampsList = () => {
    setDialogData(prev => ({
      ...prev,
      title: srcType == 1 ? 'Chọn địa danh' : 'Chọn địa điểm',
      type: srcType == 1 ? 'camp-areas' : 'camp-grounds',
      submitText: 'Lưu',
      cancelText: 'Huỷ',
    }))
    setOpenDialog(true)
  }

  const onSubmitDialog = () => {
    switch (dialogData.type) {
      case 'toggle-status':
        !!notiId ? toggleStatus(Number(notiId)) : add(dialogData.payload!)
        break
      case 'delete':
        onDeleteFeed()

        break
      case 'camp-areas':
        methods.setValue('campArea', selectedCampAreas[0] || null)
        setOpenDialog(false)

        break

      case 'camp-grounds':
        methods.setValue('campground', selectedCampgrounds[0] || null)
        setOpenDialog(false)

        break

      default:
        break
    }
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
          Have an errors: {error?.message}
        </MuiTypography>
      </Box>
    )

  return (
    <Container>
      {(createLoading || editLoading) && (
        <Box
          sx={{
            width: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 999,
          }}
        >
          <LinearProgress />
        </Box>
      )}

      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            {
              name: 'Thông báo đầu trang',
              path: '/quan-ly-thong-bao/dau-trang',
            },
            { name: notiId ? 'Chi tiết thông báo' : 'Thêm mới thông báo' },
          ]}
        />
      </Box>

      <TopRightButtonList
        isLoading={createLoading || editLoading || toggleLoading}
        onSave={() => methods.handleSubmit(onSubmitHandler)(0 as any)}
        onCallback={
          noti
            ? () => methods.handleSubmit(onSubmitHandler)(1 as any)
            : undefined
        }
        titleCallback={noti && noti.status === 1 ? 'Tắt' : 'Bật'}
        onGoBack={() => navigate(-1)}
      />

      <SimpleCard>
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <FormProvider {...methods}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <Stack gap={3}>
                  <FormInputText
                    type="text"
                    name="title"
                    label={'Tiêu đề'}
                    defaultValue=""
                    placeholder="Nhập tiêu đề thông báo"
                    fullWidth
                    required
                  />
                  <SelectDropDown
                    name="scope"
                    label="Phạm vi"
                    required
                    disabled
                  >
                    <MenuItem value="1">Toàn bộ</MenuItem>
                    <MenuItem value="2">Theo tệp</MenuItem>
                  </SelectDropDown>

                  <Stack flexDirection={'row'} gap={3} my={2}>
                    <MuiTypography variant="body2">
                      Ảnh thông báo báo *:
                    </MuiTypography>
                    <Box width={200}>
                      <Dropzone
                        ref={dropzoneImgRef}
                        onDrop={(acceptedFiles, fileRejections) => {
                          if (fileRejections.length) {
                            toastError({
                              message:
                                fileRejections[0].errors[0].code ===
                                'file-too-large'
                                  ? 'Ảnh tải lên không được vượt quá 10MB'
                                  : fileRejections[0].errors[0].message,
                            })
                          }
                          if (!acceptedFiles || !acceptedFiles.length) return
                          setImagePreviewer({
                            url: URL.createObjectURL(acceptedFiles[0]),
                          })
                          methods.setValue('imageFile', acceptedFiles[0])
                          methods.clearErrors('imageFile')
                        }}
                        accept={{
                          'image/png': ['.png', '.PNG'],
                          'image/jpeg': ['.jpg', '.jpeg'],
                        }}
                        multiple={false}
                        maxSize={10 * 1024 * 1024}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <>
                            <div {...getRootProps({ className: 'dropzone' })}>
                              <input {...getInputProps()} />
                              {!imagePreviewer && (
                                <DropWrapper
                                  sx={{
                                    aspectRatio: 'auto 1 / 1',
                                    borderRadius: 1.5,
                                    display: 'flex',
                                  }}
                                >
                                  <Stack
                                    sx={{
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      gap: 0.5,
                                    }}
                                  >
                                    <MuiTypography variant="body2">
                                      Chọn hoặc kéo thả ảnh
                                    </MuiTypography>
                                    <Icon>backup</Icon>
                                    <MuiTypography
                                      variant="body2"
                                      fontSize={'0.75rem'}
                                    >
                                      PNG / JPEG hoặc JPG
                                    </MuiTypography>
                                    <MuiTypography
                                      variant="body2"
                                      fontSize={'0.75rem'}
                                    >
                                      tối đa 10MB/ảnh
                                    </MuiTypography>
                                  </Stack>
                                </DropWrapper>
                              )}
                            </div>
                            {imagePreviewer && (
                              <Box
                                sx={{
                                  position: 'relative',
                                  aspectRatio: 'auto 1 / 1',
                                  borderRadius: 1.5,
                                  overflow: 'hidden',
                                  boxShadow:
                                    '0 2px 6px 0 rgba(0, 0, 0, 0.1), 0 4px 10px 0 rgba(0, 0, 0, 0.16)',
                                }}
                              >
                                <Stack
                                  flexDirection={'row'}
                                  sx={{
                                    position: 'absolute',
                                    top: '6px',
                                    right: '6px',
                                    gap: 1,
                                  }}
                                >
                                  <Tooltip arrow title={'Chọn lại'}>
                                    <IconButton
                                      sx={{
                                        bgcolor: '#303030',
                                        borderRadius: 1,
                                      }}
                                      onClick={openDialogFileImage}
                                    >
                                      <Icon sx={{ color: 'white' }}>
                                        cached
                                      </Icon>
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip arrow title={'Xóa'}>
                                    <IconButton
                                      sx={{
                                        bgcolor: '#303030',
                                        borderRadius: 1,
                                      }}
                                      onClick={removeImageSelected}
                                    >
                                      <Icon sx={{ color: 'white' }}>
                                        delete
                                      </Icon>
                                    </IconButton>
                                  </Tooltip>
                                </Stack>

                                <img
                                  src={imagePreviewer.url}
                                  alt="thumb"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                              </Box>
                            )}
                          </>
                        )}
                      </Dropzone>
                      {methods.formState.errors.imageFile && (
                        <FormHelperText error>
                          {
                            methods.formState.errors.imageFile
                              ?.message as string
                          }
                        </FormHelperText>
                      )}
                    </Box>
                  </Stack>

                  <Stack>
                    <SelectDropDown name="srcType" label="Liên kết với">
                      <MenuItem value="0">Không liên kết</MenuItem>
                      <MenuItem value="1">Địa danh</MenuItem>
                      <MenuItem value="2">Điểm Camp</MenuItem>
                      <MenuItem value="4">Sản phẩm</MenuItem>
                      <MenuItem value="13">Nội dung</MenuItem>
                    </SelectDropDown>
                  </Stack>
                  {!!srcType && srcType != 0 && srcType != 13 && (
                    <Stack
                      flexDirection={'row'}
                      gap={1.5}
                      justifyContent="center"
                    >
                      {srcType == 4 ? (
                        <MuiTypography fontSize="12px" fontStyle="italic">
                          {getTitleLinked(Number(srcType))} *
                        </MuiTypography>
                      ) : (
                        <MuiButton
                          title={getTitleLinked(Number(srcType)) + ' *'}
                          //   disabled={isLoading}
                          variant="contained"
                          color="primary"
                          onClick={() => openCampsList()}
                          startIcon={<Icon>place</Icon>}
                        />
                      )}

                      <Box sx={{ flex: 1 }}>
                        {srcType == 1 && (
                          <MuiRHFAutoComplete
                            label="Địa danh"
                            name="campArea"
                            options={[campArea ?? {}]}
                            optionProperty="name"
                            getOptionLabel={option => option.name ?? ''}
                            defaultValue=""
                            required
                            disabled
                          />
                        )}
                        {srcType == 2 && (
                          <MuiRHFAutoComplete
                            label="Điểm camping"
                            name="campground"
                            options={[campground ?? {}]}
                            optionProperty="name"
                            getOptionLabel={option => option.name ?? ''}
                            defaultValue=""
                            required
                            disabled
                          />
                        )}
                        {srcType == 4 && (
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
                </Stack>
              </Grid>
              <Grid item sm={6}>
                <Stack
                  direction={'row'}
                  justifyContent={'flex-end'}
                  width="100%"
                >
                  {noti && (
                    <Chip
                      label={
                        noti.status === 1 ? 'Hoạt động' : 'Không hoạt động'
                      }
                      size="medium"
                      color={noti.status === 1 ? 'primary' : 'default'}
                    />
                  )}
                </Stack>
              </Grid>

              {srcType == 13 && (
                <Grid item sm={12}>
                  <Stack>
                    <MuiTypography variant="subtitle2" pb={1}>
                      Nội dung
                    </MuiTypography>
                    <RHFWYSIWYGEditor name="content" />
                  </Stack>
                </Grid>
              )}
            </Grid>
          </FormProvider>
        </form>
      </SimpleCard>
      <DiagLogConfirm
        title={dialogData.title ?? ''}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={onSubmitDialog}
        maxWidth={dialogData.type !== 'toggle-status' ? 'lg' : 'sm'}
        submitText={dialogData.submitText}
        cancelText={dialogData.cancelText}
        disabled={
          ((!selectedCampAreas.length && srcType == 1) ||
            (!selectedCampgrounds.length && srcType == 2)) &&
          dialogData.type !== 'send'
        }
      >
        <>
          {dialogData.type === 'camp-areas' && (
            <CampAreaList setSelectedCamps={setSelectedCampAreas} />
          )}
          {dialogData.type === 'camp-grounds' && (
            <CampgroundList setSelectedCamps={setSelectedCampgrounds} />
          )}
          {dialogData.type === 'toggle-status' && (
            <Stack py={5} justifyContent={'center'} alignItems="center">
              <MuiTypography variant="subtitle1" textAlign={'center'}>
                {dialogData.message ?? ''}
              </MuiTypography>
            </Stack>
          )}
        </>
      </DiagLogConfirm>
    </Container>
  )
}

export default NotiHeadPageDetail
