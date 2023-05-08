import { FormHelperText } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import WYSIWYGEditor from './WYSIWYGEditor'
// import { stripHtml } from 'string-strip-html'

type Props = {
  name: string
  defaultValue?: any
  readOnly?: boolean
  resetEditor?: (x: boolean) => void
}

const RHFWYSIWYGEditor = ({ name, resetEditor, readOnly, ...props }: Props) => {
  const {
    formState: { errors },
    control,
  } = useFormContext()

  return (
    <>
      <Controller
        render={({ field }) => {
          const fields = { readOnly, ...field }
          return <WYSIWYGEditor {...fields} />
        }}
        name={name}
        control={control}
        defaultValue=""
        // rules={{
        //   validate: {
        //     required: v =>
        //       (v && stripHtml(v).result.length > 0) || 'Description is required',
        //     maxLength: v =>
        //       (v && stripHtml(v).result.length <= 2000) ||
        //       'Maximum character limit is 2000',
        //   },
        // }}
      />
      {errors[name] && (
        <FormHelperText error>{errors[name]?.message as string}</FormHelperText>
      )}
    </>
  )
}

export default RHFWYSIWYGEditor
