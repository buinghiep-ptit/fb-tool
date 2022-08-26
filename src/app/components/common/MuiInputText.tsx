import { styled, TextField, TextFieldProps } from '@mui/material'
import * as React from 'react'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export type IFormInputTextProps = {
  name: string
} & TextFieldProps

const CssTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    height: 48,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      //   border: 'none',
    },
  },
})

const FormInputText: FC<IFormInputTextProps> = ({ name, ...otherProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field }) => (
        <CssTextField
          {...field}
          {...otherProps}
          variant="outlined"
          error={!!errors[name]}
          helperText={
            errors[name] ? (errors[name]?.message as unknown as string) : ''
          }
        />
      )}
    />
  )
}
export default FormInputText
