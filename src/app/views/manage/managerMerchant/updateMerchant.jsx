import { Box, Button, Grid, styled, TextField } from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'

import { useParams, useNavigate } from 'react-router-dom'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  getDetailMerchant,
  updateDetailMerchant,
  updateMerchantStatus,
} from 'app/apis/merchant/merchant.service'
import { toastError, toastSuccess } from 'app/helpers/toastNofication'

import axios from 'axios'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function UpdateMerchant(props) {
  const [statusMerchant, setStatusMerchant] = React.useState()

  const schema = yup
    .object({
      nameMerchant: yup.string().required('Vui lòng nhập tên đối tác').trim(),
      merchantType: yup.number().required(),
      email: yup
        .string()
        .required('Vui lòng nhập email')
        .email('Vui lòng đúng email'),
      mobilePhone: yup.string().required('Vui nhập số điện thoại').max(20),
      website: yup.string().url('Vui lòng nhập đường dẫn website'),
      taxCode: yup.string().required(),
      businessModel: '',
      address: yup.string().required(),
      representative: yup.string().required(),
    })
    .required()

  const navigate = useNavigate()
  const params = useParams()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
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
    const filesContract = document.getElementById('upload-contract').files
    const filesDocument = document.getElementById('upload-document').files

    const newData = new Object()
    newData.name = data.nameMerchant
    newData.merchantType = data.merchantType
    newData.email = data.email
    newData.mobilePhone = data.mobilePhone
    newData.website = data.website
    newData.contractNo = data.taxCode
    newData.businessCode = data.businessModel
    newData.represent = data.representative
    newData.address = data.address

    if (filesContract.length > 0) {
      const contracts = await uploadFile(filesContract)
      newData.contracts = contracts?.map(contract => {
        return {
          mediaType: 4,
          mediaFormat: 3,
          url: contract,
        }
      })
    } else {
      newData.contracts = []
    }

    if (filesDocument.length > 0) {
      const documents = await uploadFile(filesDocument)
      newData.paperWorks = documents?.map(document => {
        return {
          mediaType: 5,
          mediaFormat: 3,
          url: document,
        }
      })
    } else {
      newData.paperWorks = []
    }

    const res = await updateDetailMerchant(params.id, newData)
    if (res.error) {
      toastError({ message: res.errorDescription })
      return
    }
    toastSuccess({ message: 'Thông tin đã cập nhật thành công' })
    navigate('/quan-ly-thong-tin-doi-tac')
  }

  const fetchDetailMerchant = async () => {
    console.log(params.id)
    const res = await getDetailMerchant(params.id)
    if (res) {
      setStatusMerchant(res.status)
      setValue('address', res.address)
      setValue('businessModel', res.businessCode)
      setValue('taxCode', res.contractNo)
      setValue('nameMerchant', res.name)
      setValue('email', res.email)
      setValue('merchantType', res.merchantType)
      setValue('mobilePhone', res.mobilePhone)
      setValue('representative', res.represent)
      setValue('website', res.website)
    }
  }

  React.useEffect(() => {
    fetchDetailMerchant()
  }, [])

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý địa danh', path: '/quan-ly-thong-tin-doi-tac' },
            { name: 'Thông tin đối tác' },
          ]}
        />
      </Box>
      <SimpleCard title="Thông tin đối tác">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container>
            <Grid item xs={10} md={10}>
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
            <Grid item xs={2} md={2} style={{ textAlign: 'right' }}>
              {statusMerchant === 1 ? (
                <Button variant="contained">Hoạt động</Button>
              ) : (
                <Button variant="contained" disabled>
                  Khóa
                </Button>
              )}
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="merchantType"
                control={control}
                render={({ field }) => (
                  <FormControl
                    style={{ width: '150px' }}
                    margin="normal"
                    error={errors.merchantType}
                  >
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
                      <MenuItem value={1}>Điểm camp</MenuItem>
                      <MenuItem value={2}>Nhà cung cấp</MenuItem>
                    </Select>
                    {errors.merchantType && (
                      <FormHelperText>
                        Vui lòng nhập loại đối tác
                      </FormHelperText>
                    )}
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
                    label="Mô hình kinh doanh*"
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
                    label="Người đại diện"
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
            <Grid item xs={12} md={12} style={{ marginTop: '50px' }}>
              <Button
                color="primary"
                type="submit"
                variant="contained"
                style={{ marginRight: '15px' }}
              >
                Lưu
              </Button>
              <Button
                color="primary"
                variant="contained"
                style={{ marginRight: '15px' }}
                disabled={statusMerchant !== 1}
                onClick={async () => {
                  const res = await updateMerchantStatus(params.id)
                  if (res) {
                    setStatusMerchant(0)
                    toastSuccess({ message: 'Đã khóa đối tác' })
                  }
                }}
              >
                Khóa
              </Button>
              <Button
                color="primary"
                variant="contained"
                style={{ marginRight: '15px' }}
              >
                Đổi mật khẩu
              </Button>
            </Grid>
          </Grid>
        </form>
      </SimpleCard>
    </Container>
  )
}
