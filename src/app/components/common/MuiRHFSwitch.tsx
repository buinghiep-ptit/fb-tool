import { Switch } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

export interface ICheckBoxProps {
  name: string
  label?: string | 'Checkbox'
  defaultValue?: boolean
}

export function MuiRHFSwitch({
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
        <Switch
          onChange={e => field.onChange(e.target.checked)}
          checked={field.value}
        />
      )}
    />
  )
}
