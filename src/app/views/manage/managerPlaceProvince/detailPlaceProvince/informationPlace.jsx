import {
  Grid,
  TextField,
  Autocomplete,
  Button,
  Stack,
  Icon,
  FormHelperText,
} from '@mui/material'
import UploadImage from 'app/components/common/uploadImage'
import * as React from 'react'
import Typography from '@mui/material/Typography'
import {
  deletePlace,
  getDetailPlace,
  updateDetailPlace,
} from 'app/apis/place/place.service'
import { useNavigate, useParams } from 'react-router-dom'
import WYSIWYGEditor from 'app/components/common/WYSIWYGEditor'
import { messages } from 'app/utils/messages'
import {
  getDistricts,
  getProvinces,
  getWards,
} from 'app/apis/common/common.service'
import axios from 'axios'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useForm, Controller } from 'react-hook-form'
import MapCustom from 'app/components/common/MapCustom/MapCustom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import DialogCustom from 'app/components/common/DialogCustom'
import { formatFile } from 'app/utils/constant'
export default function InformationPlace(props) {
  const [hashtag, setHashtag] = React.useState([])
  const [provinceId, setProvinceId] = React.useState(null)
  const [districtId, setDistrictId] = React.useState('')
  const [medias, setMedias] = React.useState()
  const [provinces, setProvinces] = React.useState([])
  const [districts, setDistricts] = React.useState([])
  const [wards, setWards] = React.useState([])

  const params = useParams()
  const mapRef = React.useRef()
  const uploadImageRef = React.useRef()
  const [createDegrees, setCreateDegrees] = React.useState()
  const dialogCustomRef = React.useRef(null)
  const navigate = useNavigate()
  const typeCamp = [
    { label: 'Cắm trại', id: 1 },
    { label: 'Chạy bộ', id: 2 },
    { label: 'Teambuiding', id: 3 },
    { label: 'Lưu trú', id: 4 },
    { label: 'Trekking', id: 5 },
    { label: 'Leo núi', id: 6 },
  ]

  const schema = yup
    .object({
      namePlace: yup.string().required('Vui lòng nhập tên địa danh').trim(),
      province: yup.object().required(),
      description: yup.string().required(messages.MSG1),
      hashtag: yup.array().max(50, 'Tối đa 50 hashtag'),
      file: yup
        .mixed()
        .test('required', 'Vui lòng thêm ảnh/video', value => {
          if (medias.length > 0) return true
          return value.length > 0
        })
        .test('fileSize', 'Dung lượng file quá lớn', value => {
          console.log(value)
          if (medias.length > 0 && value.length === 0) return true
          if (value.length > 0) {
            for (let i = 0; i < value.length; i++) {
              if (value[i].size > 10000000) return false
            }
            return true
          }
        })
        .test(
          'fileFormat',
          'Định dạng ảnh/video/audio không phù hợp. Định dạng cho phép: Hình ảnh: “.png”, “.jpeg”, “.jpg”, Video: “.mp4”, “.webm',
          value => {
            if (medias.length > 0 && value.length === 0) return true

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
      campAreaTypes: [],
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

  const fetchInforPlace = async () => {
    const res = await getProvinces()
    setProvinces(res)

    if (res) {
      getDetailPlace(params.id)
        .then(data => {
          setHashtag(data.tags)
          setValue(
            'campAreaTypes',
            data.campAreaTypes.map((type, index) => {
              return typeCamp[type - 1]
            }),
          )
          setCreateDegrees({
            lat: data.latitude,
            lng: data.longitude,
          })
          setMedias(data.medias)
          setValue('hashtag', data.tags)
          setValue('namePlace', data.name)
          setProvinceId(data.idProvince)
          setValue('address', data.address)
          setValue(
            'province',
            res.find(province => province.id === data.idProvince),
          )
          setDistrictId(data.idDistrict)
          setValue('description', data.description)
          getDistricts(data.idProvince)
            .then(dataDistrict => {
              setDistricts(dataDistrict)
              setValue(
                'district',
                dataDistrict.find(district => district.id == data.idDistrict),
              )
            })
            .catch(err => console.log(err))

          if (data.idDistrict) {
            getWards(data.idDistrict)
              .then(dataWard => {
                setWards(dataWard)
                setValue(
                  'ward',
                  dataWard.find(ward => ward.id == data.idWard),
                )
              })
              .catch(err => console.log(err))
          }
        })
        .catch(err => console.log(err))
    }
  }

  const handleDataImageUpload = async () => {
    const introData = uploadImageRef.current.getFiles()

    const fileUploadImage = [...introData].map(file => {
      if (file.type.startsWith('image/')) {
        const formData = new FormData()
        formData.append('file', file)
        try {
          const token = window.localStorage.getItem('accessToken')
          const res = axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_UPLOAD_URL}/api/image/upload`,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          })
          return res
        } catch (e) {
          console.log(e)
        }
      }
    })

    const fileUploadVideo = [...introData].map(file => {
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
            },
          })
          return res
        } catch (e) {
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

  const handleDeletePlace = async () => {
    const res = await deletePlace(params.id)
    if (res) {
      toastSuccess({ message: 'Xóa điểm dia danh thành công' })
      navigate('/quan-ly-thong-tin-dia-danh')
    }
  }

  const onSubmit = async data => {
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
      medias: [...medias, ...mediasUpdateImage, ...mediasUpdateVideo].filter(
        item => !!item,
      ),
      id: params.id,
      name: data.namePlace,
      description: data.description,
      idProvince: data?.province.id || null,
      idWard: data?.ward?.id || null,
      idDistrict: data?.district?.id || null,
      longitude: createDegrees.lng,
      latitude: createDegrees.lat,
      address: data.address === '' ? null : data.address,
      tags: data.hashtag,
      imgUrl: '',
      status: 1,
      campAreaTypes: data.campAreaTypes.map(type => type.id),
    }

    const res = await updateDetailPlace(params.id, paramDetail)
    if (res) {
      toastSuccess({ message: 'Lưu thành công' })
      fetchInforPlace()
      navigate(-1)
    }
  }

  React.useEffect(() => {
    fetchInforPlace()
  }, [])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Controller
              name="namePlace"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled
                  label="Tên địa danh"
                  variant="outlined"
                  error={errors.namePlace}
                  helperText={errors.namePlace?.message}
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
                  disabled
                  {...field}
                  options={provinces}
                  getOptionLabel={option => option.name}
                  sx={{ width: 200, marginRight: 5 }}
                  onChange={(_, data) => {
                    field.onChange(data)
                    setProvinceId(getValues('province').id)
                    getDistricts(provinceId)
                      .then(dataDistrict => {
                        setDistricts(dataDistrict)
                        setValue('district', null)
                        setValue('ward', null)
                        setWards([])
                      })
                      .catch(err => console.log(err))
                  }}
                  renderInput={params => (
                    <TextField
                      error={errors.province}
                      helperText={
                        errors.province ? 'Vui lòng chọn tỉnh/thành' : ''
                      }
                      {...params}
                      label="Tỉnh/thành phố"
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
                  disabled
                  disablePortal
                  id="combo-box-demo"
                  onChange={(_, data) => {
                    field.onChange(data)
                    setDistrictId(getValues('district').id)
                    getWards(districtId)
                      .then(dataWard => {
                        setWards(dataWard)
                        setValue('ward', null)
                      })
                      .catch(err => console.log(err))
                  }}
                  options={districts}
                  getOptionLabel={option => option.name}
                  sx={{ width: 200, marginRight: 5 }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Quận huyện"
                      margin="normal"
                      error={errors.district}
                      helperText={
                        errors.district ? 'Vui lòng chọn quận/huyện' : ''
                      }
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
                  disabled
                  id="combo-box-demo"
                  options={wards}
                  onChange={(_, data) => field.onChange(data)}
                  getOptionLabel={option => option.name}
                  sx={{ width: 200, marginRight: 5 }}
                  renderInput={params => (
                    <TextField {...params} label="Xã phường" margin="normal" />
                  )}
                />
              )}
            />
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <TextField
                  disabled
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  {...field}
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
                // onClick={() => {
                //   dialogCustomRef.current.handleClickOpen()
                // }}
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
              {createDegrees && (
                <>
                  <Typography>Kinh độ: {createDegrees.lat || ''}</Typography>
                  <Typography>Vĩ độ: {createDegrees.lng || ''}</Typography>
                </>
              )}
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
                  options={[...typeCamp]}
                  getOptionLabel={option => option.label}
                  filterSelectedOptions
                  onChange={(_, data) => field.onChange(data)}
                  sx={{ width: 400, marginRight: 5 }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Loại hình"
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
                  sx={{
                    width: 500,
                    marginRight: 5,
                  }}
                  options={[...hashtag]}
                  getOptionLabel={option => option.value}
                  filterSelectedOptions
                  onChange={(_, data) => field.onChange(data)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={!!errors.hashtag}
                      helperText={
                        !!errors.hashtag ? errors.hashtag.message : ''
                      }
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
              render={({ field }) => <WYSIWYGEditor {...field} />}
              name="description"
              control={control}
              defaultValue=""
            />
            {errors.description && (
              <FormHelperText error>
                {errors.description?.message}
              </FormHelperText>
            )}
          </Grid>
        </Grid>

        <Typography>Ảnh*:</Typography>
        <UploadImage
          ref={uploadImageRef}
          medias={medias}
          setMedias={setMedias}
          setValue={setValue}
        ></UploadImage>
        {errors?.file && (
          <FormHelperText error={true}>{errors.file?.message}</FormHelperText>
        )}
        <Button color="primary" type="submit" variant="contained">
          Lưu
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => handleDeletePlace()}
          style={{ marginLeft: '10px' }}
        >
          Xóa
        </Button>
        <Button
          color="primary"
          variant="contained"
          style={{ marginLeft: '10px' }}
          onClick={() => {
            navigate(-1)
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
              setValue('latitude', value.lat)
              setValue('longitude', value.lng)
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
    </>
  )
}
