import * as React from 'react'
import { Grid, TextField, Autocomplete } from '@mui/material'
import { Controller } from 'react-hook-form'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

export default function InformationBooking({ control, errors, listMerchant }) {
  const [isBooking, setIsBooking] = React.useState('1')

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Controller
            name="isSupportBooking"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel>Hỗ trợ đặt chỗ*</FormLabel>
                <RadioGroup
                  row
                  {...field}
                  value={isBooking}
                  onChange={event => {
                    console.log(event.target.value === '1')
                    setIsBooking(event.target.value)
                  }}
                >
                  <FormControlLabel value={1} control={<Radio />} label="Có" />
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="Không"
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>
        {isBooking !== '1' && (
          <Grid item xs={4} md={4}>
            <Controller
              name="contact"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  label="Liên hệ"
                  variant="outlined"
                  error={errors.namePlace}
                  helperText={errors.namePlace?.message}
                />
              )}
            />
          </Grid>
        )}
        {isBooking === '1' && (
          <Grid item xs={6} md={6} style={{ paddingRight: '15px' }}>
            <Controller
              name="idMerchant"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disablePortal
                  {...field}
                  fullWidth
                  options={listMerchant}
                  getOptionLabel={option =>
                    `${option.email}, ${option.mobilePhone}`
                  }
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
        )}
        <Grid item xs={6} md={6}>
          <Controller
            name="openTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                style={{ marginRight: '15px' }}
                margin="normal"
                id="time"
                label="Thời gian mở cửa"
                type="time"
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
            name="closeTime"
            control={control}
            render={({ field }) => (
              <TextField
                label="Thời gian đóng cửa"
                margin="normal"
                {...field}
                id="time"
                type="time"
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
