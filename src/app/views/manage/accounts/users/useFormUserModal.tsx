import { yupResolver } from '@hookform/resolvers/yup'
import { Grid, LinearProgress, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import FormInputText from 'app/components/common/MuiInputText'
import { SelectDropDown } from 'app/components/common/MuiSelectDropdown'
import { MuiTypography } from 'app/components/common/MuiTypography'
import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

const useFormUserModal = (data?: any) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc'),
  })

  const methods = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const getContent = (isLoading: boolean) => {
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
          <Grid container alignItems={'center'} py={1}>
            <Grid item sm={4} xs={12}>
              <MuiTypography variant="subtitle2" pb={1}>
                Tên đăng nhập:*
              </MuiTypography>
            </Grid>
            <Grid item sm={8} xs={12}>
              <FormInputText
                type="email"
                name="email"
                size="small"
                placeholder="Nhập tên tài khoản"
                fullWidth
                defaultValue={data?.email ? data?.email : ''}
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
                defaultValue=""
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
              <SelectDropDown
                name="status"
                defaultValue={data?.status ? data?.status : 1}
              >
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={-1}>Không hoạt động</MenuItem>
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
              <SelectDropDown
                name="role"
                defaultValue={data?.role ? data?.role : 1}
              >
                <MenuItem value={1}>Admin</MenuItem>
                <MenuItem value={2}>CS</MenuItem>
                <MenuItem value={3}>Sale</MenuItem>
              </SelectDropDown>
            </Grid>
          </Grid>
        </FormProvider>
        {isLoading && <LinearProgress />}
      </Box>
    )
  }
  return [getContent, methods] as any
}

export default useFormUserModal
