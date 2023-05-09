import { styled, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
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
  required?: boolean
  disabled?: boolean
}

export function MuiRHFDateTimePicker({
  name,
  defaultValue,
  label = '',

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
        <DateTimePicker
          {...rest}
          label={label}
          disabled={disabled}
          disableFuture={false}
          value={value}
          inputFormat="DD/MM/YYYY HH:mm"
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
