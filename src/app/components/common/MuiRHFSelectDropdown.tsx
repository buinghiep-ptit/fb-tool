import { FormControl, InputLabel, Select, SelectProps } from '@mui/material'
import * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export interface ISelectDropDownProps extends SelectProps {
  name: string
  label?: string
  defaultValue?: string | number
  children: React.ReactElement[] | React.ReactElement
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
      sx={{
        width: '100%',
        '& .MuiInputBase-root': {
          // height: 40,
        },
      }}
    >
      <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select {...field} {...props} label={label}>
            {children}
          </Select>
        )}
      />
    </FormControl>
  )
}
