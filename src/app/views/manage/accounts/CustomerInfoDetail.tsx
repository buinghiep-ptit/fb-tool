import { yupResolver } from '@hookform/resolvers/yup'
import { LockClockSharp, PasswordSharp, ReportSharp } from '@mui/icons-material'
import { Grid, MenuItem, styled } from '@mui/material'
import { Box } from '@mui/system'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiInputText'
import { SelectDropDown } from 'app/components/common/MuiSelectDropdown'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'
import * as Yup from 'yup'

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

type ISearchFilters = {
  account?: string
  email?: string
  role?: string
  status?: string
  page?: number
  rowsPerPage?: number
}

export interface Props {}

export default function CustomerDetail(props: Props) {
  const navigate = useNavigateParams()

  const [defaultValues] = useState<ISearchFilters>({
    role: 'all',
    status: 'all',
  })

  const [filters, setFilters] = useState<ISearchFilters>(defaultValues)

  const validationSchema = Yup.object().shape({
    account: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(256, 'hashtag must be at almost 256 characters'),
    email: Yup.string()
      .min(0, 'email must be at least 0 characters')
      .max(256, 'email must be at almost 256 characters'),
  })

  const methods = useForm<ISearchFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const onSubmitHandler: SubmitHandler<ISearchFilters> = (
    values: ISearchFilters,
  ) => {
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        ...values,
      }
    })
    navigate('', {
      ...filters,
      ...values,
    } as any)
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý KH', path: '/quan-ly-tai-khoan-khach-hang' },
            { name: 'Chi tiết', path: '/quan-ly-tai-khoan-khach-hang/1/info' },
            { name: 'Thông tin' },
          ]}
        />
      </Box>
      <SimpleCard title="Chi tiết KH">
        <NavLink to={'/quan-ly-tai-khoan-khach-hang/1/history'} replace={true}>
          <MuiButton
            title="History"
            variant="outlined"
            color="error"
            type="submit"
            sx={{ width: '100%' }}
            startIcon={<ReportSharp />}
          />
        </NavLink>

        <Box pt={3}>
          <Grid container spacing={2}>
            <Grid item sm={3} xs={12}>
              <MuiButton
                title="Khoá"
                variant="outlined"
                color="error"
                type="submit"
                sx={{ width: '100%' }}
                startIcon={<LockClockSharp />}
              />
            </Grid>
            <Grid item sm={6} xs={12}></Grid>
            <Grid item sm={3} xs={12}>
              <MuiButton
                onClick={() => {}}
                title="Đổi mật khẩu"
                variant="outlined"
                color="secondary"
                sx={{ width: '100%' }}
                startIcon={<PasswordSharp />}
              />
            </Grid>
          </Grid>
        </Box>

        <Box>
          <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
            <FormProvider {...methods}>
              <Grid container alignItems={'center'} py={1}>
                <Grid item sm={4} xs={12}>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Tên đăng nhập:*
                  </MuiTypography>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <FormInputText
                    type="text"
                    name="account"
                    size="small"
                    placeholder="Nhập tên tài khoản"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container alignItems={'center'} py={1}>
                <Grid item sm={4} xs={12}>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Email:*
                  </MuiTypography>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <FormInputText
                    type="email"
                    name="email"
                    placeholder="Nhập Email"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container alignItems={'center'} py={1}>
                <Grid item sm={4} xs={12}>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Họ và tên:*
                  </MuiTypography>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <FormInputText
                    type="text"
                    name="name"
                    placeholder="Nhập họ và tên"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container alignItems={'center'} py={1}>
                <Grid item sm={4} xs={12}>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Trạng thái:*
                  </MuiTypography>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <SelectDropDown name="status">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="de-active">Không hoạt động</MenuItem>
                  </SelectDropDown>
                </Grid>
              </Grid>
              <Grid container alignItems={'center'} py={1}>
                <Grid item sm={4} xs={12}>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Nhóm quyền:*
                  </MuiTypography>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <SelectDropDown name="role">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="sa">Super Admin</MenuItem>
                    <MenuItem value="operators">Vận hành</MenuItem>
                    <MenuItem value="operators">Sale</MenuItem>
                  </SelectDropDown>
                </Grid>
              </Grid>
            </FormProvider>
          </form>
        </Box>
      </SimpleCard>
    </Container>
  )
}
