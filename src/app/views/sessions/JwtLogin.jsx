import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Card, Grid, IconButton } from '@mui/material'
import { Box, Stack, styled, useTheme } from '@mui/system'
import { MuiCheckBox } from 'app/components/common/MuiRHFCheckbox'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { Span } from 'app/components/Typography'
import useAuth from 'app/hooks/useAuth'
import { messages } from 'app/utils/messages'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }))

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: 'center',
  flexDirection: 'column',
}))

const ContentBox = styled(Box)(() => ({
  height: '100%',
  padding: '32px',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)',
}))

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 36,
  fontFamily: 'Caveat',
  fontWeight: 900,
  display: mode === 'compact' ? 'none' : 'block',
}))

const JWTRoot = styled(JustifyBox)(() => ({
  // background: '#BD0F14', //'#1A2038',
  backgroundImage: `url('/assets/images/login/bg-login.png')`,
  backgroundRepeat: 'no-repeat',
  minHeight: '100% !important',
  '& .card': {
    maxWidth: 800,
    minHeight: 400,
    margin: '1rem',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
  },
}))

// inital login credentials
const defaultValues = {
  email: '',
  password: '',
  rememberMe: false,
}

// form field validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string().email(messages.MSG12).required(messages.MSG1),
  password: Yup.string().required(messages.MSG1),
  // .required(messages.MSG1)
  // .test('latinChars', messages.MSG21, value => {
  //   const regexStr = /^[\x20-\x7E]+$/
  //   return regexStr.test(value)
  // })
  // .matches(/^\S*$/, messages.MSG21)
  // .matches(
  //   // '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&*()+=]).{8,20}$',
  //   // `Should contains at least 8 characters and at most 20 characters\n
  //   // Should contains at least one digit\n
  //   // Should contains at least one upper case alphabet\n
  //   // Should contains at least one lower case alphabet\n
  //   // Should contaregexStr = /[A-z\u00C0-\u00ff]+/gins at least one special character which includes !@#$%&*()+=^\n
  //   // Should doesn't contain any white space`,
  //   /^(?=.*?[a-z])(?=.*?[0-9]).{8,32}$/g,
  //   messages.MSG20,
  // ),
})

const JwtLogin = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState({
    visibility: false,
  })
  const { login } = useAuth()

  const location = useLocation()
  const from = location.state?.from || '/'

  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const onSubmitHandler = async values => {
    setLoading(true)
    try {
      await login(values)
      navigate(from, { replace: true })
    } catch (error) {
      if (error.data && error.data.error !== 'ACCOUNT_NOT_ACTIVE')
        methods.setError('password', { message: messages.MSG9 })
      setLoading(false)
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(prev => ({
      ...prev,
      visibility: !prev.visibility,
    }))
  }

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
              <img src="/assets/images/login/logo.png" width="100%" alt="" />
            </JustifyBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
              <form
                onSubmit={methods.handleSubmit(onSubmitHandler)}
                noValidate
                autoComplete="off"
              >
                <FormProvider {...methods}>
                  <Stack>
                    <FormInputText
                      type="text"
                      name="email"
                      label={'Email'}
                      placeholder="Nhập email"
                      fullWidth
                      clearIcon={false}
                    />
                  </Stack>
                  <Stack pt={2}>
                    <FormInputText
                      type={showPassword.visibility ? 'text' : 'password'}
                      name="password"
                      placeholder="Nhập mật khẩu"
                      label={'Mật khẩu'}
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

                  <Stack
                    direction={'row'}
                    justifyContent="space-between"
                    alignItems={'center'}
                    py={2}
                  >
                    <MuiCheckBox name="rememberMe" label="Ghi nhớ tôi" />
                    <NavLink
                      to="/session/forgot-password"
                      style={{ color: theme.palette.primary.main }}
                    >
                      Quên mật khẩu
                    </NavLink>
                  </Stack>

                  <LoadingButton
                    type="submit"
                    color="primary"
                    loading={loading}
                    variant="contained"
                    sx={{ width: '100%', my: 1, height: 52 }}
                  >
                    Đăng nhập
                  </LoadingButton>
                </FormProvider>
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot>
  )
}

export default JwtLogin
