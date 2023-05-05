export interface Props {}
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
import { getNewsDetail, updateNews } from 'app/apis/news/news.service'
import { Breadcrumb, Container, SimpleCard } from 'app/components'
import { MuiRHFAutocompleteWithKeyword } from 'app/components/common/MuiRHFAutocompleteWithKeyword'
import MuiRHFTextarea from 'app/components/common/MuiRHFTextarea'
import RHFWYSIWYGEditor from 'app/components/common/RHFWYSIWYGEditor'
import { NEWS_TYPES } from 'app/constants/newsType'
import handleUploadImage from 'app/helpers/handleUploadImage'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'
import './style.css'

export default function NewsDetail(props: Props) {
  const navigate = useNavigate()
  const params = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [news, setNews] = useState<any>()
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string>('')
  const [isHot, setIsHot] = useState(false)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)

  const schema = yup
    .object({
      title: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .max(500, 'Tối đa 500 ký tự'),
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
        .max(1000, 'Tối đa 1000 ký tự'),
      content: yup.string().required('Giá trị bắt buộc').trim(),
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
      content: '',
      file: null,
      keyword: [],
    },
  })
  const watchPriority = methods.watch('priority')

  const initDefaultValues = (news: any) => {
    const defaultValues: any = {}
    defaultValues.file = news.imgUrl
    defaultValues.title = news.title
    defaultValues.type = news.newsCategory
    defaultValues.priority = news.priority
    defaultValues.description = news.description
    defaultValues.content = news.content
    defaultValues.keyword =
      news.keyWord.length > 0
        ? news.keyWord.split(',').map((k: any) => ({
            value: k,
          }))
        : []
    setPreviewImage(news.imgUrl)
    setIsHot(!!news.priority)
    methods.reset({ ...defaultValues })
  }

  const onSave = async (data: any) => {
    setIsLoading(true)
    let imgUrl: any = ''
    if (file && file.name) {
      imgUrl = await handleUploadImage(file)
    } else imgUrl = news.imgUrl

    const payload: any = {
      id: params.id,
      title: data.title,
      idCategory: data.type,
      type: data.type,
      priority: isHot ? data.priority : null,
      description: data.description,
      content: data.content,
      imgUrl: imgUrl,
      keyWord: data.keyword.map((k: any) => k.value).join(','),
      status: news.status,
    }

    await updateNews(payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
        navigate('/news')
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onPublishOrUnpublish = async (data: any) => {
    setIsLoading(true)
    let imgUrl: any = ''
    if (file && file.name) {
      imgUrl = await handleUploadImage(file)
    } else imgUrl = news.imgUrl

    const payload: any = {
      id: params.id,
      title: data.title,
      idCategory: data.type,
      type: data.type,
      priority: data.priority,
      description: data.description,
      content: data.content,
      imgUrl: imgUrl,
      keyWord: data.keyword.map((k: any) => k.value).join(','),
      status: news.status ? 0 : 1,
    }

    await updateNews(payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
        navigate('/news')
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  const fetchNews = async () => {
    setIsLoading(true)
    await getNewsDetail(params.id)
      .then(res => {
        setNews(res)
        initDefaultValues(res)
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchNews()
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
            { name: 'Quản lý tin tức', path: '/news' },
            { name: 'Chi tiết tin tức', path: '/news/' + params.id },
          ]}
        />
      </Box>

      <SimpleCard>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box></Box>
          <Button
            variant="text"
            sx={{ color: news?.status === 1 ? 'limegreen' : 'grey' }}
          >
            {news?.status === 1 ? 'Đã đăng' : 'Chưa đăng'}
          </Button>
        </Box>
        <form onSubmit={methods.handleSubmit(onSave)}>
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
                        Loại tin tức*
                      </InputLabel>
                      <Select
                        fullWidth
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Loại tin tức*"
                      >
                        {Object.values(NEWS_TYPES).map((type, index) => {
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
                <FormControlLabel
                  label="Tin nổi bật"
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
                          Lưu ý: Sau khi chọn, tin tức sẽ được đưa lên đầu danh
                          sách, và thay thế vào vị trí đã chọn
                        </FormHelperText>
                        {isHot && !!watchPriority && (
                          <FormHelperText>
                            Tại 1 thời điểm chỉ có 3 tin tức nổi bật. Nếu tiếp
                            tục, tin tức này sẽ thay thế tin tức nổi bật ở vị
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
                <FormControl fullWidth margin="normal">
                  <FormLabel error={!!methods.formState.errors?.description}>
                    Tóm tắt:*
                  </FormLabel>
                  <MuiRHFTextarea name="description" label="Tóm tắt*" />
                </FormControl>
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
              </Grid>
            </Grid>

            <FormControl fullWidth margin="normal">
              <FormLabel error={!!methods.formState.errors?.content}>
                Nội dung:*
              </FormLabel>
              <RHFWYSIWYGEditor name="content"></RHFWYSIWYGEditor>
            </FormControl>

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
                type="button"
                variant="contained"
                disabled={isLoading}
                onClick={methods.handleSubmit(onSave)}
                sx={{ mr: 1 }}
              >
                Lưu
              </Button>
              <Button
                color="primary"
                type="button"
                variant="contained"
                disabled={isLoading}
                onClick={() => {
                  methods.trigger().then(() => {
                    if (methods.formState.isValid)
                      setShowConfirmationDialog(true)
                  })
                }}
                sx={{ mx: 1 }}
              >
                {news?.status === 1 ? 'Hạ bài' : 'Đăng bài'}
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

              <Dialog
                open={showConfirmationDialog}
                onClose={() => setShowConfirmationDialog(false)}
              >
                <DialogContent>{`Bạn có chắc muốn ${
                  news?.status === 1 ? 'hạ bài' : 'đăng bài'
                }?`}</DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setShowConfirmationDialog(false)}
                    disabled={isLoading}
                  >
                    Không
                  </Button>
                  <Button
                    onClick={() => {
                      methods.handleSubmit(onPublishOrUnpublish)
                      setShowConfirmationDialog(false)
                    }}
                    disabled={isLoading}
                    autoFocus
                  >
                    Đồng ý
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </FormProvider>
        </form>
      </SimpleCard>
    </Container>
  )
}
