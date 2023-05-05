import { Autocomplete, Chip, styled, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

const CssTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    // paddingTop: '2px',
    // paddingBottom: '4px',
    // paddingLeft: '6px',
    '&:focused': {
      caretColor: '#0062cc',
    },
  },
})

export interface Props {
  name: string
  label?: string
  initialValues?: { value: string }[]
}

export function MuiRHFAutocompleteWithKeyword({
  name,
  label = '',
  initialValues = [{ value: 'hashtag' }],
}: Props) {
  const {
    control,
    getValues,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useFormContext()

  const handleKeyDown = (event: any) => {
    switch (event.key) {
      case 'Enter':
      case ',':
      case ' ': {
        event.preventDefault()
        event.stopPropagation()
        if (event.target.value.length > 0) {
          setValue(name, [...getValues(name), { value: event.target.value }])
        }

        break
      }
      default:
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          freeSolo={false}
          popupIcon={''}
          multiple
          open={false}
          limitTags={5}
          value={getValues(name)}
          options={[]}
          filterSelectedOptions={false}
          getOptionLabel={(option: any) => option.value ?? ''}
          onChange={(_, data) => {
            field.onChange(data)
          }}
          renderTags={(value, getTagProps) => {
            if (!value.length) {
              return (
                <Chip
                  variant="filled"
                  label={label}
                  size="small"
                  {...getTagProps({ index: 0 })}
                />
              )
            } else {
              return value.map((option: any, index) => (
                <Chip
                  variant="filled"
                  label={`${option.value}`}
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }
          }}
          renderInput={params => {
            params.inputProps.onKeyDown = handleKeyDown
            return (
              <CssTextField
                sx={{ my: 0 }}
                label={label}
                error={errors.keyword as any}
                helperText={errors.keyword?.message as any}
                {...params}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )
          }}
        />
      )}
    />
  )
}
