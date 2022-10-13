import {
  Box,
  Button,
  Grid,
  Autocomplete,
  styled,
  TextField,
} from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'

import { createPlace } from 'app/apis/place/place.service'
import { useParams, useNavigate } from 'react-router-dom'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import { useForm, Controller } from 'react-hook-form'
import { object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { createMerchant } from 'app/apis/merchant/merchant.service'
import { toastError, toastSuccess } from 'app/helpers/toastNofication'
import { generate } from 'generate-password'
import { Upload } from '@mui/icons-material'

import axios from 'axios'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function CreateMerchant(props) {
  // const [contract, setContract] = React.useState()
  // const [document, setDocument] = React.useState()
  const schema = yup
    .object({
      nameMerchant: yup.string().required('Vui lòng nhập tên đối tác').trim(),
      merchantType: yup.number().required(),
      email: yup
        .string()
        .required('Vui lòng nhập email')
        .email('Vui lòng đúng email'),
      password: yup
        .string()
        .required()
        .min(8, 'Có ít nhất 8 ký tự')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, 'Có chữ và số'),
      mobilePhone: yup
        .string()
        .required('Vui nhập số điện thoại')
        .min(1)
        .max(20),
      website: yup.string().url(),
      representative: yup.string().required('Vui lòng nhập người đại diện'),
    })
    .required()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nameMerchant: '',
      merchantType: 0,
      email: '',
      password: '',
      mobilePhone: '',
      website: '',
      taxCode: '',
      businessModel: '',
      address: '',
      representative: '',
    },
  })

  const uploadFile = async files => {
    const fileUpload = [...files].map(file => {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const token = window.localStorage.getItem('accessToken')
        const res = axios({
          method: 'post',
          url: 'https://dev09-api.campdi.vn/upload/api/file/upload',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        })
        return res
      } catch (e) {
        console.log(e)
      }
    })

    const response = await Promise.all(fileUpload)
    if (response) return response.map(item => item.data.url)
  }

  const onSubmit = async data => {
    const contracts = await uploadFile(
      document.getElementById('upload-contract').files,
    )
    const documents = await uploadFile(
      document.getElementById('upload-document').files,
    )
    const newData = new Object()
    newData.name = data.nameMerchant
    newData.merchantType = data.merchantType
    newData.email = data.email
    newData.password = data.password
    newData.mobilePhone = data.mobilePhone
    newData.website = data.website || null
    newData.contractNo = data.taxCode || null
    newData.businessCode = data.businessModel || null
    newData.represent = data.representative
    newData.address = data.address || null
    newData.contracts = contracts.map(contract => {
      return {
        mediaType: 4,
        mediaFormat: 3,
        url: contract,
      }
    })
    newData.paperWorks = documents.map(document => {
      return {
        mediaType: 5,
        mediaFormat: 3,
        url: document,
      }
    })
    const res = await createMerchant(newData)
    if (res.error) {
      toastError({ message: res.errorDescription })
      return
    }
    toastSuccess({ message: 'Thêm đối tác thành công' })
    navigate('/quan-ly-thong-tin-doi-tac')
  }

  const generatePassword = () => {
    const password = generate({
      length: 8,
      numbers: true,
    })

    setValue('password', password + Math.floor(Math.random() * 10))
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý địa danh', path: '/quan-ly-thong-tin-doi-tac' },
            { name: 'Thêm đối tác' },
          ]}
        />
      </Box>
      <SimpleCard title="Thông tin đối tác">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Controller
                name="nameMerchant"
                control={control}
                render={({ field }) => (
                  <TextField
                    style={{ width: '50%' }}
                    error={errors.nameMerchant}
                    helperText={errors.nameMerchant?.message}
                    {...field}
                    label="Tên đối tác*"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="merchantType"
                control={control}
                render={({ field }) => (
                  <FormControl style={{ width: '150px' }} margin="normal">
                    <InputLabel id="demo-simple-select-label">
                      Loại đối tác*
                    </InputLabel>
                    <Select
                      style={{ width: '200px' }}
                      {...field}
                      label="Loại đối tác*"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                    >
                      <MenuItem value={0}></MenuItem>
                      <MenuItem value={1}>Điểm camp</MenuItem>
                      <MenuItem value={2}>Nhà cung cấp</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    style={{ width: '30%' }}
                    error={errors.email}
                    helperText={errors.email?.message}
                    {...field}
                    label="Email*"
                    margin="normal"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              style={{ alignItems: 'baseline', display: 'flex' }}
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    style={{ width: '30%' }}
                    error={errors.password}
                    helperText={errors.password?.message}
                    {...field}
                    label="Mật khẩu*"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Button
                color="primary"
                variant="contained"
                style={{ marginLeft: '15px' }}
                onClick={generatePassword}
              >
                Tạo tự động
              </Button>
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="mobilePhone"
                control={control}
                render={({ field }) => (
                  <TextField
                    style={{ width: '30%' }}
                    error={errors.mobilePhone}
                    helperText={errors.mobilePhone?.message}
                    {...field}
                    label="Số điện thoại*"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <TextField
                    style={{ width: '30%' }}
                    error={errors.website}
                    helperText={errors.website?.message}
                    {...field}
                    label="Website"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="taxCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    style={{ width: '30%' }}
                    error={errors.taxCode}
                    helperText={errors.taxCode?.message}
                    {...field}
                    label="Mã số thuế"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                control={control}
                name="businessModel"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    error={errors.businessModel}
                    helperText={errors.businessModel?.message}
                    {...field}
                    label="Mô hình kinh doanh"
                    margin="normal"
                    multiline
                    rows={10}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Button
                variant="outlined"
                onClick={() => {
                  document.getElementById('upload-contract').click()
                }}
              >
                Upload hợp đồng
              </Button>
              <input
                type="file"
                id="upload-contract"
                multiple
                style={{ display: 'none' }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="representative"
                control={control}
                render={({ field }) => (
                  <TextField
                    style={{ width: '30%' }}
                    error={errors.representative}
                    helperText={errors.representative?.message}
                    {...field}
                    label="Người đại diện*"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Button
                variant="outlined"
                onClick={() => {
                  document.getElementById('upload-document').click()
                }}
              >
                Upload giấy tờ
              </Button>
              <input
                type="file"
                id="upload-document"
                multiple
                style={{ display: 'none' }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <TextField
                    error={errors.address}
                    helperText={errors.address?.message}
                    {...field}
                    label="Địa chỉ"
                    margin="normal"
                    multiline
                    rows={10}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>

          <Button color="primary" type="submit" variant="contained">
            Lưu
          </Button>
        </form>
      </SimpleCard>
    </Container>
  )
}
