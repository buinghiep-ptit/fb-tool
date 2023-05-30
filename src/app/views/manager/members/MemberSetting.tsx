import { yupResolver } from '@hookform/resolvers/yup'
import BackupIcon from '@mui/icons-material/Backup'
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import {
  getMembershipSettings,
  updateMembershipSettings,
} from 'app/apis/members/members.service'
import { Breadcrumb, Container, SimpleCard } from 'app/components'
import MuiRHFNumericFormatInput from 'app/components/common/MuiRHFWithNumericFormat'
import { MuiTypography } from 'app/components/common/MuiTypography'
import RHFWYSIWYGEditor from 'app/components/common/RHFWYSIWYGEditor'
import handleUploadImage from 'app/helpers/handleUploadImage'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import './style.css'

export interface Props {}

export default function MemberSetting(props: Props) {
  const navigate = useNavigate()

  const [configs, setConfigs] = useState<any>()
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const schema = yup
    .object({
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
          if (value?.size) return Math.floor(value?.size / 1000000) <= 50
          else return true
        }),
      content: yup.string().required('Giá trị bắt buộc').trim(),
      contentPayment: yup.string().required('Giá trị bắt buộc').trim(),
      price: yup
        .number()
        .min(0, 'Số dương')
        .integer('Số nguyên')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .required('Giá trị bắt buộc'),
      discountPrice: yup
        .number()
        .min(0, 'Số dương')
        .integer('Số nguyên')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr)),
      extendPrice: yup
        .number()
        .min(0, 'Số dương')
        .integer('Số nguyên')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .required('Giá trị bắt buộc'),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      file: null,
      content: '',
      contentPayment: '',
      price: '',
      discountPrice: '',
      extendPrice: '',
    },
  })

  const initDefaultValues = (configs: any) => {
    const defaultValues: any = {}
    defaultValues.file = configs.imgUrl
    setPreviewImage(configs.imgUrl)
    defaultValues.content = configs.content
    defaultValues.contentPayment = configs.contentPayment
    defaultValues.price = configs.price
    defaultValues.discountPrice = configs.discountPrice
    defaultValues.extendPrice = configs.extendPrice
    methods.reset({ ...defaultValues })
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    let url: any = ''
    if (file) {
      url = await handleUploadImage(file)
    } else {
      url = previewImage
    }

    const payload: any = {
      imgUrl: url,
      content: data.content,
      contentPayment: data.contentPayment,
      price: data.price,
      discountPrice: data.discountPrice,
      extendPrice: data.extendPrice,
    }

    await updateMembershipSettings(payload)
      .then(() => {
        toastSuccess({
          message: 'Cập nhật thành công',
        })
        fetchConfigs()
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  const fetchConfigs = async () => {
    await getMembershipSettings()
      .then(res => {
        setConfigs(res)
        initDefaultValues(res)
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchConfigs()
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
            { name: 'Quản lý hội viên', path: '/members' },
            { name: 'Cài đặt giới thiệu hội viên' },
          ]}
        />

        <SimpleCard>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormProvider {...methods}>
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
                    width: 310,
                    height: 210,
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
                            width="300px"
                            height="200px"
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

              <FormControl fullWidth margin="normal">
                <Typography color="grey">Nội dung*:</Typography>
                <RHFWYSIWYGEditor name="content"></RHFWYSIWYGEditor>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <Typography color="grey">Cách thức thanh toán*:</Typography>
                <RHFWYSIWYGEditor name="contentPayment"></RHFWYSIWYGEditor>
              </FormControl>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl fullWidth margin="normal">
                    <MuiRHFNumericFormatInput
                      name="price"
                      label="Mức hội phí*:"
                      fullWidth
                      iconEnd={
                        <MuiTypography variant="subtitle2">VNĐ</MuiTypography>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth margin="normal">
                    <MuiRHFNumericFormatInput
                      name="discountPrice"
                      label="Giá ưu đãi:"
                      fullWidth
                      iconEnd={
                        <MuiTypography variant="subtitle2">VNĐ</MuiTypography>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth margin="normal">
                    <MuiRHFNumericFormatInput
                      name="extendPrice"
                      label="Giá duy trì*:"
                      fullWidth
                      iconEnd={
                        <MuiTypography variant="subtitle2">VNĐ</MuiTypography>
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  m: 1,
                }}
              >
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
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{ mx: 1 }}
                >
                  Cập nhật
                </Button>
              </Box>
            </FormProvider>
          </form>
        </SimpleCard>
      </Box>
    </Container>
  )
}
