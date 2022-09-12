import { Grid, TextField, Autocomplete, Button } from '@mui/material'
import UploadImage from 'app/components/common/uploadImage'
import * as React from 'react'
import Typography from '@mui/material/Typography'
import { getDetailPlace, updateDetailPlace } from 'app/apis/place/place.service'
import { useParams } from 'react-router-dom'
import {
  getDistricts,
  getProvinces,
  getWards,
} from 'app/apis/common/common.service'

import { useForm, Controller } from 'react-hook-form'
import { object, string } from 'yup'

export default function InformationPlace(props) {
  const [hashtag, setHashtag] = React.useState([])
  const [namePlace, setNamePlace] = React.useState('')
  const [provinceId, setProvinceId] = React.useState(null)
  const [districtId, setDistrictId] = React.useState('')
  const [wardId, setWardId] = React.useState()
  const [place, setPlace] = React.useState()
  const [description, setDescription] = React.useState('')
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

  const params = useParams()
  const schema = object().shape({
    namePlace: string().required('Username is required'),
  })

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    validationSchema: schema,
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
    if (e.keyCode === 13) {
      setValue('hashtag', [...getValues('hashtag'), { value: e.target.value }])
    }
  }

  const fetchInforPlace = async () => {
    const res = await getProvinces()
    setProvinces(res)

    if (res) {
      getDetailPlace(params.id)
        .then(data => {
          setHashtag(data.tags)
          setValue('hashtag', data.tags)
          setNamePlace(data.name)
          setValue('namePlace', data.name)
          setProvinceId(data.idProvince)
          setValue('address', data.address)
          setValue(
            'province',
            res.find(province => province.id === data.idProvince),
          )
          setDistrictId(data.idDistrict)
          setWardId(data.idWard)
          setDescription(data.description)
          setValue('description', data.description)

          getDistricts(data.idProvince)
            .then(dataDistrict => {
              setDistricts(dataDistrict)
              setValue(
                'district',
                dataDistrict.find(district => district.id == data.idProvince),
              )
            })
            .catch(err => console.log(err))

          if (data.idDistrict) {
            getWards(data.idDistrict)
              .then(dataWard => {
                setWards(dataWard)
                setValue(
                  'ward',
                  dataWard.find(ward => ward.id == data.idDistrict),
                )
              })
              .catch(err => console.log(err))
          }
        })
        .catch(err => console.log(err))
    }
  }

  const onSubmit = async data => {
    const paramDetail = {
      id: params.id,
      name: data.namePlace,
      description: data.description,
      idProvince: data.province.id || null,
      idWard: data.ward.id || null,
      idDistrict: data.district.id || null,
      longitude: 0,
      latitude: 0,
      address: data.address,
      tags: data.hashtag,
      imgUrl: '',
      status: 1,
    }

    const res = await updateDetailPlace(params.id, paramDetail)
    if (res) {
      fetchInforPlace()
    }
  }

  React.useEffect(() => {
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
    getWards(districtId)
      .then(dataWard => {
        setWards(dataWard)
        setValue('ward', null)
      })
      .catch(err => console.log(err))
  }, [districtId])

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
                <TextField {...field} label="Tên địa danh" variant="outlined" />
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
                    <TextField {...params} label="Quận huyện" margin="normal" />
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
                  {...field}
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
                  {...field}
                  label="Mô tả"
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
    </>
  )
}
