import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Select,
  SelectProps,
} from '@mui/material'
import * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export interface ISelectDropDownProps extends SelectProps {
  name: string
  label?: string
  defaultValue?: string | number
  children: React.ReactElement[] | React.ReactElement | any
}

export function SelectDropDown({
  name,
  label = '',
  defaultValue,
  children,
  ...props
}: ISelectDropDownProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <FormControl
      variant="outlined"
      sx={{
        width: '100%',
        '& .MuiInputBase-root': {
          // height: 40,
        },
      }}
    >
      <InputLabel shrink>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            {...props}
            input={<OutlinedInput notched label={label} />}
          >
            {children}
          </Select>
        )}
      />
      {errors[name] && (
        <FormHelperText error>{errors[name]?.message as string}</FormHelperText>
      )}
    </FormControl>
  )
}
