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

export function MuiAutocompleteWithTags({
  name,
  label = '',
  initialValues = [{ value: 'hashtag' }],
}: Props) {
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext()

  const handleKeyDown = (event: any) => {
    switch (event.key) {
      case 'Enter': {
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
          freeSolo={false}
          popupIcon={''}
          multiple
          open={false}
          limitTags={2}
          value={getValues('hashtag')}
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
                  label={`# hashtag`}
                  size="small"
                  {...getTagProps({ index: 0 })}
                />
              )
            } else {
              return value.map((option: any, index) => (
                <Chip
                  variant="filled"
                  label={`# ${option.value}`}
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
                error={errors.hashtag as any}
                helperText={errors.hashtag?.message as any}
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
