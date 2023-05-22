import { yupResolver } from '@hookform/resolvers/yup'
import BackupIcon from '@mui/icons-material/Backup'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import {
  deleteVideo,
  getVideoDetail,
  updateVideo,
} from 'app/apis/videos/video.service'
import { Breadcrumb, Container, SimpleCard } from 'app/components'
import { MuiRHFAutocompleteWithKeyword } from 'app/components/common/MuiRHFAutocompleteWithKeyword'
import MuiRHFTextarea from 'app/components/common/MuiRHFTextarea'
import { VIDEO_TYPES } from 'app/constants/videoTypes'
import handleUploadImage from 'app/helpers/handleUploadImage'
import { toastSuccess } from 'app/helpers/toastNofication'
import { isYouTubeUrl } from 'app/utils/utils'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'

export interface Props {}

export default function VideoDetail(props: Props) {
  const navigate = useNavigate()
  const params = useParams()

  const [video, setVideo] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string>('')
  const [isHot, setIsHot] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const schema = yup
    .object({
      title: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .max(255, 'Tối đa 255 ký tự'),
      type: yup.number().required(),
      priority: yup
        .number()
        .test('required', 'Giá trị bắt buộc', value => {
          if (isHot) return value !== undefined && value !== null
          else return true
        })
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr)),
      description: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .max(255, 'Tối đa 255 ký tự'),
      url: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .test('youtube', 'Link không hợp lệ', value => {
          return isYouTubeUrl(value)
        }),
      file: yup
        .mixed()
        .required('Giá trị bắt buộc')
        .test('fileType', 'File không hợp lệ', value => {
          if (value && value.name)
            return ['png', 'jpg', 'jpeg'].includes(
              value?.name?.split('.').pop(),
            )
          else return true
        })
        .test('fileSize', 'Dung lượng file <= 50MB', value => {
          if (value && value?.size)
            return Math.floor(value?.size / 1000000) <= 50
          else return true
        }),
      status: yup.number().required('Giá trị bắt buộc'),
      keyword: yup.array().nullable(),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      type: 1,
      priority: '',
      description: '',
      url: '',
      file: null,
      keyword: [],
      status: 1,
    },
  })
  const watchUrl = methods.watch('url')
  const watchPriority = methods.watch('priority')

  const initDefaultValues = (video: any) => {
    const defaultValues: any = {}
    defaultValues.file = video.imgUrl
    defaultValues.title = video.title
    defaultValues.type = video.type
    defaultValues.priority = video.priority
    defaultValues.description = video.description
    defaultValues.url = video.url
    defaultValues.status = video.status
    defaultValues.keyword =
      video.keyWord.length > 0
        ? video.keyWord.split(',').map((k: any) => ({
            value: k,
          }))
        : []
    methods.reset({ ...defaultValues })
    setPreviewImage(video.imgUrl)
    setIsHot(!!video.priority)
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    let imgUrl: any = ''
    if (file && file.name) {
      imgUrl = await handleUploadImage(file)
    } else imgUrl = previewImage

    const payload: any = {
      id: params.id,
      title: data.title,
      type: data.type,
      priority: isHot ? data.priority : null,
      description: data.description,
      url: data.url,
      imgUrl: imgUrl,
      keyWord: data.keyword.map((k: any) => k.value).join(','),
      status: data.status,
    }

    await updateVideo(params.id, payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
        navigate('/cahntv')
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  const tryToDelete = async () => {
    setIsLoading(true)
    await deleteVideo(params.id)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
        navigate('/cahntv')
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  const fetchVideo = async () => {
    setIsLoading(true)
    await getVideoDetail(params.id)
      .then(res => {
        setVideo(res)
        initDefaultValues(res)
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchVideo()
  }, [])

  return (
    <Container>
      {isLoading && (
        <Box
          sx={{
            width: '100%',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '1000',
          }}
        >
          <LinearProgress />
        </Box>
      )}

      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý CAHN TV', path: '/cahntv' },
            { name: 'Thêm mới video', path: '/cahntv/create' },
          ]}
        />
      </Box>

      <SimpleCard>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="title"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      error={!!methods.formState.errors?.title}
                      helperText={methods.formState.errors?.title?.message}
                      {...field}
                      label="Tiêu đề*"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="type"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="demo-simple-select-label">
                        Loại video*
                      </InputLabel>
                      <Select
                        fullWidth
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Loại video*"
                      >
                        {Object.values(VIDEO_TYPES).map((type, index) => {
                          return (
                            <MenuItem key={index} value={type.id}>
                              {type.label}
                            </MenuItem>
                          )
                        })}
                      </Select>
                      {!!methods.formState.errors?.type?.message && (
                        <FormHelperText>
                          {methods.formState.errors?.type.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <FormControl fullWidth margin="normal">
                  <FormControlLabel
                    label="Video nổi bật"
                    control={
                      <Checkbox
                        checked={isHot}
                        onChange={e => {
                          setIsHot(e.target.checked)
                        }}
                      />
                    }
                  />
                  {isHot && (
                    <Controller
                      name="priority"
                      control={methods.control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Chọn vị trí*
                          </InputLabel>
                          <Select
                            fullWidth
                            {...field}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Chọn vị trí*"
                          >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                          </Select>
                          <FormHelperText>
                            Lưu ý: Sau khi chọn, video sẽ được đưa lên đầu danh
                            sách, và thay thế vào vị trí đã chọn
                          </FormHelperText>
                          {isHot &&
                            !!watchPriority &&
                            video?.priority !== watchPriority && (
                              <FormHelperText>
                                Tại 1 thời điểm chỉ có 3 video nổi bật. Nếu tiếp
                                tục, video này sẽ thay thế video nổi bật ở vị
                                trí tương ứng
                              </FormHelperText>
                            )}
                          {!!methods.formState.errors?.priority?.message && (
                            <FormHelperText error>
                              {methods.formState.errors?.priority.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  )}
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <FormLabel error={!!methods.formState.errors?.description}>
                    Tóm tắt:*
                  </FormLabel>
                  <MuiRHFTextarea name="description" label="Tóm tắt*" />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <Controller
                    name="url"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        error={!!methods.formState.errors?.url}
                        helperText={methods.formState.errors?.url?.message}
                        {...field}
                        label="Link youtube*"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                  <FormHelperText>
                    Lưu ý: video trên youtube cần để chế độ public và cho phép
                    nhúng
                  </FormHelperText>
                </FormControl>
                {watchUrl && !!isYouTubeUrl(watchUrl) && (
                  <iframe
                    style={{ width: '100%', aspectRatio: '16/9' }}
                    title="Youtube Player"
                    sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
                    src={
                      'https://youtube.com/embed/' +
                      isYouTubeUrl(watchUrl) +
                      '?autoplay=0'
                    }
                  ></iframe>
                )}
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <FormLabel error={!!methods.formState.errors?.file}>
                    Ảnh tiêu đề*:
                  </FormLabel>
                  <input
                    type="file"
                    accept="image/png,image/jpg,image/jpeg"
                    id="uploadImage"
                    style={{ display: 'none' }}
                    onChange={(event: any) => {
                      methods.setValue('file', event.target.files[0])
                      methods.trigger('file')
                      if (!!event.target.files[0]) {
                        setFile(event.target.files[0])
                        setPreviewImage(
                          window.URL.createObjectURL(event.target.files[0]),
                        )
                      }
                    }}
                  />
                  <div
                    onClick={() => {
                      const inputUploadImage = document.getElementById(
                        'uploadImage',
                      ) as HTMLInputElement | null
                      inputUploadImage?.click()
                    }}
                    style={{
                      width: '100%',
                      minHeight: '300px',
                      border: '2px dashed gray',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {!file && previewImage?.length === 0 && (
                      <div style={{ marginTop: '10px', cursor: 'pointer' }}>
                        <div>Chọn ảnh để tải lên</div>
                        <BackupIcon fontSize="large" />
                        <div>PNG/JPEG hoặc JPG</div>
                        <div>Dung lượng không quá 50mb</div>
                        <div>(Tỷ lệ ảnh phù hợp 3:2)</div>
                      </div>
                    )}
                    {previewImage?.length !== 0 && (
                      <>
                        <div style={{ textAlign: 'right' }}>
                          <IconButton
                            aria-label="delete"
                            size="large"
                            style={{ position: 'relative' }}
                            // onClick={event => {
                            //   setFile(null)
                            //   setPreviewImage('')
                            //   methods.setValue('file', null)
                            //   methods.trigger('file')
                            //   event.stopPropagation()
                            // }}
                          >
                            <img
                              src={previewImage}
                              width="100%"
                              style={{ objectFit: 'contain' }}
                            ></img>
                          </IconButton>
                        </div>
                      </>
                    )}
                  </div>
                  {!!methods.formState.errors?.file?.message && (
                    <FormHelperText error={true}>
                      {methods.formState.errors?.file.message}
                    </FormHelperText>
                  )}
                </Box>

                <Controller
                  name="status"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="demo-simple-select-label">
                        Trạng thái*
                      </InputLabel>
                      <Select
                        fullWidth
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Trạng thái*"
                      >
                        <MenuItem value={1}>Hoạt động</MenuItem>
                        <MenuItem value={-1}>Không hoạt động</MenuItem>
                      </Select>
                      {!!methods.formState.errors?.status?.message && (
                        <FormHelperText>
                          {methods.formState.errors?.status.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>

            <FormControl fullWidth margin="normal">
              <MuiRHFAutocompleteWithKeyword name="keyword" label="Từ khóa" />
            </FormControl>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                m: 1,
              }}
            >
              <Button
                color="primary"
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ mr: 1 }}
              >
                Lưu
              </Button>
              <Button
                color="primary"
                type="button"
                variant="contained"
                disabled={isLoading}
                sx={{ mr: 1 }}
                onClick={() => setShowDeleteDialog(true)}
              >
                Xóa
              </Button>
              <Button
                variant="outlined"
                disabled={isLoading}
                onClick={() => {
                  navigate(-1)
                }}
                sx={{ mx: 1 }}
              >
                Quay lại
              </Button>
            </Box>

            <Dialog
              open={showDeleteDialog}
              onClose={() => setShowDeleteDialog(false)}
            >
              <DialogContent>Bạn có chắc muốn xóa video?</DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={isLoading}
                >
                  Không
                </Button>
                <Button
                  onClick={() => {
                    tryToDelete()
                    setShowDeleteDialog(false)
                  }}
                  disabled={isLoading}
                  autoFocus
                >
                  Đồng ý
                </Button>
              </DialogActions>
            </Dialog>
          </FormProvider>
        </form>
      </SimpleCard>
    </Container>
  )
}
