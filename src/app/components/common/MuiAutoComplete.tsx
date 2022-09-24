import { Autocomplete, styled, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

export interface IAutoCompleteProps {
  name: string
  itemList: any
  disabled?: boolean
}

const CssTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    height: 40,
    padding: '0 6px 4px 6px!important',
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

export function MuiAutoComplete({
  name,
  itemList,
  disabled,
  ...props
}: IAutoCompleteProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          disabled={disabled}
          {...props}
          onChange={(event, item) => {
            onChange(item)
          }}
          value={value ?? null}
          options={itemList}
          getOptionLabel={item =>
            item.fullName ?? item.email ?? item.mobilePhone ?? ''
          }
          isOptionEqualToValue={(option, value) => {
            return (
              value === undefined ||
              value === '' ||
              value === 0 ||
              option.id === value.id
            )
          }}
          renderInput={params => (
            <CssTextField
              sx={{ my: 0 }}
              {...params}
              margin="normal"
              variant="outlined"
              error={!!errors[name]}
              helperText={
                errors[name] ? (errors[name]?.message as unknown as string) : ''
              }
              required
            />
          )}
        />
      )}
    />
  )
}
