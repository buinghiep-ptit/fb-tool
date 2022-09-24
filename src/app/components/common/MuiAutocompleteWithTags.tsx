import { Autocomplete, Chip, styled, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

const CssTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    paddingTop: '2px',
    paddingBottom: '4px',
    paddingLeft: '6px',
    '&:focused': {
      caretColor: '#0062cc',
    },
  },
})

export interface Props {
  name: string
}

export function MuiAutocompleteWithTags({ name }: Props) {
  const {
    control,
    getValues,
    setValue,
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
          setValue('hashtag', [
            ...getValues('hashtag'),
            { value: event.target.value },
          ])
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
          multiple
          open={false}
          limitTags={2}
          options={[]}
          filterSelectedOptions={false}
          getOptionLabel={option => option.value}
          onChange={(_, data) => field.onChange(data)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="filled"
                label={`# ${option.value}`}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={params => {
            params.inputProps.onKeyDown = handleKeyDown
            return (
              <CssTextField
                sx={{ my: 0 }}
                error={errors.hashtag as any}
                helperText={errors.hashtag?.message as any}
                {...params}
                variant="outlined"
                placeholder="Hashtag"
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
