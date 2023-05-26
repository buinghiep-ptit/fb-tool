import { yupResolver } from '@hookform/resolvers/yup'
import BackupIcon from '@mui/icons-material/Backup'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import {
  getBannerDetail,
  updateBannerDetail,
} from 'app/apis/banner/banner.service'
import { Breadcrumb, Container, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import handleUploadImage from 'app/helpers/handleUploadImage'
import handleUploadVideo from 'app/helpers/handleUploadVideo'
import { toastSuccess, toastWarning } from 'app/helpers/toastNofication'
import { useEffect, useRef, useState } from 'react'
import { SketchPicker } from 'react-color'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import * as yup from 'yup'

export interface Props {}
export default function EditBanner(props: Props) {
  const navigate = useNavigate()
  const [position, setPosition] = useState<any>(1)
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [isLoading, setIsLoading] = useState(false)

  const params = useParams()

  const [colorDisplay, setColorDisplay] = useState('#FFFFFF')
  const [colorButton, setColorButton] = useState('#FFFFFF')
  const [colorText, setColorText] = useState('#FFFFFF')
  const [colorDescription, setColorDescription] = useState('#FFFFFF')
  const [type, setType] = useState<number>(1)
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewVideo, setPreviewVideo] = useState<string>('')
  const [currentMediaUrl, setCurrentMediaUrl] = useState<any>('')
  const [MediaUrlResponse, setMediaUrlResponse] = useState<any>()
  const [typeResponse, setTypeResponse] = useState<any>()
  const [showColorPicker1, setShowColorPicker1] = useState<any>(false)
  const [showColorPicker2, setShowColorPicker2] = useState<any>(false)
  const [showColorPicker3, setShowColorPicker3] = useState<any>(false)
  const [showColorPicker4, setShowColorPicker4] = useState<any>(false)
  const inputRef = useRef<any>(null)

  const schema = yup
    .object({
      title: yup.string().max(255, 'Tối đa 255 ký tự').trim().nullable(),
      titlePosition: yup.number().nullable(),
      descriptionPosition: yup.number().nullable(),
      titleColor: yup.string().trim().nullable(),
      buttonContent: yup
        .string()
        .max(255, 'Tối đa 255 ký tự')
        .trim()
        .nullable(),
      url: yup.string().trim().nullable(),
      buttonPosition: yup.number().nullable(),
      file:
        type === 1
          ? yup
              .mixed()
              .test('fileType', 'File không hợp lệ', value => {
                if (currentMediaUrl?.length > 0) return true
                if (value && value.name)
                  return ['png', 'jpg', 'jpeg'].includes(
                    value?.name?.split('.').pop(),
                  )
                else return true
              })
              .test('fileSize', 'Dung lượng không quá 50MB', value => {
                if (currentMediaUrl?.length > 0) return true
                return Math.floor(value?.size / 1000000) <= 50
              })
          : yup
              .mixed()
              .test('fileType', 'File không hợp lệ', value => {
                if (currentMediaUrl?.length > 0) return true
                if (value && value.name)
                  return ['mp4'].includes(value?.name?.split('.').pop())
                else return true
              })
              .test('fileSize', 'Dung lượng không quá 50MB', value => {
                console.log(currentMediaUrl)
                if (currentMediaUrl?.length > 0) return true
                return Math.floor(value?.size / 1000000) <= 50
              }),
    })
    .required()

  const initDefaultValues = (banner: any) => {
    const defaultValues: any = {}
    defaultValues.title = banner.title
    defaultValues.titlePosition = banner.titlePosition
    defaultValues.buttonContent = banner.buttonContent
    defaultValues.buttonPosition = banner.buttonPosition
    defaultValues.url = banner.url
    setColorButton(banner.buttonColor || '#FFFFFF')
    setColorDisplay(banner.titleColor || '#FFFFFF')
    setColorText(banner.buttonTextColor || '#FFFFFF')
    setColorDescription(banner.descriptionColor || '#FFFFFF')
    defaultValues.type = banner.type
    setTypeResponse(banner.type)
    if (banner.type === 1) {
      setPreviewImage(banner.mediaUrl)
    } else {
      setPreviewVideo(banner.mediaUrl)
    }
    defaultValues.descriptionPosition = banner.descriptionPosition
    setType(banner.type)
    setMediaUrlResponse(banner.mediaUrl)
    defaultValues.description = banner.description
    setPosition(banner.position)
    setCurrentMediaUrl(banner.mediaUrl)
    methods.reset({ ...defaultValues })
  }

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      titlePosition: 0,
      buttonContent: '',
      buttonPosition: 0,
      descriptionPosition: 0,
      description: '',
      url: '',
      file: null,
      type: 1,
    },
  })

  const onSubmitHandler = async (data: any) => {
    if (type !== typeResponse) {
      if (type === 1 && previewImage?.length === 0) {
        toastWarning({ message: 'Vui lòng thêm ảnh' })
        return
      }
      if (type === 2 && previewVideo?.length === 0) {
        toastWarning({ message: 'Vui lòng thêm video' })
        return
      }
    }
    setIsLoading(true)
    let imgUrl: any = MediaUrlResponse
    if (file && type === 1) imgUrl = await handleUploadImage(file)
    if (file && type === 2) imgUrl = await handleUploadVideo(file)

    const payload: any = {
      id: params.id,
      title: data.title ? data.title : null,
      description: data.description,
      titlePosition: data.titlePosition,
      titleColor: colorDisplay,
      descriptionColor: colorDescription,
      descriptionPosition: data.descriptionPosition,
      buttonContent: data.buttonContent,
      buttonPosition: data.buttonPosition,
      buttonColor: colorButton,
      buttonTextColor: colorText,
      type: type,
      url: data.url,
      mediaUrl: imgUrl,
    }
    await updateBannerDetail(params.id, payload).then(() => {
      toastSuccess({
        message: 'Cập nhật thành công',
      })
      setIsLoading(false)
      navigate(-1)
    })
  }

  const fetchBanner = async () => {
    const res = await getBannerDetail(params.id)
    initDefaultValues(res)
  }

  useEffect(() => {
    fetchBanner()
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
            { name: 'Quản lý banner', path: '/banner' },
            { name: 'Chi tiết banner' },
          ]}
        />
      </Box>
      <SimpleCard>
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <FormProvider {...methods}>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <Stack gap={3}>
                  <FormInputText
                    type="text"
                    name="title"
                    defaultValue=""
                    label={'Tiêu đề'}
                    placeholder="Nhập tiêu đề"
                    fullWidth
                  />
                  {position !== 2 && (
                    <Stack direction={'row'} gap={2}>
                      <SelectDropDown
                        name="titlePosition"
                        label="Vị trí tiêu đề"
                        sx={{ width: '75%' }}
                      >
                        <MenuItem value={0}>Không hiển thị</MenuItem>
                        <MenuItem value={1}>Trái</MenuItem>
                        <MenuItem value={2}>Giữa</MenuItem>
                        <MenuItem value={3}>Phải</MenuItem>
                      </SelectDropDown>
                      <Stack
                        flexDirection={'row'}
                        gap={1}
                        alignItems={'center'}
                      >
                        <div style={{ position: 'relative' }}>
                          <Tooltip title="Chọn màu" placement="top">
                            <div
                              onClick={() => setShowColorPicker1(true)}
                              id="colorDisplay"
                              style={{
                                cursor: 'pointer',
                                backgroundColor: colorDisplay,
                                width: '50px',
                                height: '35px',
                                border: '1px solid #aeaaaa',
                              }}
                            ></div>
                          </Tooltip>
                          <div
                            style={{
                              zIndex: 1000,
                              position: 'absolute',
                              top: '40px',
                              left: '0',
                              display: showColorPicker1 ? 'block' : 'none',
                            }}
                          >
                            <div
                              style={{
                                background: 'white',
                                padding: '10px',
                                border: '1px solid gray',
                              }}
                            >
                              <p style={{ textAlign: 'end' }}>
                                <IconButton
                                  onClick={() => {
                                    setShowColorPicker1(false)
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </p>

                              <SketchPicker
                                color={colorDisplay}
                                onChangeComplete={(color: any, event: any) => {
                                  setColorDisplay(color?.hex)
                                  setShowColorPicker1(false)
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <FormInputText
                          onFocus={() => {
                            setShowColorPicker1(true)
                          }}
                          value={colorDisplay}
                          onChange={e => {
                            setColorDisplay(e.target.value)
                          }}
                          clearIcon={false}
                          type="text"
                          name="titleColor"
                          label={'Màu hiển thị'}
                          defaultValue=""
                          placeholder=""
                          fullWidth
                        />
                      </Stack>
                    </Stack>
                  )}
                  {position !== 2 && (
                    <FormInputText
                      type="text"
                      name="description"
                      label={'Mô tả'}
                      defaultValue=""
                      placeholder="Nhập mô tả"
                      fullWidth
                      rows={3}
                      multiline
                    />
                  )}
                  {position !== 2 && (
                    <Stack direction={'row'} gap={2}>
                      <SelectDropDown
                        name="descriptionPosition"
                        label="Vị trí mô tả"
                        sx={{ width: '75%' }}
                      >
                        <MenuItem value={0}>Không hiển thị</MenuItem>
                        <MenuItem value={1}>Trái</MenuItem>
                        <MenuItem value={2}>Giữa</MenuItem>
                        <MenuItem value={3}>Phải</MenuItem>
                      </SelectDropDown>
                      <Stack
                        flexDirection={'row'}
                        gap={1}
                        alignItems={'center'}
                      >
                        <div style={{ position: 'relative' }}>
                          <Tooltip title="Chọn màu" placement="top">
                            <div
                              onClick={() => setShowColorPicker4(true)}
                              id="descriptionColor"
                              style={{
                                cursor: 'pointer',
                                backgroundColor: colorDescription,
                                width: '50px',
                                height: '35px',
                                border: '1px solid #aeaaaa',
                              }}
                            ></div>
                          </Tooltip>
                          <div
                            style={{
                              zIndex: 1000,
                              position: 'absolute',
                              top: '40px',
                              left: '0',
                              display: showColorPicker4 ? 'block' : 'none',
                            }}
                          >
                            <div
                              style={{
                                background: 'white',
                                padding: '10px',
                                border: '1px solid gray',
                              }}
                            >
                              <p style={{ textAlign: 'end' }}>
                                <IconButton
                                  onClick={() => {
                                    setShowColorPicker4(false)
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </p>

                              <SketchPicker
                                color={colorDescription}
                                onChangeComplete={(color: any, event: any) => {
                                  setColorDescription(color?.hex)
                                  setShowColorPicker4(false)
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <FormInputText
                          onFocus={() => {
                            setShowColorPicker4(true)
                          }}
                          value={colorDescription}
                          onChange={e => {
                            setColorDescription(e.target.value)
                          }}
                          clearIcon={false}
                          type="text"
                          name="titleColor"
                          label={'Màu hiển thị'}
                          defaultValue=""
                          placeholder=""
                          fullWidth
                        />
                      </Stack>
                    </Stack>
                  )}
                  {position !== 2 && (
                    <>
                      <FormInputText
                        type="text"
                        name="buttonContent"
                        label={'Nội dung nút điều hướng'}
                        defaultValue=""
                        placeholder="Nhập nội dung muốn hiển thị"
                        fullWidth
                      />
                      <Stack flexDirection={'row'} gap={2}>
                        <SelectDropDown
                          name="buttonPosition"
                          label="Vị trí nút điều hướng"
                          sx={{ width: '75%' }}
                        >
                          <MenuItem value={0}>Không hiển thị</MenuItem>
                          <MenuItem value={1}>Trái</MenuItem>
                          <MenuItem value={2}>Giữa</MenuItem>
                          <MenuItem value={3}>Phải</MenuItem>
                        </SelectDropDown>
                        <Stack
                          flexDirection={'row'}
                          gap={1}
                          alignItems={'center'}
                        >
                          <div style={{ position: 'relative' }}>
                            <Tooltip title="Chọn màu" placement="top">
                              <div
                                onClick={() => setShowColorPicker2(true)}
                                id="colorDisplay"
                                style={{
                                  cursor: 'pointer',
                                  backgroundColor: colorButton,
                                  width: '50px',
                                  height: '35px',
                                  border: '1px solid #aeaaaa',
                                }}
                              ></div>
                            </Tooltip>
                            <div
                              style={{
                                zIndex: 1000,
                                position: 'absolute',
                                top: '40px',
                                left: '0',
                                display: showColorPicker2 ? 'block' : 'none',
                              }}
                            >
                              <div
                                style={{
                                  background: 'white',
                                  padding: '10px',
                                  border: '1px solid gray',
                                }}
                              >
                                <p style={{ textAlign: 'end' }}>
                                  <IconButton
                                    onClick={() => {
                                      setShowColorPicker2(false)
                                    }}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </p>

                                <SketchPicker
                                  color={colorButton}
                                  onChangeComplete={(
                                    color: any,
                                    event: any,
                                  ) => {
                                    setColorButton(color?.hex)
                                    setShowColorPicker2(false)
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <FormInputText
                            onFocus={() => {
                              setShowColorPicker2(true)
                            }}
                            value={colorButton}
                            onChange={e => {
                              setColorButton(e.target.value)
                            }}
                            clearIcon={false}
                            type="text"
                            name="titleColor"
                            label={'Màu nút'}
                            defaultValue=""
                            placeholder=""
                            fullWidth
                          />
                        </Stack>
                        <Stack
                          flexDirection={'row'}
                          gap={1}
                          alignItems={'center'}
                        >
                          <div style={{ position: 'relative' }}>
                            <Tooltip title="Chọn màu" placement="top">
                              <div
                                onClick={() => setShowColorPicker3(true)}
                                id="colorDisplay"
                                style={{
                                  cursor: 'pointer',
                                  backgroundColor: colorText,
                                  width: '50px',
                                  height: '35px',
                                  border: '1px solid #aeaaaa',
                                }}
                              ></div>
                            </Tooltip>
                            <div
                              style={{
                                zIndex: 1000,
                                position: 'absolute',
                                top: '40px',
                                left: '0',
                                display: showColorPicker3 ? 'block' : 'none',
                              }}
                            >
                              <div
                                style={{
                                  background: 'white',
                                  padding: '10px',
                                  border: '1px solid gray',
                                }}
                              >
                                <p style={{ textAlign: 'end' }}>
                                  <IconButton
                                    onClick={() => {
                                      setShowColorPicker3(false)
                                    }}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </p>

                                <SketchPicker
                                  color={colorText}
                                  onChangeComplete={(
                                    color: any,
                                    event: any,
                                  ) => {
                                    setColorText(color?.hex)
                                    setShowColorPicker3(false)
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <FormInputText
                            onFocus={() => {
                              setShowColorPicker3(true)
                            }}
                            value={colorText}
                            onChange={e => {
                              setColorText(e.target.value)
                            }}
                            clearIcon={false}
                            type="text"
                            name="titleColor"
                            label={'Màu chữ'}
                            defaultValue=""
                            placeholder=""
                            fullWidth
                          />
                        </Stack>
                      </Stack>
                    </>
                  )}

                  <FormInputText
                    type="text"
                    name="url"
                    label={'Link tới'}
                    defaultValue=""
                    placeholder="http://"
                    fullWidth
                  />
                  <Stack flexDirection={'row'} gap={2}>
                    <MuiButton
                      title="Lưu"
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{ width: '100px' }}
                    />
                    <MuiButton
                      title="Quay lại"
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(-1)}
                      startIcon={<Icon>keyboard_return</Icon>}
                    />
                  </Stack>
                </Stack>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Stack gap={3}>
                  {position !== 2 && (
                    <SelectDropDown
                      name="type"
                      label="Loại"
                      value={type}
                      onChange={(e: any) => setType(e.target.value)}
                      sx={{ width: '80%' }}
                    >
                      <MenuItem value={1}>Ảnh</MenuItem>
                      <MenuItem value={2}>Video</MenuItem>
                    </SelectDropDown>
                  )}

                  <input
                    ref={inputRef}
                    type="file"
                    id="uploadImage"
                    style={{ display: 'none' }}
                    onChange={(e: any) => {
                      if (e.target.files[0].size > 52428800) {
                        toastWarning({
                          message: 'Quá dung lượng cho phép',
                        })
                        return
                      }
                      methods.setValue('file', e.target.files[0])
                      setFile(e.target.files[0])
                      setCurrentMediaUrl('')
                      if (type === 1) {
                        setPreviewImage(
                          window.URL.createObjectURL(e.target.files[0]),
                        )
                      } else {
                        setPreviewVideo(
                          window.URL.createObjectURL(e.target.files[0]),
                        )
                      }
                    }}
                  />
                  {type !== 2 && (
                    <div
                      onClick={() => {
                        const inputUploadImage = document.getElementById(
                          'uploadImage',
                        ) as HTMLInputElement | null
                        inputUploadImage?.click()
                      }}
                      style={{
                        width: '80%',
                        height: '90%',
                        border: '2px dashed #aeaaaa',
                        textAlign: 'center',
                      }}
                    >
                      {previewImage?.length === 0 && (
                        <div
                          style={{ marginTop: '50px', marginBottom: '50px' }}
                        >
                          <div>Chọn ảnh để tải lên</div>
                          <div>Hoặc kéo và thả tập tin</div>
                          <BackupIcon fontSize="large" />
                          <div>PNG/JPEG hoặc JPG</div>
                          <div>Dung lượng không quá 50mb</div>
                          <div>(Tỷ lệ ảnh phù hợp: 16: 9)</div>
                        </div>
                      )}
                      {previewImage?.length !== 0 && (
                        <>
                          <img
                            src={previewImage}
                            width="30%"
                            height="40%"
                            style={{ objectFit: 'contain' }}
                          ></img>
                        </>
                      )}
                    </div>
                  )}
                  {type === 2 && (
                    <div
                      onClick={() => {
                        const inputUploadImage = document.getElementById(
                          'uploadImage',
                        ) as HTMLInputElement | null
                        inputUploadImage?.click()
                      }}
                      style={{
                        width: '80%',
                        height: '90%',
                        border: '2px dashed #aeaaaa',
                        textAlign: 'center',
                      }}
                    >
                      {previewVideo?.length === 0 && (
                        <div
                          style={{ marginTop: '50px', marginBottom: '50px' }}
                        >
                          <div>Chọn video để tải lên</div>
                          <div>Hoặc kéo và thả tập tin</div>
                          <BackupIcon fontSize="large" />
                          <div>MP4</div>
                          <div>Dung lượng không quá 50mb</div>
                          <div>
                            (Lưu ý: video nặng sẽ khiến trải nghiệm người dùng
                            không được mượt mà)
                          </div>
                        </div>
                      )}
                      {previewVideo?.length !== 0 && (
                        <>
                          {file && (
                            <div style={{ textAlign: 'right' }}>
                              <IconButton
                                aria-label="delete"
                                size="large"
                                style={{ position: 'relative' }}
                                onClick={event => {
                                  setFile(null)
                                  setPreviewVideo('')
                                  event.stopPropagation()
                                }}
                              >
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                            </div>
                          )}

                          <video
                            src={previewVideo}
                            width="80%"
                            height="60%"
                            controls
                          ></video>
                        </>
                      )}
                    </div>
                  )}
                </Stack>
                {!!methods.formState.errors?.file?.message && (
                  <FormHelperText style={{ color: 'red' }}>
                    {methods.formState.errors?.file?.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormProvider>
        </form>
      </SimpleCard>
    </Container>
  )
}
