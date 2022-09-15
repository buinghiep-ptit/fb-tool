import * as React from 'react'
import { Grid, TextField, Autocomplete } from '@mui/material'
import { Controller } from 'react-hook-form'

export default function InformationBooking({
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

        <Grid item xs={12} md={12}>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                style={{ marginRight: '15px' }}
                margin="normal"
                id="time"
                label="Thời gian mở cửa"
                type="time"
                defaultValue="07:30"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                sx={{ width: 150 }}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <TextField
                label="Thời gian đóng cửa"
                margin="normal"
                {...field}
                id="time"
                type="time"
                defaultValue="07:30"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                sx={{ width: 150 }}
              />
            )}
          />
        </Grid>
      </Grid>
    </div>
  )
}
