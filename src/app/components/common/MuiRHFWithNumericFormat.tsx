import {
  InputAdornment,
  InputProps,
  TextField,
  TextFieldProps,
} from '@mui/material'
import * as React from 'react'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

export type Props = {
  iconStart?: React.ReactElement
  iconEnd?: React.ReactElement
  name: string
  label?: string
  defaultValue?: string
  inputProps?: InputProps
} & TextFieldProps

const MuiRHFNumericFormatInput: FC<Props> = ({
  name,
  label = '',
  defaultValue,
  iconStart,
  iconEnd,
  inputProps,
  ...otherProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <NumericFormat
          label={label}
          defaultValue={0}
          onValueChange={({ value: v }) => field.onChange(v)}
          InputProps={{
            ...inputProps,
            sx: {
              cursor: iconEnd ? 'pointer' : 'default',
              caretColor: '#218332',
            },
            startAdornment: iconStart ? (
              <InputAdornment position="start">{iconStart}</InputAdornment>
            ) : null,
            endAdornment: iconEnd ? (
              <InputAdornment position="end">{iconEnd}</InputAdornment>
            ) : null,
          }}
          error={!!errors[name]}
          helperText={
            errors[name] ? (errors[name]?.message as unknown as string) : ''
          }
          customInput={TextField}
          thousandSeparator=","
        />
      )}
    />
  )
}
export default MuiRHFNumericFormatInput
