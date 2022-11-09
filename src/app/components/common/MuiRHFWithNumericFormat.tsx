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
  isAllowZeroFirst?: boolean
  iconStart?: React.ReactElement
  iconEnd?: React.ReactElement
  name: string
  label?: string
  isAllowDot?: boolean
  defaultValue?: string
  inputProps?: InputProps
  disabled?: boolean
  required?: boolean
} & TextFieldProps

// const MAX_LIMIT = 1000
// const MIN_LIMIT = 0

const MuiRHFNumericFormatInput: FC<Props> = ({
  name,
  label = '',
  isAllowDot = false,
  isAllowZeroFirst = true,
  defaultValue,
  iconStart,
  iconEnd,
  inputProps,
  disabled = false,
  required,
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
      render={({ field: { onChange, name, value } }) => (
        <NumericFormat
          thousandSeparator=","
          name={name}
          value={value}
          label={label}
          isAllowed={(values: any) => {
            const { value } = values
            const MIN_LIMIT = isAllowZeroFirst ? 0 : 1
            return (
              !value ||
              (value &&
                value >= MIN_LIMIT &&
                ((!isAllowDot && !value.toString().includes('.')) ||
                  isAllowDot))
            )
          }}
          disabled={disabled}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          required={required}
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
        />
      )}
    />
    // <Controller
    //   control={control}
    //   name={name}
    //   defaultValue={defaultValue}
    //   render={({ field }) => (
    //     <NumericFormat
    //       value={!field.value ? field.value : null}
    //       label={label}
    //       defaultValue={0}
    //       onValueChange={({ value: v }) => field.onChange(v)}
    //       // InputProps={{
    //       //   ...inputProps,
    //       //   sx: {
    //       //     cursor: iconEnd ? 'pointer' : 'default',
    //       //     caretColor: '#218332',
    //       //   },
    //       //   startAdornment: iconStart ? (
    //       //     <InputAdornment position="start">{iconStart}</InputAdornment>
    //       //   ) : null,
    //       //   endAdornment: iconEnd ? (
    //       //     <InputAdornment position="end">{iconEnd}</InputAdornment>
    //       //   ) : null,
    //       // }}
    //       error={!!errors[name]}
    //       helperText={
    //         errors[name] ? (errors[name]?.message as unknown as string) : ''
    //       }
    //       customInput={TextField}
    //       thousandSeparator=","
    //     />
    //   )}
    // />
  )
}
export default MuiRHFNumericFormatInput
