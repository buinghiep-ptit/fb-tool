import {
  Autocomplete,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
} from '@mui/material'
import React, { ReactElement } from 'react'
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
  optionProperty: string // keyof options
  renderInput?: any
  getOptionLabel?: (option: any) => string
  rightIcon?: ReactElement
  required?: boolean
}

export function MuiRHFAutoComplete({
  name,
  label,
  defaultValue,
  options = [],
  optionProperty,
  getOptionLabel,
  rightIcon,
  required,
}: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const handleScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget
    if (
      listboxNode.scrollTop + listboxNode.clientHeight ===
      listboxNode.scrollHeight
    ) {
      // setPage(page => page + 1)
      // loadMoreResults()
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: 'Please enter something',
      }}
      render={({ field }) => (
        <Autocomplete
          {...field}
          fullWidth
          options={options}
          // componentsProps={{ paper: { elevation: 20 } }}
          ListboxProps={{
            onScroll: handleScroll,
          }}
          getOptionLabel={getOptionLabel}
          renderOption={(props, option, index) => {
            const key = `listItem-${index}-${
              option.id ?? option[optionProperty]
            }`
            return (
              <li {...props} key={key}>
                <Stack
                  direction={'row'}
                  gap={1.5}
                  justifyContent="space-between"
                  flex={1}
                >
                  <MuiTypography>{option[optionProperty]}</MuiTypography>
                  {
                    option.icon && option.icon()
                    // <Chip
                    //   label={option.role === 1 ? 'Admin' : 'CS'}
                    //   size="small"
                    //   color={option.role === 1 ? 'primary' : 'default'}
                    // />
                  }
                </Stack>
              </li>
            )
          }}
          renderInput={params => (
            <TextField
              required={required}
              {...params}
              label={label}
              error={!!errors[name]}
              helperText={
                errors[name] ? (errors[name]?.message as unknown as string) : ''
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {/* {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null} */}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          isOptionEqualToValue={(option, value) =>
            value === undefined || value === '' || option.id === value.id
          }
          noOptionsText={'Không có kết quả phù hợp'}
          onChange={(_, data) => field.onChange(data)}
        />
      )}
    />
  )
}
