import { yupResolver } from '@hookform/resolvers/yup'
import { FormControlLabel, LinearProgress, Radio, Stack } from '@mui/material'
import { Box } from '@mui/system'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { MuiRadioGroup } from 'app/components/common/MuiRHFRadioGroup'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useLockCustomer } from 'app/hooks/queries/useCustomersData'
import React, { useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { messages } from 'app/utils/messages'

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
  }, [lockType])

  return (
    <FormInputText
      disabled={parseInt(lockType, 10) !== 2}
      type="number"
      label={'Thời gian'}
      name="lockDuration"
      placeholder="Nhập thời gian"
      inputProps={{
        inputProps: {
          // max: 100,
          min: 1,
        },
      }}
      defaultValue={''}
    />
  )
}

export default function LockCustomer({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const data = location.state?.data ?? {}

  const { customerId } = useParams()

  const onSuccess = (data: any) => {
    toastSuccess({ message: 'Cập nhật mật khẩu thành công' })
    navigate(-1)
  }
  const validationSchema = Yup.object().shape({
    lockType: Yup.string(),
    lockDuration: Yup.string().when('lockType', {
      is: (lockType: string) => lockType && lockType === '2',
      then: Yup.string()
        .required(messages.MSG1)
        .matches(/[0-9]{1,}/, 'Thời gian không hợp lệ'),
    }),

    reason: Yup.string()
      .required(messages.MSG1)
      .max(256, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: lockCustomer, isLoading } = useLockCustomer(onSuccess)

  const onSubmitHandler: SubmitHandler<FormData> = (values: FormData) => {
    lockCustomer({
      customerId,
      ...values,
      lockDuration:
        Number(values.lockType) === 2 ? Number(values.lockDuration) : 0,
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
            <MuiRadioGroup name="lockType" defaultValue={1}>
              <FormControlLabel value={1} control={<Radio />} label="Khoá" />
              <Stack flexDirection={'row'} alignItems={'center'}>
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label="Khoá tạm thời"
                />
                <>
                  <RHFInputLockTime methods={methods} name={'lockType'} />
                  <MuiTypography px={1} fontWeight={500}>
                    (giờ)
                  </MuiTypography>
                </>
              </Stack>
            </MuiRadioGroup>
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
        {isLoading && <LinearProgress />}
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
