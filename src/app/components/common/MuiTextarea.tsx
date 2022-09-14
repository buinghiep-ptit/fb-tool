import {
  FormHelperText,
  InputAdornment,
  InputProps,
  styled,
  TextareaAutosize,
  TextareaAutosizeProps,
  TextField,
  TextFieldProps,
} from '@mui/material'
import * as React from 'react'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { MuiTypography } from './MuiTypography'

export type IFormTextAreaProps = {
  name: string
  defaultValue?: string
} & TextareaAutosizeProps

const FormTextArea: FC<IFormTextAreaProps> = ({
  name,
  defaultValue,
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
        <>
          <TextareaAutosize
            {...field}
            {...otherProps}
            minRows={3}
            maxRows={5}
            style={{
              width: '100%',
              border: '1px solid #cccccc',
              borderRadius: 8,
              padding: '8px 16px',
            }}
          />

          <FormHelperText error sx={{ px: 1.5 }}>
            {errors[name] ? (errors[name]?.message as unknown as string) : ''}
          </FormHelperText>
        </>
      )}
    />
  )
}
export default FormTextArea
