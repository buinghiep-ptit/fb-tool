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
  defaultValue?: string
  inputProps?: InputProps
} & TextFieldProps

export const CssTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    height: 40,
    '&:focused': {
      caretColor: '#0062cc',
    },
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      //   border: 'none',
    },
  },
})

const FormInputText: FC<IFormInputTextProps> = ({
  name,
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
        />
      )}
    />
  )
}
export default FormInputText
