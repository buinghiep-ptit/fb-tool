import * as React from 'react'
import {
  Grid,
  TextField,
  Autocomplete,
  Typography,
  Button,
  Stack,
  Icon,
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { seasons } from '../const'
import DialogCustom from 'app/components/common/DialogCustom'
import MapCustom from 'app/components/common/MapCustom/MapCustom'

export default function GeneralInformation({
  control,
  errors,
  provinces,
  districts,
  wards,
  setDistrictId,
  setProvinceId,
  getValues,
  setValue,
  hashtag,
  campAreas,
}) {
  const addHashTag = e => {
    if (e.keyCode === 13) {
      setValue('hashtag', [...getValues('hashtag'), { value: e.target.value }])
      e.preventDefault()
    }
  }

  const typeCamp = [
    { label: 'Cắm trại', id: 1 },
    { label: 'Chạy bộ', id: 2 },
    { label: 'Teambuiding', id: 3 },
    { label: 'Lưu trú', id: 4 },
    { label: 'Trekking', id: 5 },
    { label: 'Leo núi', id: 6 },
  ]

  const dialogCustomRef = React.useRef(null)
  const mapRef = React.useRef()
  const [createDegrees, setCreateDegrees] = React.useState()

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Controller
            name="nameCampground"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tên điểm camp*"
                variant="outlined"
                error={errors.nameCampground}
                helperText={errors.nameCampground?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Controller
            name="campAreas"
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                disablePortal
                {...field}
                options={campAreas}
                getOptionLabel={option => option.name}
                renderOption={(props, option, index) => {
                  const key = `listItem-${index}-${option.id}`
                  return (
                    <li {...props} key={key}>
                      {option.name}
                    </li>
                  )
                }}
                onChange={(_, data) => {
                  field.onChange(data)
                }}
                renderInput={params => (
                  <TextField {...params} label="Địa danh" margin="normal" />
                )}
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
                error={errors.address}
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
          <Typography mt={2}>Vị trí trên bản đồ:</Typography>
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
            <Typography>Kinh độ:</Typography>
            <Typography>Vĩ độ:</Typography>
          </Stack>
          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <TextField
                error={errors.address}
                helperText={errors.address?.message}
                {...field}
                placeholder="Nhập mô tả lưu ý về địa hình nếu có"
                label="Lưu ý địa hình"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Controller
            name="campTypes"
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
            )}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Controller
            name="campGroundSeasons"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={[...seasons]}
                getOptionLabel={option => option.value}
                defaultValue={[{ id: 0, value: 'Xuân' }]}
                filterSelectedOptions
                sx={{ width: 400, marginRight: 5 }}
                onChange={(_, data) => field.onChange(data)}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Mùa thích hợp"
                    placeholder="Chọn mùa thích hợp"
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
      </Grid>
      <DialogCustom
        ref={dialogCustomRef}
        title="Chọn vị trí trên map"
        maxWidth="md"
      >
        <MapCustom
          ref={mapRef}
          center={{
            lat: 21.027161210811197,
            lng: 105.78872657468659,
          }}
        ></MapCustom>
        <Stack spacing={2} direction="row" justifyContent="center">
          <Button variant="contained">Xác nhận</Button>
          <Button variant="outlined">Hủy</Button>
        </Stack>
      </DialogCustom>
    </div>
  )
}
