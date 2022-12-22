import { yupResolver } from '@hookform/resolvers/yup'
import { Stack } from '@mui/material'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import * as Yup from 'yup'

type IProps = {
  loading?: boolean
  error?: string
  onSubmit: (content: string) => void
  autoFocus?: boolean
  initialValue?: string
  mode?: 'create' | 'edit'
}

export type SchemaType = {
  comment?: string
}

export function CommentForm({
  loading = false,
  onSubmit,
  initialValue,
  mode = 'create',
  autoFocus = false,
}: IProps) {
  const validationSchema = Yup.object().shape({
    comment: Yup.string().max(150, 'Nội dung không được vượt quá 150 ký tự'),
    // .required(messages.MSG1),
  })

  const methods = useForm<SchemaType>({
    defaultValues: { comment: initialValue },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const cmt = methods.watch('comment')

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    onSubmit(values.comment ?? '')
    methods.setValue('comment', '')
  }

  return (
    <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
      <FormProvider {...methods}>
        <Stack direction={'row'} gap={1.5}>
          <FormInputText
            autoFocus
            type="text"
            name="comment"
            size="small"
            defaultValue=""
            placeholder="Viết bình luận (tối đa 150 ký tự)"
            fullWidth
          />
          <MuiButton
            disabled={loading || !cmt || cmt?.length == 0}
            title="Đăng"
            variant="contained"
            color="primary"
            type="submit"
            sx={{ width: 100 }}
          />
          {cmt && cmt?.length != 0 && mode === 'create' && (
            <MuiButton
              disabled={loading}
              title="Huỷ"
              variant="outlined"
              color="secondary"
              onClick={() => methods.reset()}
              sx={{ width: 100 }}
            />
          )}
        </Stack>
      </FormProvider>
    </form>
  )
}
