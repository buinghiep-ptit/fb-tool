import * as React from 'react'
import { Grid, TextField, Autocomplete } from '@mui/material'
import { Controller } from 'react-hook-form'

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
}) {
  const addHashTag = e => {
    if (e.keyCode === 13) {
      setValue('hashtag', [...getValues('hashtag'), { value: e.target.value }])
      e.preventDefault()
    }
  }
  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Controller
            name="namePlace"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
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
                label="Địa danh"
                variant="outlined"
                margin="normal"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Loại hình"
                variant="outlined"
                margin="normal"
                // error={errors.namePlace}
                // helperText={errors.namePlace?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Controller
            name="season"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mùa thích hợp"
                variant="outlined"
                margin="normal"
                // error={errors.namePlace}
                // helperText={errors.namePlace?.message}
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
      </Grid>
    </div>
  )
}
