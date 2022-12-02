import { yupResolver } from '@hookform/resolvers/yup'
import {
  CheckCircleOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Card,
  Grid,
  IconButton,
  Stack,
  styled,
  TextField,
} from '@mui/material'
import {
  resetPasswordCheck,
  resetPasswordFinish,
  resetPasswordInit,
} from 'app/apis/auth/auth.service'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import MuiSnackBar from 'app/components/common/MuiSnackBar'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { Span } from 'app/components/Typography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { messages } from 'app/utils/messages'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'

const FlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: 'center',
}))

const ContentBox = styled(Box)(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default,
}))

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 36,
  fontFamily: 'Caveat',
  fontWeight: 900,
  display: mode === 'compact' ? 'none' : 'block',
}))

const CssTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    height: 40,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      //   border: 'none',
    },
  },
})
const ForgotPasswordRoot = styled(JustifyBox)(() => ({
  background: '#2F9B42', //'#1A2038',
  minHeight: '100vh !important',
  '& .card': {
    maxWidth: 500,
    margin: '1rem',
    borderRadius: 12,
  },
}))

const defaultValues = {
  email: '',
}

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [snackBar, setSnackBar] = useState({
    open: false,
  })
  const [showPassword, setShowPassword] = useState({
    visibility: false,
  })
  const validationSchema1 = Yup.object().shape({
    email: Yup.string().email(messages.MSG12).required(messages.MSG1),
  })

  const validationSchema2 = Yup.object().shape({
    password: Yup.string()
      .test('latinChars', messages.MSG21, value => {
        const regexStr = /^[\x20-\x7E]+$/
        return regexStr.test(value)
      })
      .matches(/^\S*$/, messages.MSG21)
      .matches(/^(?=.*?[a-z])(?=.*?[0-9]).{8,20}$/g, messages.MSG20)
      .required(messages.MSG1),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], messages.MSG11)
      .required(messages.MSG1),
  })

  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(step === 1 ? validationSchema1 : validationSchema2),
  })

  useEffect(() => {
    ;(async () => {
      if (_.isEmpty(queryParams)) return
      try {
        const response = await resetPasswordCheck({
          key: queryParams.key ?? '',
        })
        if (response.isValid) setStep(2)
        else navigate('/session/signin')
      } catch (error) {}
    })()
  }, [])

  const onSubmitHandler = async values => {
    if (step === 3) {
      navigate(-1)
      return
    }
    setLoading(true)
    try {
      if (step === 1) {
        await resetPasswordInit(values)
        toastSuccess({
          message:
            'Gửi yêu cầu thành công. Vui lòng kiểm tra email để tiếp tục!',
        })
        setLoading(false)
      } else if (step === 2) {
        await resetPasswordFinish({
          key: queryParams.key ?? '',
          newPassword: values.password,
        })
        setStep(step + 1)
        setLoading(false)
      }
    } catch (error) {
      if (error.data)
        methods.setError('email', { message: error.data.errorDescription })
      setLoading(false)
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(prev => ({
      ...prev,
      visibility: !prev.visibility,
    }))
  }

  const handleGoBack = () => {
    if (step === 1) {
      navigate(-1)
    } else {
      setStep(step - 1)
    }
  }

  const handleSnackBar = ({ open, status, message }) => {
    setSnackBar(prev => ({ ...prev, open, status, message }))
  }

  return (
    <ForgotPasswordRoot>
      <MuiSnackBar data={snackBar} setSnackBar={handleSnackBar} />
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <JustifyBox p={4} gap={4}>
              <StyledSpan className="sidenavHoverShow pb-3">CampDi</StyledSpan>
              <img
                src="/assets/images/login/bg-login.png"
                width="50%"
                alt="forgot password"
                style={{ objectFit: 'cover' }}
              />
            </JustifyBox>

            <ContentBox>
              <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
                <FormProvider {...methods}>
                  <Stack mb={3}>
                    {step === 1 && (
                      <>
                        <Stack mb={4}>
                          <MuiTypography variant="h5">
                            Quên mật khẩu
                          </MuiTypography>
                          <MuiTypography variant="body2">
                            Nhập email của bạn bên dưới, chúng tôi sẽ gửi cho
                            bạn liên kết để đặt lại mật khẩu
                          </MuiTypography>
                        </Stack>
                        <FormInputText
                          label={'Email'}
                          type="text"
                          name="email"
                          size="small"
                          placeholder="Nhập email"
                          defaultValue=""
                          fullWidth
                        />
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <Stack mb={2} gap={3}>
                          <FormInputText
                            label={'Mật khẩu'}
                            type={showPassword.visibility ? 'text' : 'password'}
                            name="password"
                            placeholder="Nhập mật khẩu"
                            size="small"
                            fullWidth
                            defaultValue=""
                            iconEnd={
                              <IconButton
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {!showPassword.visibility ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            }
                          />
                          <FormInputText
                            label={' Xác nhận mật khẩu'}
                            type={showPassword.visibility ? 'text' : 'password'}
                            name="passwordConfirmation"
                            placeholder="Nhập mật khẩu xác nhận"
                            size="small"
                            defaultValue=""
                            fullWidth
                            iconEnd={
                              <IconButton
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {!showPassword.visibility ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            }
                          />
                        </Stack>
                      </>
                    )}
                    {step === 3 && (
                      <Stack justifyContent={'center'} textAlign={'center'}>
                        <MuiTypography variant="h6" pb={1}>
                          {'Mật khẩu đã được đặt lại thành công'}
                        </MuiTypography>
                        <Box>
                          <CheckCircleOutlined
                            fontSize="large"
                            color="success"
                          />
                        </Box>
                        <MuiTypography variant="subTitle1" pb={1}>
                          {
                            'Bạn đã đặt lại mật khẩu thành công cho tài khoản bằng email'
                          }
                        </MuiTypography>
                        <MuiTypography color={'primary'}>
                          {methods.getValues().email}
                        </MuiTypography>
                      </Stack>
                    )}
                  </Stack>
                  <LoadingButton
                    fullWidth
                    variant="contained"
                    loading={loading}
                    color="primary"
                    type="submit"
                    sx={{ height: 52 }}
                    disabled={
                      Object.keys(methods?.formState?.errors).length > 0
                    }
                  >
                    {step === 3 ? 'Hoàn tất' : 'Tiếp tục'}
                  </LoadingButton>

                  {step < 3 && (
                    <MuiButton
                      fullWidth
                      title="Quay lại"
                      color="primary"
                      variant="outlined"
                      onClick={handleGoBack}
                      sx={{ mt: 2 }}
                    />
                  )}
                </FormProvider>
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </ForgotPasswordRoot>
  )
}

export default ForgotPassword
