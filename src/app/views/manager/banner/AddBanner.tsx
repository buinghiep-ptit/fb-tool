import { yupResolver } from '@hookform/resolvers/yup'
import BackupIcon from '@mui/icons-material/Backup'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
} from '@mui/material'
import { Box } from '@mui/system'
import { createBannerI } from 'app/apis/banner/banner.service'
import { Breadcrumb, Container, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import handleUploadImage from 'app/helpers/handleUploadImage'
import handleUploadVideo from 'app/helpers/handleUploadVideo'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { useRef, useState } from 'react'
import { SketchPicker } from 'react-color'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as yup from 'yup'

export interface Props {}
type NewBanner = {
  id?: number
  title?: string
  titlePosition?: number
  titleColor?: string
  buttonContent?: string
  butonPosition?: number
  url?: string
  mediaUrl?: string
}
export default function AddBanner(props: Props) {
  const navigation = useNavigate()
  const navigate = useNavigateParams()
  const [bannerId, setBannerId] = useState<any>()
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [isLoading, setIsLoading] = useState(false)

  const [colorDisplay, setColorDisplay] = useState('#FFFFFF')
  const [colorButton, setColorButton] = useState('#FFFFFF')
  const [colorText, setColorText] = useState('#FFFFFF')
  const [type, setType] = useState<number>(1)
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string>('')
  const [banner, setBanner] = useState<any>()
  const [showColorPicker1, setShowColorPicker1] = useState<any>(false)
  const [showColorPicker2, setShowColorPicker2] = useState<any>(false)
  const [showColorPicker3, setShowColorPicker3] = useState<any>(false)
  const inputRef = useRef<any>(null)

  const schema = yup
    .object({
      title: yup.string().max(255, 'Tối đa 255 ký tự').trim().nullable(),
      titlePosition: yup.number().required('Giá trị bắt buộc'),
      titleColor: yup.string().trim(),
      buttonContent: yup.string().max(255, 'Tối đa 255 ký tự').trim(),
      url: yup.string().trim().nullable(),
      buttonPosition: yup.number().required('Giá trị bắt buộc'),
      file:
        type === 1
          ? yup
              .mixed()
              .required('Giá trị bắt buộc')
              .test('fileType', 'File không hợp lệ', value => {
                if (value && value.name)
                  return ['png', 'jpg', 'jpeg'].includes(
                    value?.name?.split('.').pop(),
                  )
                else return true
              })
              .test('fileSize', 'Dung lượng không quá 50MB', value => {
                return Math.floor(value?.size / 1000000) <= 50
              })
          : yup
              .mixed()
              .required('Giá trị bắt buộc')
              .test('fileType', 'File không hợp lệ', value => {
                if (value && value.name)
                  return ['mp4', 'mov', '3gp'].includes(
                    value?.name?.split('.').pop(),
                  )
                else return true
              })
              .test('fileSize', 'Dung lượng không quá 50MB', value => {
                return Math.floor(value?.size / 1000000) <= 10
              }),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      titlePosition: 0,
      buttonContent: '',
      buttonPosition: 0,
      url: '',
      file: null,
      type: 1,
    },
  })

  const onSubmitHandler = async (data: any) => {
    setIsLoading(true)
    let imgUrl: any = ''
    if (file && type === 1) imgUrl = await handleUploadImage(file)
    if (file && type === 2) imgUrl = await handleUploadVideo(file)

    const payload: any = {
      title: data.title ? data.title : null,
      titlePosition: data.titlePosition,
      titleColor: colorDisplay,
      buttonContent: data.buttonContent,
      buttonPosition: data.buttonPosition,
      buttonColor: colorButton,
      buttonTextColor: colorText,
      type: type,
      url: data.url,
      mediaUrl: imgUrl,
    }
    await createBannerI(payload).then(() => {
      toastSuccess({
        message: 'Thêm thành công',
      })
      setIsLoading(false)
      navigate('/banner', {})
    })
  }

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
            { name: 'Thêm mới banner' },
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
                    <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
                      <div style={{ position: 'relative' }}>
                        <div
                          onMouseEnter={() => setShowColorPicker1(true)}
                          id="colorDisplay"
                          style={{
                            backgroundColor: colorDisplay,
                            width: '50px',
                            height: '35px',
                            border: '1px solid #aeaaaa',
                          }}
                        ></div>
                        <div
                          style={{
                            zIndex: 1000,
                            position: 'absolute',
                            top: '40px',
                            left: '0',
                            display: showColorPicker1 ? 'block' : 'none',
                          }}
                        >
                          <SketchPicker
                            color={colorDisplay}
                            onChangeComplete={(color: any, event: any) => {
                              setColorDisplay(color.hex)
                              setShowColorPicker1(false)
                            }}
                          />
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
                    <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
                      <div style={{ position: 'relative' }}>
                        <div
                          onMouseEnter={() => setShowColorPicker2(true)}
                          id="colorDisplay"
                          style={{
                            backgroundColor: colorButton,
                            width: '50px',
                            height: '35px',
                            border: '1px solid #aeaaaa',
                          }}
                        ></div>
                        <div
                          style={{
                            zIndex: 1000,
                            position: 'absolute',
                            top: '40px',
                            left: '0',
                            display: showColorPicker2 ? 'block' : 'none',
                          }}
                        >
                          <SketchPicker
                            color={colorButton}
                            onChangeComplete={(color: any, event: any) => {
                              setColorButton(color.hex)
                              setShowColorPicker2(false)
                            }}
                          />
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
                    <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
                      <div style={{ position: 'relative' }}>
                        <div
                          onMouseEnter={() => setShowColorPicker3(true)}
                          id="colorDisplay"
                          style={{
                            backgroundColor: colorText,
                            width: '50px',
                            height: '35px',
                            border: '1px solid #aeaaaa',
                          }}
                        ></div>
                        <div
                          style={{
                            zIndex: 1000,
                            position: 'absolute',
                            top: '40px',
                            left: '0',
                            display: showColorPicker3 ? 'block' : 'none',
                          }}
                        >
                          <SketchPicker
                            color={colorText}
                            onChangeComplete={(color: any, event: any) => {
                              setColorText(color.hex)
                              setShowColorPicker3(false)
                            }}
                          />
                        </div>
                      </div>

                      <FormInputText
                        onFocus={() => {
                          setShowColorPicker3(true)
                        }}
                        value={colorDisplay}
                        onChange={e => {
                          setColorDisplay(e.target.value)
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
                      // onClick={() => navigation(`chi-tiet-banner`, {})}
                      sx={{ width: '100px' }}
                    />
                    <MuiButton
                      title="Quay lại"
                      variant="outlined"
                      color="primary"
                      type="submit"
                      onClick={() => navigation(`/banner`, {})}
                      startIcon={<Icon>keyboard_return</Icon>}
                    />
                  </Stack>
                </Stack>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Stack gap={3}>
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

                  <input
                    ref={inputRef}
                    type="file"
                    id="uploadImage"
                    style={{ display: 'none' }}
                    onChange={(e: any) => {
                      if (e.target.files[0].size > 52428800) {
                        toastSuccess({
                          message: 'Quá dung lượng cho phép',
                        })
                        return
                      }
                      methods.setValue('file', e.target.files[0])
                      setFile(e.target.files[0])
                      console.log(window.URL.createObjectURL(e.target.files[0]))
                      setPreviewImage(
                        window.URL.createObjectURL(e.target.files[0]),
                      )
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
                      {!file && previewImage?.length === 0 && (
                        <div
                          style={{ marginTop: '50px', marginBottom: '50px' }}
                        >
                          <div>Chọn ảnh để tải lên</div>
                          <div>Hoặc kéo và thả tập tin</div>
                          <BackupIcon fontSize="large" />
                          <div>PNG/JPEG hoặc JPG</div>
                          <div>Dung lượng không quá 50mb</div>
                          <div>(Tỷ lệ ảnh phù hợp)</div>
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
                      {!file && previewImage?.length === 0 && (
                        <div
                          style={{ marginTop: '50px', marginBottom: '50px' }}
                        >
                          <div>Chọn video để tải lên</div>
                          <div>Hoặc kéo và thả tập tin</div>
                          <BackupIcon fontSize="large" />
                          <div>MP4, MOV, 3GP hoặc WebM</div>
                          <div>Dung lượng không quá 50mb</div>
                          <div>
                            (Lưu ý: video nặng sẽ khiến trải nghiệm người dùng
                            không được mượt mà)
                          </div>
                        </div>
                      )}
                      {previewImage?.length !== 0 && (
                        <>
                          {file && (
                            <div style={{ textAlign: 'right' }}>
                              <IconButton
                                aria-label="delete"
                                size="large"
                                style={{ position: 'relative' }}
                                onClick={event => {
                                  setFile(null)
                                  setPreviewImage('')
                                  event.stopPropagation()
                                }}
                              >
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                            </div>
                          )}

                          <video
                            src={previewImage}
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
