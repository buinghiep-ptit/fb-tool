import {
  InputAdornment,
  InputProps,
  styled,
  TextField,
  TextFieldProps,
} from '@mui/material'
import * as React from 'react'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export type IFormInputTextProps = {
  iconStart?: React.ReactElement
  iconEnd?: React.ReactElement
  name: string
  inputProps?: InputProps
} & TextFieldProps

const CssTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    height: 40,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      //   border: 'none',
    },
  },
})

const FormInputText: FC<IFormInputTextProps> = ({
  name,
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
          InputProps={{
            ...inputProps,
            sx: { cursor: iconEnd ? 'pointer' : 'default' },
            startAdornment: iconStart ? (
              <InputAdornment position="start">{iconStart}</InputAdornment>
            ) : null,
            endAdornment: iconEnd ? (
              <InputAdornment position="end">{iconEnd}</InputAdornment>
            ) : null,
          }}
        />
      )}
    />
  )
}
export default FormInputText
