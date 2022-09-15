import * as React from 'react'
import {
  Box,
  Button,
  Grid,
  Icon,
  styled,
  Table,
  InputLabel,
  Autocomplete,
  TextField,
} from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import { Span } from 'app/components/Typography'
import UploadImage from 'app/components/common/uploadImage'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

// form field validation schema
// const validationSchema = Yup.object().shape({
//   password: Yup.string()
//     .min(6, 'Password must be 6 character length')
//     .required('Password is required!'),
// })

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}))
export default function ServiceDetail(props) {
  const Listplace = [
    { label: 'Hà Nội' },
    { label: 'Hà Nam' },
    { label: 'Sóc Sơn' },
  ]

  const Listservice = [
    { label: 'Gói dịch vụ' },
    { label: 'Lưu trú' },
    { label: 'Khác' },
  ]
  const calendar = [
    'Thứ 2:',
    'Thứ 3:',
    'Thứ 4:',
    'Thứ 5:',
    'Thứ 6:',
    'Thứ 7:',
    'Chủ nhật:',
  ]

  const status = [{ label: 'Hiệu lực' }, { label: 'Không hiệu lực' }]
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Chi tiết dịch vụ' }]} />
      </Box>

      <SimpleCard>
        <Grid container>
          <Grid item xs={2}>
            <StyledButton variant="contained" color="primary">
              Lưu
            </StyledButton>
          </Grid>

          <Grid item xs={2}>
            <StyledButton variant="contained" color="primary">
              Huỷ
            </StyledButton>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ marginLeft: '8px', marginTop: '10px ' }}
          rowSpacing={1}
        >
          <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <InputLabel
              required
              sx={{ color: 'Black', fontSize: '15px', fontWeight: '500' }}
            >
              Địa điểm camp:
            </InputLabel>
          </Grid>
          <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
            <Autocomplete
              disablePortal
              id="list-place"
              options={Listplace}
              sx={{ marginRight: 5, width: '75%' }}
              renderInput={params => (
                <TextField {...params} label="Điểm camp" margin="normal" />
              )}
            />
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <InputLabel
              required
              sx={{
                color: 'Black',
                fontSize: '15px',
                fontWeight: '500',
              }}
            >
              Loại dịch vụ:
            </InputLabel>
          </Grid>
          <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
            <Autocomplete
              disablePortal
              id="list-service"
              options={Listservice}
              sx={{ marginRight: 5, width: '75%' }}
              renderInput={params => (
                <TextField {...params} label="Loại dịch vụ" margin="normal" />
              )}
            />
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <InputLabel
              required
              sx={{
                color: 'Black',
                fontSize: '15px',
                fontWeight: '500',
              }}
            >
              Áp dụng:
            </InputLabel>
          </Grid>
          <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              sx={{
                marginRight: 2,
                marginTop: 2,
                marginBottom: 1,
                width: '50%',
              }}
            />
            <Span>(Người/Sản phẩm)</Span>
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <InputLabel
              required
              sx={{
                color: 'Black',
                fontSize: '15px',
                fontWeight: '500',
              }}
            >
              Tên dịch vụ:
            </InputLabel>
          </Grid>
          <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              sx={{
                marginRight: 2,
                width: '50%',
                marginTop: 2,
                marginBottom: 1,
              }}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <InputLabel
              sx={{
                color: 'Black',
                fontSize: '15px',
                fontWeight: '500',
              }}
            >
              Mô tả
            </InputLabel>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id="outlined-multiline-static"
              multiline
              rows={10}
              sx={{ width: '75%' }}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <InputLabel
              sx={{
                color: 'Black',
                fontSize: '15px',
                fontWeight: '500',
              }}
            >
              Hình ảnh:
            </InputLabel>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <UploadImage></UploadImage>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <InputLabel
              sx={{
                color: 'Black',
                fontSize: '15px',
                fontWeight: '500',
              }}
            >
              Giá dịch vụ:
            </InputLabel>
          </Grid>

          {calendar.map((date, index) => (
            <Grid
              container
              sx={{ display: 'flex', alignItems: 'center' }}
              key={index}
            >
              <Grid item xs={2}>
                <InputLabel
                  sx={{
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  {date}
                </InputLabel>
              </Grid>
              <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  variant="outlined"
                  sx={{
                    marginRight: 3,
                    marginTop: 2,
                    marginBottom: 1,
                    width: '50%',
                  }}
                />
                <Span>(VNĐ/Ngày)</Span>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <InputLabel
              sx={{
                color: 'Black',
                fontSize: '15px',
                fontWeight: '500',
              }}
            >
              Trạng thái:
            </InputLabel>
          </Grid>
          <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
            <Autocomplete
              disablePortal
              id="status"
              options={status}
              sx={{ marginRight: 5, width: '75%' }}
              renderInput={params => (
                <TextField {...params} label="Trạng thái" margin="normal" />
              )}
            />
          </Grid>
        </Grid>

        <Grid container sx={{ marginTop: '20px ' }}>
          <Grid item xs={2}>
            <StyledButton variant="contained" color="primary">
              Lưu
            </StyledButton>
          </Grid>
          <Grid item xs={2}>
            <StyledButton variant="contained" color="primary">
              Huỷ
            </StyledButton>
          </Grid>
        </Grid>
      </SimpleCard>
    </Container>
  )
}
