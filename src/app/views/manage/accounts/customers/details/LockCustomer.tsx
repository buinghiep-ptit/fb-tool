import { yupResolver } from '@hookform/resolvers/yup'
import { FormControlLabel, LinearProgress, Radio, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { MuiRHFRadioGroup } from 'app/components/common/MuiRHFRadioGroup'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import MuiRHFNumericFormatInput from 'app/components/common/MuiRHFWithNumericFormat'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useLockCustomer } from 'app/hooks/queries/useCustomersData'
import { messages } from 'app/utils/messages'
import React, { useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

type FormData = {
  lockType?: number
  lockDuration?: number
  reason?: string
}

type RHFInputLockTimeProps = {
  methods: any
  name: string
}

const RHFInputLockTime = ({ methods, name }: RHFInputLockTimeProps) => {
  const lockType = useWatch({ control: methods.control, name })

  useEffect(() => {
    methods.clearErrors('lockDuration')
    if (parseInt(lockType, 10) === 2) {
      methods.setValue('lockDuration', 12)
    }
  }, [lockType])

  return (
    <MuiRHFNumericFormatInput
      disabled={parseInt(lockType, 10) !== 2}
      type="text"
      name="lockDuration"
      label="Thời gian"
      placeholder="Nhập giá"
      fullWidth
    />
  )
}

export default function LockCustomer({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false

  const { customerId } = useParams()

  const onSuccess = (data: any) => {
    toastSuccess({ message: 'Khoá thành công' })
    navigate(-1)
  }
  const validationSchema = Yup.object().shape({
    lockType: Yup.string(),
    lockDuration: Yup.string().when('lockType', {
      is: (lockType: string) => lockType && lockType === '2',
      then: Yup.string()
        .required(messages.MSG1)
        .max(12, 'Thời gian không hợp lệ (<= 10 số)')
        .matches(/[0-9]{1,}/, 'Thời gian không hợp lệ'),
    }),

    reason: Yup.string()
      .required(messages.MSG1)
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<any>({
    defaultValues: {
      lockDuration: 12,
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: lockCustomer, isLoading } = useLockCustomer(onSuccess)

  const onSubmitHandler: SubmitHandler<FormData> = (values: FormData) => {
    const duration =
      values?.lockDuration?.toString().replace(/,(?=\d{3})/g, '') ?? 0

    lockCustomer({
      customerId,
      ...values,
      lockDuration: Number(values.lockType) === 2 ? Number(duration) : 0,
      lockType: Number(values.lockType),
    })
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
          <Stack>
            <MuiRHFRadioGroup name="lockType" defaultValue={1}>
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Khoá tài khoản"
              />
              <Stack flexDirection={'row'} alignItems={'center'}>
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label="Khoá tạm thời"
                  sx={{ flex: 1, minWidth: '160px' }}
                />
                <>
                  <RHFInputLockTime methods={methods} name={'lockType'} />

                  <MuiTypography px={1} fontWeight={500}>
                    (giờ)
                  </MuiTypography>
                </>
              </Stack>
            </MuiRHFRadioGroup>
          </Stack>

          <Stack my={1.5}>
            <MuiTypography variant="subtitle2" pb={1}>
              Lý do*:
            </MuiTypography>
            <FormTextArea
              name="reason"
              defaultValue={''}
              placeholder="Nội dung"
            />
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
        submitText="Khoá"
        cancelText="Huỷ"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
