import { Box, Button, Icon, Stack, styled, Typography } from '@mui/material'
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

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <NotFoundRoot gap={4} flexDirection={{ xs: 'column', md: 'row' }} p={2}>
      <Stack gap={1.5}>
        <Typography variant="h3">Trang không tồn tại</Typography>
        <Typography variant="body1" fontWeight={500}>
          Bạn không thể truy cập chức năng này, vui lòng liên hệ quản trị viên
          để được hỗ trợ.
        </Typography>
        <Box py={3}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1, height: '56px' }}
            onClick={() => navigate('', {})}
          >
            Quay lại trang chủ
          </Button>
        </Box>
      </Stack>
      <JustifyBox>
        <IMG src="/assets/images/403-forbidden.webp" alt="" />
      </JustifyBox>
    </NotFoundRoot>
  )
}

export default NotFound
