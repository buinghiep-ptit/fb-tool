import { yupResolver } from '@hookform/resolvers/yup'
import {
  CheckCircleOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material'
import {
  resetPasswordCheck,
  resetPasswordFinish,
  resetPasswordInit,
} from 'app/apis/auth/auth.service'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiInputText'
import MuiSnackBar from 'app/components/common/MuiSnackBar'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { Span } from 'app/components/Typography'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
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
    maxWidth: 800,
    margin: '1rem',
    borderRadius: 12,
  },
}))

const defaultValues = {
  email: 'giangcm@fpt.com.vn',
}

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [snackBar, setSnackBar] = useState({
    open: false,
  })
  const [showPassword, setShowPassword] = useState({
    visibility: false,
  })
  const validationSchema1 = Yup.object().shape({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc'),
  })

  const validationSchema2 = Yup.object().shape({
    password: Yup.string()
      .required('Mật khẩu là bắt buộc')
      .matches('^(?=.*?[a-z])(?=.*?[0-9]).{8,32}$', 'Mật khẩu không hợp lệ'),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
      .required('Mật khẩu xác nhận là bắt buộc'),
  })

  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(step === 1 ? validationSchema1 : validationSchema2),
  })

  const onSubmitHandler = async values => {
    if (step === 3) {
      navigate(-1)
      return
    }
    setLoading(true)
    try {
      let response = null
      if (step === 1) {
        response = await resetPasswordInit(values)
        if (response.status === '200') {
          response = await resetPasswordCheck({ key: 'test_giangcm' })
          if (response.isValid) setStep(step + 1)
        }
        setLoading(false)
      } else if (step === 2) {
        response = await resetPasswordFinish({
          key: 'test_giangcm',
          newPassword: values.password,
        })
        if (response.status === '200') {
          handleSnackBar({
            open: true,
            status: 'success',
            message: 'Đặt lại mật khẩu thành công',
          })
          setStep(step + 1)
        }
        setLoading(false)
      }
      if (response?.error) {
        handleSnackBar({
          open: true,
          status: 'error',
          message: response.errorDescription,
        })
      }
      console.log('response:', response)
    } catch (error) {
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
                src="/assets/images/login/bg-register.png"
                width="100%"
                alt="forgot password"
              />
            </JustifyBox>

            <ContentBox>
              <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
                <FormProvider {...methods}>
                  <Stack mb={3}>
                    {step === 1 && (
                      <>
                        <MuiTypography variant="subtitle2" pb={1}>
                          Email
                        </MuiTypography>
                        <FormInputText
                          type="text"
                          name="email"
                          size="small"
                          placeholder="Nhập email"
                          fullWidth
                        />
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <Stack mb={2}>
                          <MuiTypography variant="subtitle2" pb={1}>
                            Mật khẩu
                          </MuiTypography>
                          <FormInputText
                            type={showPassword.visibility ? 'text' : 'password'}
                            name="password"
                            placeholder="Nhập mật khẩu"
                            size="small"
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
                        <Stack>
                          <MuiTypography variant="subtitle2" pb={1}>
                            Xác nhận mật khẩu
                          </MuiTypography>
                          <FormInputText
                            type={showPassword.visibility ? 'text' : 'password'}
                            name="passwordConfirmation"
                            placeholder="Nhập mật khẩu xác nhận"
                            size="small"
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
                    sx={{ height: 40 }}
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
