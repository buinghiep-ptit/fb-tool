import { FormControl, Select, SelectProps } from '@mui/material'
import * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export interface ISelectDropDownProps extends SelectProps {
  name: string
  defaultValue?: string | number
  children: React.ReactElement[] | React.ReactElement
}

export function SelectDropDown({
  name,
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
          height: 40,
        },
      }}
    >
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select {...field} {...props}>
            {children}
          </Select>
        )}
      />
    </FormControl>
  )
}
