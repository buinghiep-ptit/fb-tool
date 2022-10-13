import {
  FormHelperText,
  TextareaAutosize,
  TextareaAutosizeProps,
} from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export type IFormTextAreaProps = {
  name: string
  defaultValue?: string
} & TextareaAutosizeProps &
  any

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
            minRows={5}
            maxRows={5}
            style={{
              width: '100%',
              border: '1px solid #cccccc',
              borderRadius: 8,
              padding: '8px 16px',
              whiteSpace: 'pre-wrap',
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
