import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid, MenuItem, styled, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { Breadcrumb, SimpleCard } from 'app/components'
import FormInputText from 'app/components/common/MuiInputText'
import { MuiCheckBox } from 'app/components/common/MuiCheckbox'
import { SelectDropDown } from 'app/components/common/MuiSelectDropdown'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useState } from 'react'
import { MuiButton } from 'app/components/common/MuiButton'
export interface Props {}

type ISearchFilters = {
  email: string
  hashtag: string
  status: string
  range: string
  feedcamp: boolean
}
const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))
const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}))

export default function ManagerFeed(props: Props) {
  const [defaultValues] = useState<ISearchFilters>({
    email: 'nghiepbv2',
    hashtag: '#nghiepbv2',
    status: 'all',
    range: 'public',
    feedcamp: false,
  })

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .min(0, 'PhoneNumber must be at least 10 characters')
      .max(256, 'PhoneNumber must be at almost 10 characters'),
    hashtag: Yup.string()
      .min(0, 'Password must be at least 8 characters')
      .max(256, 'Password must be at almost 32 characters'),
  })

  const methods = useForm<ISearchFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const onSubmitHandler: SubmitHandler<ISearchFilters> = (
    values: ISearchFilters,
  ) => {
    console.log('values:', values)
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý Feed' }]} />
      </Box>
      <SimpleCard title="Simple Table">
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Email, SĐT, Tên hiển thị
                </MuiTypography>
                <FormInputText
                  type="text"
                  name="email"
                  size="small"
                  placeholder="Nhập email, sđt, tên"
                  fullWidth
                  // focused
                  // required
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Hashtag
                </MuiTypography>
                <FormInputText
                  type="text"
                  name="hashtag"
                  placeholder="Nhập hashtag"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Phạm vi
                </MuiTypography>
                <SelectDropDown name="status">
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="approved">Đã duyệt</MenuItem>
                  <MenuItem value="pending">Chờ hậu kiểm</MenuItem>
                  <MenuItem value="infringe">Vi phạm</MenuItem>
                  <MenuItem value="remove">Xoá</MenuItem>
                </SelectDropDown>
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Trạng thái
                </MuiTypography>
                <SelectDropDown name="range" disabled>
                  <MenuItem value="public">Công khai</MenuItem>
                  <MenuItem value="friends">Bạn bè</MenuItem>
                  <MenuItem value="me">Chỉ mình tôi</MenuItem>
                </SelectDropDown>
              </Grid>

              <Grid item sm={3} xs={12}>
                <MuiCheckBox name="feedcamp" />
              </Grid>
            </Grid>
          </FormProvider>
          <Box py={2}>
            <Grid container spacing={2}>
              <Grid item sm={4} xs={12}>
                <MuiButton
                  title="Tìm kiếm"
                  variant="outlined"
                  color="primary"
                  type="submit"
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <MuiButton
                  title="Hậu kiểm"
                  variant="outlined"
                  color="secondary"
                  type="submit"
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <MuiButton
                  title="Báo cáo vi phạm"
                  variant="outlined"
                  color="error"
                  type="submit"
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </Box>
        </form>
      </SimpleCard>
    </Container>
  )
}
