import { Box, Button, Grid, Icon, styled, TextField } from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'
import { cloneDeep } from 'lodash'
import { useParams, useNavigate } from 'react-router-dom'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import DialogCustom from 'app/components/common/DialogCustom'
import {
  getDetailMerchant,
  updateDetailMerchant,
} from 'app/apis/merchant/merchant.service'
import { toastError, toastSuccess } from 'app/helpers/toastNofication'
import { useState, useRef } from 'react'
import axios from 'axios'
import { generate } from 'generate-password'
import ChangePasswordMerchant from './changePasswordMerchant'
import { compressImageFile } from 'app/helpers/extractThumbnailVideo'
const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function UpdateMerchant(props) {
  const [statusMerchant, setStatusMerchant] = useState()
  const [contractList, setContractList] = useState([])
  const [documentList, setDocumentList] = useState([])
  const [passwordReset, setPasswordReset] = useState()
  const [noteChangePass, setNoteChangePass] = useState()
  const dialogConfirm = useRef(null)
  const schema = yup
    .object({
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
        .required('Vui nhập số điện thoại')
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
      merchantType: '',
      email: '',
      password: '',
      mobilePhone: '',
      website: '',
      taxCode: '',
      businessModel: '',
      address: '',
      representative: '',
      status: '',
    },
  })

  const uploadFile = async file => {
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
      if (res) {
        return res.data
      }
      return []
    } catch (e) {
      console.log(e)
    }
  }

  const downloadFile = (url, name) => {
    const arr = url.split('.')
    const type = arr[arr.length - 1]
    try {
      const token = window.localStorage.getItem('accessToken')
      axios({
        method: 'get',
        url,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      }).then(response => {
        const href = URL.createObjectURL(response.data)
        console.log(response.data)
        const link = document.createElement('a')
        link.href = href
        link.setAttribute('download', name)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(href)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const onSubmit = async data => {
    console.log('xxx')
    const newData = new Object()
    newData.status = parseInt(data.status)
    newData.name = data.nameMerchant
    newData.merchantType = data.merchantType
    newData.email = data.email
    newData.mobilePhone = data.mobilePhone
    newData.website = data.website.trim() === '' ? null : data.website.trim()
    newData.contractNo = data.taxCode.trim() === '' ? null : data.taxCode.trim()
    newData.businessCode =
      data.businessModel.trim() === '' ? null : data.businessModel.trim()
    newData.represent = data.representative
    newData.address = data.address.trim() === '' ? null : data.address.trim()

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

    const res = await updateDetailMerchant(params.id, newData)
    if (res.error) {
      toastError({ message: res.errorDescription })
      return
    }
    toastSuccess({ message: 'Thông tin đã cập nhật thành công' })
    navigate('/quan-ly-thong-tin-doi-tac')
  }

  const fetchDetailMerchant = async () => {
    const res = await getDetailMerchant(params.id)
    if (res) {
      setStatusMerchant(res.status)
      setValue('address', res.address || '')
      setValue('businessModel', res.businessCode || '')
      setValue('taxCode', res.contractNo || '')
      setValue('nameMerchant', res.name)
      setValue('email', res.email || '')
      setValue('merchantType', res.merchantType)
      setValue('mobilePhone', res.mobilePhone || '')
      setValue('representative', res.represent)
      setValue('website', res.website || '')
      setValue('status', res.status)
      const defaultContracts = res.contracts.map(item => {
        const arr = item.url.split('/')
        return {
          filename: arr[arr.length - 1],
          url: item.url,
        }
      })
      const defaultDocuments = res.paperWorks.map(item => {
        const arr = item.url.split('/')
        return {
          filename: arr[arr.length - 1],
          url: item.url,
        }
      })
      setContractList(defaultContracts)
      setDocumentList(defaultDocuments)
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
            { name: 'Quản lý đối tác', path: '/quan-ly-thong-tin-doi-tac' },
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
                  Không hoạt động
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
                    error={!!errors.businessModel}
                    helperText={errors?.businessModel?.message}
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
                  if (
                    document.getElementById('upload-contract').files[0].size >
                    20000000
                  ) {
                    console.log(
                      document.getElementById('upload-contract').files[0].size,
                    )
                    toastError({ message: 'Dung lượng file vượt quá 20mb' })
                    return
                  }
                  const file = await uploadFile(
                    document.getElementById('upload-contract').files[0],
                  )
                  console.log(file)
                  if (file?.code === '400') {
                    e.target.value = null
                    toastError({ message: file?.errorDescription })
                    return
                  }

                  setContractList([file, ...contractList])
                }}
                style={{ display: 'none' }}
              />
              {contractList.map((contractFile, index) => (
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                  key={contractFile.filename + index}
                >
                  <p
                    onClick={() => {
                      downloadFile(contractFile.url, contractFile.filename)
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
                onChange={async e => {
                  if (
                    document.getElementById('upload-document').files[0].size >
                    20000000
                  ) {
                    console.log(
                      document.getElementById('upload-document').files[0].size,
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
                  setDocumentList([file, ...documentList])
                }}
                style={{ display: 'none' }}
              />
              {documentList.map((documentFile, index) => (
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                  key={documentFile.filename + index}
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
                      Trạng thái*
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
                      <FormHelperText>{errors?.status.message}</FormHelperText>
                    )}
                  </FormControl>
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
                onClick={() => {
                  dialogConfirm.current.handleClickOpen()
                }}
              >
                Đổi mật khẩu
              </Button>
              <Button
                color="primary"
                variant="contained"
                style={{ marginRight: '15px' }}
                onClick={() => {
                  navigate('/quan-ly-thong-tin-doi-tac')
                }}
              >
                Quay lại
              </Button>
            </Grid>
          </Grid>
        </form>
        <DialogCustom ref={dialogConfirm} title="Xác nhận" maxWidth="md">
          <ChangePasswordMerchant
            handleClose={dialogConfirm?.current?.handleClose}
          />
        </DialogCustom>
      </SimpleCard>
    </Container>
  )
}
