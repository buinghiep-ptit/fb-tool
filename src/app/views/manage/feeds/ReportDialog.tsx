import { yupResolver } from '@hookform/resolvers/yup'
import { LinearProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useViolateFeed } from 'app/hooks/queries/useFeedsData'
import React from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

type FormData = {
  reason?: string
}

export default function ReportInfringe({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const { feedId } = useParams()

  const onSuccess = (data: any) => {
    toastSuccess({ message: 'Báo cáo vi phạm thành công' })
    navigate(-1)
  }
  const validationSchema = Yup.object().shape({
    reason: Yup.string()
      .required('Lý do không được bỏ trống')
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: violate, isLoading } = useViolateFeed(onSuccess)

  const onSubmitHandler: SubmitHandler<FormData> = (values: FormData) => {
    violate({ feedId, ...values })
  }

  const handleClose = () => {
    navigate(-1)
  }

  const getContent = () => {
    return (
      <Box
        sx={{
          paddingLeft: {
            xs: '6.66%',
            sm: '13.33%',
          },
          paddingRight: {
            xs: '6.66%',
            sm: '13.33%',
          },
        }}
      >
        <FormProvider {...methods}>
          <Stack gap={1.5}>
            <Box>
              <MuiTypography variant="subtitle2" pb={1}>
                Lý do:*
              </MuiTypography>
              <FormTextArea
                name="reason"
                defaultValue={''}
                placeholder="Nội dung"
              />
            </Box>
          </Stack>
        </FormProvider>
      </Box>
    )
  }

  return (
    <React.Fragment>
      <MuiStyledModal
        title={title}
        open={isModal}
        onCloseModal={handleClose}
        isLoading={isLoading}
        onSubmit={methods.handleSubmit(onSubmitHandler)}
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
