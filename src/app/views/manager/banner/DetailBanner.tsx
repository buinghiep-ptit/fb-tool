import BackupIcon from '@mui/icons-material/Backup'
import DeleteIcon from '@mui/icons-material/Delete'
import { Grid, Icon, IconButton, MenuItem, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { getBannerDetail } from 'app/apis/banner/banner.service'
import { Breadcrumb, Container, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { BannerDetail } from 'app/models'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

export interface Props {}

export default function DetailBanner(props: Props) {
  const navigation = useNavigate()
  const params = useParams()
  const navigate = useNavigateParams()
  const [type, setType] = useState<number>(1)
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string>('')
  const [banner, setBanner] = useState<BannerDetail | undefined>()

  const fetchBannerDetail = async () => {
    const res = await getBannerDetail(params.bannerID)
    setBanner(res)
  }
  React.useEffect(() => {
    fetchBannerDetail()
  }, [])
  console.log(banner)

  const methods = useForm()
  const onSubmitHandler = () => {}
  const getTitlePosition = (titlePosition: number) => {
    switch (titlePosition) {
      case 0:
        return 'Không hiển thị'
      case 1:
        return 'Trái'
      case 2:
        return 'Giữa'
      case 3:
        return 'Phải'
    }
  }
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Chi tiết banner' }]} />
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
                    label={'Tiêu đề'}
                    defaultValue=""
                    placeholder="Nhập tiêu đề"
                    value={banner?.title}
                    fullWidth
                  />
                  <Stack direction={'row'} gap={2}>
                    <SelectDropDown
                      name="titlePosition"
                      label="Vị trí tiêu đề"
                      sx={{ width: '75%' }}
                      value={banner?.titlePosition || 0}
                    >
                      <MenuItem value="0">Không hiển thị</MenuItem>
                      <MenuItem value="1">Trái</MenuItem>
                      <MenuItem value="2">Giữa</MenuItem>
                      <MenuItem value="3">Phải</MenuItem>
                    </SelectDropDown>
                    <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
                      <div
                        style={{
                          backgroundColor: 'red',
                          width: '50px',
                          height: '35px',
                          border: '1px solid #aeaaaa',
                        }}
                      ></div>
                      <FormInputText
                        type="text"
                        name="titleColor"
                        label={'Màu hiển thị'}
                        defaultValue=""
                        placeholder=""
                        fullWidth
                        value={banner?.titleColor}
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
                    value={banner?.buttonContent}
                  />

                  <Stack flexDirection={'row'} gap={2}>
                    <SelectDropDown
                      name="butonPosition"
                      label="Vị trí nút điều hướng"
                      sx={{ width: '75%' }}
                      value={banner?.titlePosition || 0}
                    >
                      <MenuItem value="0">Không hiển thị</MenuItem>
                      <MenuItem value="1">Trái</MenuItem>
                      <MenuItem value="2">Giữa</MenuItem>
                      <MenuItem value="3">Phải</MenuItem>
                    </SelectDropDown>
                    <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
                      <div
                        style={{
                          backgroundColor: '#fff',
                          width: '50px',
                          height: '35px',
                          border: '1px solid #aeaaaa',
                        }}
                      ></div>
                      <FormInputText
                        type="text"
                        name="butonColor"
                        label={'Màu nút'}
                        defaultValue="#fff"
                        placeholder=""
                        fullWidth
                        value={banner?.butonColor}
                      />
                    </Stack>
                    <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
                      <div
                        style={{
                          backgroundColor: '#fff',
                          width: '50px',
                          height: '35px',
                          border: '1px solid #aeaaaa',
                        }}
                      ></div>
                      <FormInputText
                        type="text"
                        name="titleColor"
                        label={'Màu chữ'}
                        defaultValue="#fff"
                        placeholder=""
                        fullWidth
                        value={banner?.titleColor}
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
                    value={banner?.url}
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
                    value={banner?.type}
                    onChange={(e: any) => setType(e.target.value)}
                    sx={{ width: '80%' }}
                  >
                    <MenuItem value="1">Ảnh</MenuItem>
                    <MenuItem value="2">Video</MenuItem>
                  </SelectDropDown>

                  <input
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
                      setFile(e.target.files[0])
                      setPreviewImage(
                        window.URL.createObjectURL(e.target.files[0]),
                      )
                    }}
                  />
                  {type != 2 && (
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
                          {file && (
                            <div style={{ textAlign: 'right' }}>
                              <IconButton
                                aria-label="delete"
                                size="large"
                                style={{ position: 'relative' }}
                                onClick={event => {
                                  setFile(null)
                                  console.log(banner)
                                  setPreviewImage(banner?.mediaUrl ?? '')
                                  event.stopPropagation()
                                }}
                              >
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                            </div>
                          )}

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
                  {type == 2 && (
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
                                  console.log(banner)
                                  // setPreviewImage(banner.imageUrl)
                                  event.stopPropagation()
                                }}
                              >
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                            </div>
                          )}

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
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </form>
      </SimpleCard>
    </Container>
  )
}
