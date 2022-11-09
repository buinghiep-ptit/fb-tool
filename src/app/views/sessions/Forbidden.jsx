import { Box, Icon, Stack, styled } from '@mui/material'
import { MuiButton } from 'app/components/common/MuiButton'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { useNavigate } from 'react-router-dom'

const FlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
  maxWidth: 400,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}))

const IMG = styled('img')(() => ({
  width: '100%',
}))

const NotFoundRoot = styled(FlexBox)(() => ({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh !important',
}))

const Forbidden = () => {
  const navigate = useNavigate()

  return (
    <NotFoundRoot gap={4}>
      <Stack gap={1.5}>
        <MuiTypography variant="h3">Không có quyền truy cập</MuiTypography>
        <MuiTypography variant="body1" fontWeight={500}>
          Bạn không có quyền truy cập chức năng này, vui lòng liên hệ quản trị
          viên để được hỗ trợ.
        </MuiTypography>
        <Box py={3}>
          <MuiButton
            title="Quay lại trang chủ"
            variant="contained"
            color="primary"
            onClick={() => navigate('/', {})}
            startIcon={<Icon>keyboard_return</Icon>}
          />
        </Box>
      </Stack>
      <JustifyBox>
        <IMG src="/assets/images/app/403-forbidden.png" alt="" />
      </JustifyBox>
    </NotFoundRoot>
  )
}

export default Forbidden
