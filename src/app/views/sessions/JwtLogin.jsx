import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Card, Grid, IconButton, Typography } from '@mui/material'
import { Box, Stack, styled, useTheme } from '@mui/system'
import { MuiCheckBox } from 'app/components/common/MuiRHFCheckbox'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { Span } from 'app/components/Typography'
import useAuth from 'app/hooks/useAuth'
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
  background: '#2F9B42', //'#1A2038',
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
  email: 'nghiepbv2@fpt.com.vn',
  password: 'Nghiepbv91',
  rememberMe: false,
}

// form field validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: Yup.string()
    .matches('^(?=.*?[a-z])(?=.*?[0-9]).{8,32}$', 'Mật khẩu không hợp lệ')
    .required('Mật khẩu là bắt buộc'),
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
              <MuiTypography variant="h6">Hệ thống quản trị</MuiTypography>
              <StyledSpan className="sidenavHoverShow pb-3">CampDi</StyledSpan>
              <img
                src="/assets/images/login/bg-login.png"
                width="100%"
                alt=""
              />
            </JustifyBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
              <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
                <FormProvider {...methods}>
                  <Stack>
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
                  </Stack>
                  <Stack pt={2}>
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
