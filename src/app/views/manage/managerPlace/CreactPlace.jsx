import {
  Box,
  Button,
  Grid,
  Autocomplete,
  styled,
  TextField,
  Stack,
  Icon,
  FormHelperText,
  LinearProgress,
} from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'
import UploadImage from 'app/components/common/uploadImage'
import Typography from '@mui/material/Typography'
import { checkNamePlaceExist, createPlace } from 'app/apis/place/place.service'
import {
  getDistricts,
  getProvinces,
  getWards,
} from 'app/apis/common/common.service'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useNavigate } from 'react-router-dom'
import MapCustom from 'app/components/common/MapCustom/MapCustom'
import DialogCustom from 'app/components/common/DialogCustom'
import WYSIWYGEditor from 'app/components/common/WYSIWYGEditor'
import { messages } from 'app/utils/messages'
import { formatFile } from 'app/utils/constant'
import { compressImageFile } from 'app/helpers/extractThumbnailVideo'
const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function CreatePlace(props) {
  const [hashtag, setHashtag] = React.useState([])
  const [provinceId, setProvinceId] = React.useState(null)
  const [districtId, setDistrictId] = React.useState('')
  const [provinces, setProvinces] = React.useState([])
  const [districts, setDistricts] = React.useState([])
  const [wards, setWards] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [createDegrees, setCreateDegrees] = React.useState({
    lat: 21.027161210811197,
    lng: 105.78872657468659,
  })

  const typeCamp = [
    { label: 'Cắm trại', id: 1 },
    { label: 'Chạy bộ', id: 2 },
    { label: 'Teambuilding', id: 3 },
    { label: 'Lưu trú', id: 4 },
    { label: 'Leo núi', id: 5 },
  ]

  const uploadImageRef = React.useRef()
  const mapRef = React.useRef()
  const dialogCustomRef = React.useRef(null)
  const navigate = useNavigate()

  const schema = yup
    .object({
      namePlace: yup
        .string()
        .required(messages.MSG1)
        .trim()
        .max(255, 'Tên địa danh không được vượt quá 255 ký tự'),
      province: yup.object().required(messages.MSG1),
      campAreaTypes: yup.array().min(1, ''),
      hashtag: yup.array().max(50, 'Tối đa 50 hashtag'),
      description: yup.string().required(messages.MSG1),
      file: yup
        .mixed()
        .test('required', 'Vui lòng thêm ảnh/video', value => {
          return value.length > 0
        })
        .test('fileSize', 'Dung lượng file quá lớn', value => {
          if (value.length > 0) {
            for (let i = 0; i < value.length; i++) {
              if (
                value[i].size > 50000000 &&
                !value[i].type.startsWith('video')
              )
                return false
            }
            return true
          }
        })
        .test(
          'fileFormat',
          'Định dạng ảnh/video/audio không phù hợp. Định dạng cho phép: Hình ảnh: “.png”, “.jpeg”, “.jpg”, Video: “.mp4”, “.webm',
          value => {
            if (value.length > 0) {
              for (let i = 0; i < value.length; i++) {
                const arrString = value[i].name.split('.')
                const type = arrString[arrString.length - 1]
                const checkList = formatFile.filter(
                  item => item == type.toLowerCase(),
                )
                if (checkList.length < 1) {
                  return false
                }
              }
              return true
            }
          },
        ),
    })
    .required()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      namePlace: '',
      province: null,
      district: null,
      ward: null,
      address: '',
      description: '',
      hashtag: [],
      file: [],
    },
  })

  const addHashTag = e => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      if (e.target.value && e.target.value.charAt(0) !== '#') {
        setError('hashtag', {
          type: 'required',
          message: 'Hashtag phải bắt đầu bằng #',
        })
        e.preventDefault()
        return
      }
      clearErrors(['hashtag'])
      setValue('hashtag', [...getValues('hashtag'), { value: e.target.value }])
      e.preventDefault()
    }
  }

  const fetchGetProvinces = async () => {
    const res = await getProvinces()
    setProvinces(res)
    return
  }

  const handleDataImageUpload = async () => {
    const introData = uploadImageRef.current.getFiles()

    const fileUploadImage = [...introData].map(async file => {
      if (file.type.startsWith('image/')) {
        const formData = new FormData()
        const newFile = await compressImageFile(file)
        formData.append('file', newFile)
        try {
          const token = window.localStorage.getItem('accessToken')
          const res = axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_UPLOAD_URL}/api/image/upload`,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
              srcType: 1,
            },
          })
          return await res
        } catch (e) {
          setIsLoading(false)
          console.log(e)
        }
      }
    })

    const fileUploadVideo = [...introData].map(async file => {
      if (file.type.startsWith('video/')) {
        const formData = new FormData()
        formData.append('file', file)
        try {
          const token = window.localStorage.getItem('accessToken')
          const res = axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_UPLOAD_URL}/api/video/upload`,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
              srcType: 1,
            },
          })
          return await res
        } catch (e) {
          setIsLoading(false)
          console.log(e)
        }
      }
    })

    const responseImage = await Promise.all(fileUploadImage)
    const responseVideo = await Promise.all(fileUploadVideo)
    const listUrl = new Object()
    if (responseImage && responseVideo) {
      if (responseImage.length > 0)
        listUrl.image = responseImage.map(item => item?.data.url)
      if (responseVideo.length > 0)
        listUrl.video = responseVideo.map(item => item?.data.url)
    }
    return listUrl
  }

  const onSubmit = async data => {
    setIsLoading(true)
    const listUrl = await handleDataImageUpload()
    let mediasUpdateImage = []
    if (listUrl?.image && listUrl?.image.length > 0) {
      mediasUpdateImage = (listUrl?.image || []).map((url, index) => {
        if (url) {
          const media = new Object()
          media.mediaType = 1
          media.srcType = 2
          media.mediaFormat = 2
          media.url = url
          return media
        }
      })
    }
    let mediasUpdateVideo = []
    if (listUrl?.video && listUrl?.video.length > 0) {
      mediasUpdateVideo = (listUrl?.video || []).map((url, index) => {
        if (url) {
          const media = new Object()
          media.mediaType = 1
          media.srcType = 2
          media.mediaFormat = 1
          media.url = url
          return media
        }
      })
    }

    const paramDetail = {
      medias: [...mediasUpdateImage, ...mediasUpdateVideo].filter(
        item => !!item,
      ),
      name: data.namePlace.trim(),
      description: data.description || '',
      idProvince: data?.province?.id || null,
      idWard: data?.ward?.id || null,
      idDistrict: data?.district?.id || null,
      longitude: createDegrees.lng,
      latitude: createDegrees.lat,
      address: data.address || null,
      tags: data.hashtag,
      imgUrl: '',
      status: 1,
      campAreaTypes: data.campAreaTypes.map(type => type.id),
    }
    try {
      const res = await createPlace(paramDetail)
      if (res) {
        toastSuccess({ message: 'Tạo địa danh thành công' })
        fetchGetProvinces()
        navigate('/quan-ly-thong-tin-dia-danh')
      }
    } catch (e) {
      setIsLoading(false)
    }

    setIsLoading(false)
  }

  React.useEffect(() => {
    if (provinceId)
      getDistricts(provinceId)
        .then(dataDistrict => {
          setDistricts(dataDistrict)
          setValue('district', null)
          setValue('ward', null)
          setWards([])
        })
        .catch(err => console.log(err))
  }, [provinceId])

  React.useEffect(() => {
    if (districtId)
      getWards(districtId)
        .then(dataWard => {
          setWards(dataWard)
          setValue('ward', null)
        })
        .catch(err => console.log(err))
  }, [districtId])

  React.useEffect(() => {
    fetchGetProvinces()
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
            { name: 'Quản lý địa danh', path: '/quan-ly-thong-tin-dia-danh' },
            { name: 'Thêm địa danh' },
          ]}
        />
      </Box>
      <SimpleCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Controller
                name="namePlace"
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.namePlace}
                    helperText={errors.namePlace?.message}
                    {...field}
                    onBlur={async e => {
                      const res = await checkNamePlaceExist({
                        name: e.target.value,
                        idCampArea: null,
                      })
                      if (res.exist) {
                        setError('namePlace', {
                          type: 'nameExist',
                          message: 'Tên địa danh đã được dùng',
                        })
                      } else {
                        clearErrors(['namePlace'])
                      }
                    }}
                    label="Tên địa danh*"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12} style={{ display: 'flex' }}>
              <Controller
                name="province"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    {...field}
                    options={provinces}
                    getOptionLabel={option => option.name}
                    sx={{ width: 200, marginRight: 5 }}
                    onChange={(_, data) => {
                      field.onChange(data)
                      setProvinceId(getValues('province').id)
                    }}
                    renderInput={params => (
                      <TextField
                        error={!!errors.province}
                        helperText={
                          errors.province ? 'Vui lòng chọn tỉnh/thành' : ''
                        }
                        {...params}
                        label="Tỉnh/thành phố*"
                        margin="normal"
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    disablePortal
                    id="combo-box-demo"
                    onChange={(_, data) => {
                      field.onChange(data)
                      setDistrictId(getValues('district').id)
                    }}
                    options={districts}
                    getOptionLabel={option => option.name}
                    sx={{ width: 200, marginRight: 5 }}
                    renderInput={params => (
                      <TextField
                        error={!!errors.district}
                        helperText={
                          errors.district ? 'Vui lòng chọn quận/huyện' : ''
                        }
                        {...params}
                        label="Quận huyện"
                        margin="normal"
                      />
                    )}
                  />
                )}
              />
              <Controller
                control={control}
                name="ward"
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    disablePortal
                    id="combo-box-demo"
                    options={wards}
                    onChange={(_, data) => field.onChange(data)}
                    getOptionLabel={option => option.name}
                    sx={{ width: 200, marginRight: 5 }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Xã phường"
                        margin="normal"
                      />
                    )}
                  />
                )}
              />
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    label="Địa chỉ"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Typography mt={2}>Vị trí trên bản đồ*:</Typography>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  variant="text"
                  onClick={() => {
                    dialogCustomRef.current.handleClickOpen()
                  }}
                >
                  Chọn vị trí trên bản đồ <Icon>map</Icon>
                </Button>
              </Stack>
              <Stack
                mt={2}
                mb={4}
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Typography>Kinh độ: {createDegrees.lat}</Typography>
                <Typography>Vĩ độ: {createDegrees.lng}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="campAreaTypes"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    {...field}
                    options={typeCamp}
                    getOptionLabel={option => option.label}
                    filterSelectedOptions
                    onChange={(_, data) => {
                      field.onChange(data)
                    }}
                    sx={{ width: 400, marginRight: 5 }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={!!errors.campAreaTypes}
                        helperText={
                          !!errors.campAreaTypes
                            ? 'Vui lòng chọn loại hình'
                            : ''
                        }
                        defaultValue="Cắm trại"
                        variant="outlined"
                        label="Loại hình*"
                        placeholder="Loại hình"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="hashtag"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    open={false}
                    popupIcon={''}
                    options={[...hashtag]}
                    getOptionLabel={option => option.value}
                    filterSelectedOptions
                    sx={{ width: 400, marginRight: 5 }}
                    onChange={(_, data) => field.onChange(data)}
                    renderInput={params => (
                      <TextField
                        error={!!errors.hashtag}
                        helperText={
                          !!errors.hashtag ? errors.hashtag.message : ''
                        }
                        {...params}
                        variant="outlined"
                        label="Hashtag"
                        placeholder="Hashtag"
                        fullWidth
                        margin="normal"
                        onKeyDown={addHashTag}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              Mô tả*:
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    {...field}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          </Grid>

          <Typography>Ảnh*:</Typography>
          <UploadImage ref={uploadImageRef} setValue={setValue}></UploadImage>
          {errors?.file && (
            <FormHelperText error={true}>
              {errors.file?.message || ''}
            </FormHelperText>
          )}
          <Button
            color="primary"
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            Lưu
          </Button>
          <Button
            color="primary"
            variant="contained"
            style={{ marginLeft: '10px' }}
            onClick={() => {
              navigate('/quan-ly-thong-tin-dia-danh')
            }}
          >
            Quay lại
          </Button>
        </form>
        <DialogCustom
          ref={dialogCustomRef}
          title="Chọn vị trí trên map"
          maxWidth="md"
        >
          <MapCustom ref={mapRef} center={createDegrees}></MapCustom>
          <Stack spacing={2} direction="row" justifyContent="center">
            <Button
              variant="contained"
              onClick={() => {
                const value = mapRef.current.getCreateDegrees()
                setCreateDegrees(value)
                dialogCustomRef.current.handleClose()
              }}
            >
              Xác nhận
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                dialogCustomRef.current.handleClose()
              }}
            >
              Hủy
            </Button>
          </Stack>
        </DialogCustom>
      </SimpleCard>
    </Container>
  )
}
