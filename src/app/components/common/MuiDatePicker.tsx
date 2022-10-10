import * as React from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import { Controller, useFormContext } from 'react-hook-form'
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const CalPicker = ({ name, label }: any) => {
  const [value, setValue] = React.useState()

  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Stack sx={{ mt: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  required
                  error={!!errors[name]}
                  helperText={
                    errors[name]
                      ? (errors[name]?.message as unknown as string)
                      : ''
                  }
                />
              )}
              label={label}
              value={value}
              onChange={(newValue: any) => {
                field.onChange(newValue)
                setValue(newValue)
              }}
            />
          )}
        />
      </LocalizationProvider>
    </Stack>
  )
}

export default CalPicker
