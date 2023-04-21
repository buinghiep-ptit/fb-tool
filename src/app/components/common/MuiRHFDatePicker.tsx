import { styled, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
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
  inputFormat?: 'DD/MM/YYYY' | 'DD/MM'
  required?: boolean
  disabled?: boolean
}

export function MuiRHFDatePicker({
  name,
  defaultValue,
  label = '',
  inputFormat = 'DD/MM/YYYY',
  required,
  disabled,
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
        <DatePicker
          {...rest}
          label={label}
          disabled={disabled}
          views={['year', 'month', 'day']}
          disableFuture={false}
          value={value}
          inputFormat={inputFormat}
          onChange={(value: any) => onChange(value)}
          renderInput={(params: any) => (
            <TextField
              {...params}
              error={!!errors[name]}
              helperText={
                errors[name] ? (errors[name]?.message as unknown as string) : ''
              }
              required={required}
              InputLabelProps={{ shrink: true }}
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
