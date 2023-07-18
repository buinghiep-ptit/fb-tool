import {
  Autocomplete,
  CircularProgress,
  Paper,
  Stack,
  TextField,
} from '@mui/material'
import { ReactElement } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { MuiTypography } from './MuiTypography'

function CustomPaper({ children, ...others }: any) {
  return (
    <Paper {...others}>
      {children}
      <Stack
        flexDirection={'row'}
        gap={1}
        justifyContent="center"
        alignItems={'center'}
        py={0.5}
      >
        <MuiTypography textAlign={'center'} color="primary">
          Đang tải thêm...
        </MuiTypography>
        <CircularProgress color="primary" size={16} />
      </Stack>
    </Paper>
  )
}
export interface Props {
  name: string
  label?: string
  defaultValue?: any
  options?: any
  optionProperty?: string // keyof options
  renderInput?: any
  getOptionLabel?: (option: any) => string
  rightIcon?: ReactElement
  required?: boolean
  disabled?: boolean
  multiple?: boolean
}

export function MuiRHFAutocompleteMultiple({
  name,
  label,
  defaultValue,
  options = [],
  optionProperty,
  getOptionLabel,
  required,
}: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Autocomplete
          {...field}
          multiple
          limitTags={2}
          id="multiple-limit-tags"
          options={options}
          getOptionLabel={getOptionLabel}
          renderInput={params => (
            <TextField {...params} label={label} placeholder="Favorites" />
          )}
          fullWidth
        />
      )}
    />
  )
}
