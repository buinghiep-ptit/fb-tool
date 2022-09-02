import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Card,
  Grid,
  IconButton,
  Stack,
  styled,
  TextField,
} from '@mui/material'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiInputText'
import { MuiTypography } from 'app/components/common/MuiTypography'
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
  background: '#1A2038',
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

  const onSubmitHandler = values => {
    console.log('values:', values)
    setStep(step + 1)
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

  return (
    <ForgotPasswordRoot>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <JustifyBox p={4}>
              <img
                width="300"
                src="/assets/images/illustrations/dreamer.svg"
                alt=""
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
                  </Stack>
                  <MuiButton
                    fullWidth
                    title="Tiếp tục"
                    variant="contained"
                    color="primary"
                    type="submit"
                  />

                  <MuiButton
                    fullWidth
                    title="Quay lại"
                    color="primary"
                    variant="outlined"
                    onClick={handleGoBack}
                    sx={{ mt: 2 }}
                  />
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
