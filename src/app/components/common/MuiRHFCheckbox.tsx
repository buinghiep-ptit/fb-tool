import { Checkbox, FormControlLabel } from '@mui/material'
import * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export interface ICheckBoxProps {
  name: string
  label?: string | 'Checkbox'
  defaultValue?: boolean
}

export function MuiCheckBox({
  name,
  label,
  defaultValue,
  ...props
}: ICheckBoxProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              onChange={field.onChange}
              checked={field.value}
              sx={{ py: 0 }}
              {...props}
            />
          }
          label={label || 'Label'}
        />
      )}
    />
  )
}
