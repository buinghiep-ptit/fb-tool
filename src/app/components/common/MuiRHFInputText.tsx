import {
  Icon,
  IconButton,
  InputAdornment,
  InputBaseComponentProps,
  InputProps,
  styled,
  TextField,
  TextFieldProps,
} from '@mui/material'
import * as React from 'react'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export const CssTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    // height: 40,
    '&:focused': {
      caretColor: '#0062cc',
    },
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      //   border: 'none',
    },
  },

  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#000000',
    opacity: 0.5,
  },
})

export type IFormInputTextProps = {
  formatType?: 'currency' | 'phone' | 'default'
  inputComponent?: React.ElementType<InputBaseComponentProps> | undefined
  iconStart?: React.ReactElement
  iconEnd?: React.ReactElement
  name: string
  label?: string
  defaultValue?: string
  inputProps?: InputProps
  clearIcon?: boolean
} & TextFieldProps

const FormInputText: FC<IFormInputTextProps> = ({
  name,
  label = '',
  formatType = 'default',
  defaultValue,
  inputComponent,
  iconStart,
  iconEnd,
  inputProps,
  clearIcon = true,
  ...otherProps
}) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext()

  const val = watch(name)

  const clearInput = () => {
    setValue(name, '')
  }

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <CssTextField
          {...field}
          value={formatType !== 'default' ? 0 : field.value}
          {...otherProps}
          label={label}
          size="medium"
          variant="outlined"
          error={!!errors[name]}
          helperText={
            errors[name] ? (errors[name]?.message as unknown as string) : ''
          }
          InputLabelProps={{ shrink: true }}
          InputProps={{
            ...inputProps,
            sx: {
              cursor: iconEnd ? 'pointer' : 'default',
              caretColor: '#ED1E24',
            },
            inputComponent: inputComponent,
            startAdornment: iconStart ? (
              <InputAdornment position="start">{iconStart}</InputAdornment>
            ) : null,
            // endAdornment: iconEnd ? (
            //   <InputAdornment position="end">{iconEnd}</InputAdornment>
            // ) : null,
            endAdornment: clearIcon ? (
              <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                {iconEnd ? (
                  iconEnd
                ) : !!val ? (
                  <IconButton sx={{ p: 0, m: 0 }} onClick={clearInput}>
                    <Icon fontSize="small">clear</Icon>
                  </IconButton>
                ) : null}
              </InputAdornment>
            ) : null,
          }}
        />
      )}
    />
  )
}
export default FormInputText
