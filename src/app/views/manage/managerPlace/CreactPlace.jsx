import {
  Box,
  Button,
  Grid,
  Autocomplete,
  styled,
  TextField,
} from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'
import UploadImage from 'app/components/common/uploadImage'
import Typography from '@mui/material/Typography'
import { createPlace } from 'app/apis/place/place.service'
import { useParams } from 'react-router-dom'
import {
  getDistricts,
  getProvinces,
  getWards,
} from 'app/apis/common/common.service'

import { useForm, Controller } from 'react-hook-form'
import { object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

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

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
  ]

  const schema = yup
    .object({
      namePlace: yup.string().required('Vui lòng nhập tên địa danh').trim(),
      province: yup.object().required(),
      district: yup.object().required(),
      description: yup.string().required('Vui lòng nhập mô tả').trim(),
    })
    .required()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
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
    },
  })

  const addHashTag = e => {
    if (e.keyCode === 13 && !!e.target.value.trim()) {
      setValue('hashtag', [...getValues('hashtag'), { value: e.target.value }])
      e.preventDefault()
    }
  }

  const fetchGetProvinces = async () => {
    const res = await getProvinces()
    setProvinces(res)
    return
  }

  const onSubmit = async data => {
    const paramDetail = {
      name: data.namePlace.trim(),
      description: data.description.trim(),
      idProvince: data?.province.id || null,
      idWard: data?.ward?.id || null,
      idDistrict: data?.district.id || null,
      longitude: 0,
      latitude: 0,
      address: data.address.trim(),
      tags: data.hashtag,
      imgUrl: '',
      status: 1,
    }

    const res = await createPlace(paramDetail)
    if (res) {
      fetchGetProvinces()
    }
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
                    error={errors.namePlace}
                    helperText={errors.namePlace?.message}
                    {...field}
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
                        error={errors.province}
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
                        error={errors.district}
                        helperText={
                          errors.district ? 'Vui lòng chọn quận/huyện' : ''
                        }
                        {...params}
                        label="Quận huyện*"
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
                    error={errors.address}
                    helperText={errors.address?.message}
                    label="Địa danh"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              Vị trí trên bản đồ
            </Grid>
            <Grid item xs={12} md={12}>
              <Autocomplete
                multiple
                options={top100Films}
                getOptionLabel={option => option.label}
                defaultValue={[top100Films[1]]}
                filterSelectedOptions
                sx={{ width: 400, marginRight: 5 }}
                renderInput={params => (
                  <TextField
                    {...params}
                    // error={errors.namePlace}
                    // helperText={errors.namePlace?.message}
                    variant="outlined"
                    label="Loại hình"
                    placeholder="Loại hình"
                    fullWidth
                    margin="normal"
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
                    options={[...hashtag]}
                    getOptionLabel={option => option.value}
                    filterSelectedOptions
                    sx={{ width: 400, marginRight: 5 }}
                    onChange={(_, data) => field.onChange(data)}
                    renderInput={params => (
                      <TextField
                        error={errors.hashtag}
                        helperText={errors.hashtag?.message}
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
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TextField
                    error={errors.description}
                    helperText={errors.description?.message}
                    {...field}
                    label="Mô tả*"
                    margin="normal"
                    multiline
                    rows={10}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>

          <Typography>Ảnh:</Typography>
          <UploadImage></UploadImage>
          <Button color="primary" type="submit" variant="contained">
            Lưu
          </Button>
        </form>
      </SimpleCard>
    </Container>
  )
}
