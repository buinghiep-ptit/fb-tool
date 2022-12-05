import {
  Box,
  Button,
  Grid,
  FormHelperText,
  styled,
  TextField,
  Icon,
  LinearProgress,
} from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { createMerchant } from 'app/apis/merchant/merchant.service'
import { toastError, toastSuccess } from 'app/helpers/toastNofication'
import { generate } from 'generate-password'

import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { cloneDeep } from 'lodash'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function CreateMerchant(props) {
  const navigate = useNavigate()
  const [contractList, setContractList] = React.useState([])
  const [documentList, setDocumentList] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const schema = yup
    .object({
      password: yup
        .string()
        .required('Vui lòng nhập password')
        .min(8, 'Có ít nhất 8 ký tự')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, 'Có chữ và số')
        .max(32, 'Đã đạt số ký tự tối đa'),
      nameMerchant: yup
        .string()
        .required('Vui lòng nhập tên đối tác')
        .trim()
        .max(255, 'Tên đối tác không được vượt quá 255 ký tự'),
      merchantType: yup.string().required('Vui lòng chọn loại đối tác'),
      email: yup
        .string()
        .required('Vui lòng nhập email')
        .email('Vui lòng đúng email')
        .max(255, 'Email không được vượt quá 255 ký tự'),
      mobilePhone: yup
        .string()
        .required('Vui lòng nhập số điện thoại')
        .matches(/^[0-9]*$/, 'Chỉ nhập số')
        .max(10, 'Số điện thoại không được vượt quá 10 ký tự'),
      status: yup.string().required('Vui lòng chọn trạng thái'),
      website: yup
        .string()
        .url()
        .max(255, 'Website không được vượt quá 255 ký tự'),
      taxCode: yup
        .string()
        .max(255, 'Mã số thuế không được vượt quá 255 ký tự'),
      businessModel: yup
        .string()
        .max(500, 'Mô hình kinh doanh không được vượt quá 500 ký tự'),
      address: yup.string().max(255, 'Địa chỉ không được vượt quá 255 ký tự'),
      representative: yup
        .string()
        .required('Vui lòng nhập người đại diện')
        .max(255, 'Tên người đại diện không được vượt quá 255 ký tự'),
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

  const uploadFile = async file => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const token = window.localStorage.getItem('accessToken')
      const res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_UPLOAD_URL}/api/file/upload`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      setIsLoading(false)
      if (res) {
        return res.data
      }
      return []
    } catch (e) {
      setIsLoading(false)
      console.log(e)
    }
  }

  const downloadFile = (url, name) => {
    const arr = url.split('.')
    const type = arr[arr.length - 1]
    try {
      const token = window.localStorage.getItem('accessToken')
      const config = { responseType: 'blob' }
      axios({
        method: 'get',
        url,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      }).then(response => {
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data)
        console.log(response.data)
        // create "a" HTML element with href to file & click
        const link = document.createElement('a')
        link.href = href
        link.setAttribute('download', `${name}`) //or any other extension
        document.body.appendChild(link)
        link.click()

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link)
        URL.revokeObjectURL(href)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const onSubmit = async data => {
    setIsLoading(true)
    const newData = new Object()
    newData.name = data.nameMerchant
    newData.merchantType = data.merchantType
    newData.email = data.email
    newData.status = parseInt(data.status)
    newData.password = data.password
    newData.mobilePhone = data.mobilePhone
    newData.website = data.website || null
    newData.contractNo = data.taxCode || null
    newData.businessCode = data.businessModel || null
    newData.represent = data.representative
    newData.address = data.address || null
    newData.contracts = contractList.map(contract => {
      return {
        mediaType: 4,
        mediaFormat: 3,
        url: contract.url,
      }
    })
    newData.paperWorks = documentList.map(document => {
      return {
        mediaType: 5,
        mediaFormat: 3,
        url: document.url,
      }
    })
    const res = await createMerchant(newData)
    setIsLoading(false)
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
    <>
      {isLoading && (
        <Box
          sx={{
            width: '100%',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '1000',
          }}
        >
          <LinearProgress />
        </Box>
      )}
      <Container>
        <Box className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              { name: 'Quản lý đối tác', path: '/quan-ly-thong-tin-doi-tac' },
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
                      error={!!errors?.nameMerchant}
                      helperText={errors?.nameMerchant?.message}
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
                    <FormControl
                      style={{ width: '50%' }}
                      margin="normal"
                      error={!!errors?.merchantType}
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
                        <MenuItem value={0}></MenuItem>
                        <MenuItem value={1}>Điểm camp</MenuItem>
                        <MenuItem value={2}>Nhà cung cấp</MenuItem>
                      </Select>
                      {!!errors?.merchantType?.message && (
                        <FormHelperText>
                          {errors?.merchantType.message}
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
                      style={{ width: '50%' }}
                      error={!!errors?.email}
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
                      style={{ width: '50%' }}
                      error={!!errors.password}
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
                      style={{ width: '50%' }}
                      error={!!errors.mobilePhone}
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
                      style={{ width: '50%' }}
                      error={!!errors.website}
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
                      style={{ width: '50%' }}
                      error={!!errors.taxCode}
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
                      error={!!errors.businessModel}
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
                  onChange={async e => {
                    console.log('xx')
                    if (
                      document.getElementById('upload-contract').files[0].size >
                      20000000
                    ) {
                      console.log(
                        document.getElementById('upload-contract').files[0]
                          .size,
                      )
                      toastError({ message: 'Dung lượng file vượt quá 20mb' })
                      return
                    }
                    const file = await uploadFile(
                      document.getElementById('upload-contract').files[0],
                    )
                    if (file?.code === '400') {
                      e.target.value = null
                      toastError({ message: file?.errorDescription })
                      return
                    }
                    setContractList([...contractList, file])
                  }}
                  style={{ display: 'none' }}
                />
                {contractList.map((contractFile, index) => (
                  <div
                    style={{ display: 'flex', alignItems: 'center' }}
                    key={contractFile.filename}
                  >
                    <p
                      onClick={() => {
                        downloadFile(contractFile.url, documentFile.filename)
                      }}
                      style={{
                        textDecoration: 'underline',
                        color: '#07bc0c',
                        cursor: 'pointer',
                      }}
                    >
                      {contractFile.filename}
                    </p>
                    <Icon
                      color="error"
                      onClick={() => {
                        const newArr = cloneDeep(contractList)
                        newArr.splice(index, 1)
                        setContractList([...newArr])

                        document.getElementById('upload-contract').value = null
                      }}
                    >
                      delete
                    </Icon>
                  </div>
                ))}
              </Grid>
              <Grid item xs={12} md={12}>
                <Controller
                  name="representative"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      style={{ width: '50%' }}
                      error={!!errors.representative}
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
                  onChange={async e => {
                    if (
                      document.getElementById('upload-document').files[0].size >
                      20000000
                    ) {
                      console.log(
                        document.getElementById('upload-document').files[0]
                          .size,
                      )
                      toastError({ message: 'Dung lượng file vượt quá 20mb' })
                      return
                    }
                    const file = await uploadFile(
                      document.getElementById('upload-document').files[0],
                    )
                    if (file?.code === '400') {
                      e.target.value = null
                      toastError({ message: file?.errorDescription })
                      return
                    }
                    setDocumentList([...documentList, file])
                    e.target.value = null
                  }}
                  style={{ display: 'none' }}
                />
                {documentList.map((documentFile, index) => (
                  <div
                    style={{ display: 'flex', alignItems: 'center' }}
                    key={documentFile.filename}
                  >
                    <p
                      onClick={() => {
                        downloadFile(documentFile.url, documentFile.filename)
                      }}
                      style={{
                        textDecoration: 'underline',
                        color: '#07bc0c',
                        cursor: 'pointer',
                      }}
                    >
                      {documentFile.filename}
                    </p>
                    <Icon
                      color="error"
                      onClick={() => {
                        const newArr = cloneDeep(documentList)
                        newArr.splice(index, 1)
                        setDocumentList([...newArr])
                        document.getElementById('upload-document').value = null
                      }}
                    >
                      delete
                    </Icon>
                  </div>
                ))}
              </Grid>
              <Grid item xs={12} md={12}>
                <Controller
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <TextField
                      error={!!errors.address}
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
              <Grid item xs={12} md={12}>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormControl
                      sx={{ minWidth: 200, mb: 5, mt: 1 }}
                      error={!!errors?.status}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Trạng thái
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Trạng thái"
                      >
                        <MenuItem value={1}>Hoạt động</MenuItem>
                        <MenuItem value={-2}>Không hoạt động</MenuItem>
                      </Select>
                      {!!errors?.status?.message && (
                        <FormHelperText>
                          {errors?.status.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>

            <Button
              color="primary"
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              Lưu
            </Button>
            <Button
              sx={{ ml: 2 }}
              color="primary"
              variant="contained"
              onClick={() => {
                navigate('/quan-ly-thong-tin-doi-tac')
              }}
            >
              Hủy
            </Button>
          </form>
        </SimpleCard>
      </Container>
    </>
  )
}
