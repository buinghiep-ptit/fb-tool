import * as React from 'react'
import { Grid, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

export default function InformationBooking({ control, errors }) {
  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Controller
            name="isSupportBooking"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Hỗ trợ đặt chỗ*
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  {...field}
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

        <Grid item xs={8} md={8}>
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
