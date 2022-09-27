import { styled, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
import { Controller, useFormContext } from 'react-hook-form'

export const CssTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    // height: 40,
  },
})

export interface IMuiRHFDatePickerProps {
  name: string
  defaultValue?: string
  label?: string
}

export function MuiRHFDatePicker({
  name,
  defaultValue,
  label = '',
}: IMuiRHFDatePickerProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue ?? null}
      render={({ field: { onChange, value, ...rest } }) => (
        <DateTimePicker
          {...rest}
          label={label}
          disableFuture={false}
          value={value}
          inputFormat="DD/MM/YYYY"
          onChange={(value: any) =>
            onChange(moment(new Date(value)).format('YYYY-MM-DD'))
          }
          renderInput={(params: any) => (
            <TextField
              {...params}
              error={!!errors[name]}
              helperText={
                errors[name] ? (errors[name]?.message as unknown as string) : ''
              }
              size="medium"
              variant="outlined"
              margin="dense"
              fullWidth
              color="primary"
              autoComplete="bday"
            />
          )}
        />
      )}
    />
  )
}
