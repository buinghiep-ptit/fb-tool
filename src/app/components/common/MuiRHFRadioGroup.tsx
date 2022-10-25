import { FormControl, RadioGroup, RadioGroupProps } from '@mui/material'
import * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export interface IRadioGroupProps extends RadioGroupProps {
  name: string
  defaultValue?: string | number
  children: React.ReactElement[] | React.ReactElement
}

export function MuiRHFRadioGroup({
  name,
  defaultValue,
  children,
  ...props
}: IRadioGroupProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <FormControl component="fieldset">
      <Controller
        rules={{ required: true }}
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field }) => (
          <RadioGroup {...field} {...props}>
            {children}
          </RadioGroup>
        )}
      />
    </FormControl>
  )
}
