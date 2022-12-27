import {
  Button,
  Grid,
  Icon,
  Fab,
  TextField,
  Autocomplete,
  FormHelperText,
} from '@mui/material'
import { SimpleCard } from 'app/components'
import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { tableModelReview } from '../const'
import { Paragraph } from 'app/components/Typography'
import { useState } from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'
import DialogCustom from 'app/components/common/DialogCustom'
import {
  changeStatusReview,
  deleteCampGroundService,
  getListReview,
  getListCustomCampdi,
  addReview,
} from 'app/apis/campGround/ground.service'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import * as yup from 'yup'
import moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import UploadImage from 'app/components/common/uploadImage'
import { formatFile } from 'app/utils/constant'
import { compressImageFile } from 'app/helpers/extractThumbnailVideo'
import { messages } from 'app/utils/messages'
import axios from 'axios'
export default function ListReview(props) {
  const [inputFilter, setInputFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)
  const [starFilter, setStartFilter] = useState(null)
  const [listCampGroundReview, setListCampGroundReview] = useState([])
  const [totalListCampGroundReview, setTotalListCampgroundReview] = useState()
  const [isLoading, setIsLoading] = React.useState(false)
  const [listAccount, setListAccount] = useState([])
  const [rateArray, setRateArray] = useState(Array(5).fill('primary'))
  const params = useParams()
  const tableRef = React.useRef()
  const dialogCustomRef = React.useRef()
  const uploadImageRef = React.useRef()
  const schema = yup
    .object({
      account: yup.object().required(messages.MSG1),
      noteReview: yup.string().trim().max(150, 'Không được vượt quá 150 ký tự'),
      file: yup
        .mixed()
        .test('fileSize', 'Dung lượng file quá lớn', value => {
          if (value.length === 0) {
            return true
          }
          if (value.length > 0) {
            for (let i = 0; i < value.length; i++) {
              if (value[i].size > 50000000) return false
            }
            return true
          }
        })
        .test(
          'fileFormat',
          'Định dạng ảnh không phù hợp. Định dạng cho phép: Hình ảnh: “.png”, “.jpeg”, “.jpg”',
          value => {
            if (value.length === 0) {
              return true
            }
            if (value.length > 0) {
              for (let i = 0; i < value.length; i++) {
                const arrString = value[i].name.split('.')
                const type = arrString[arrString.length - 1]
                const checkList = formatFile.filter(
                  item => item == type.toLowerCase(),
                )
                if (checkList.length < 1) {
                  return false
                }
              }
              return true
            }
          },
        ),
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
      account: null,
      file: [],
    },
  })

  const fetchListCustomerCampdi = async () => {
    await getListCustomCampdi({ idCampGround: params.id }).then(data => {
      setListAccount(data)
    })
  }

  const fetchListCampGroundReview = async param => {
    await getListReview(params.id, param)
      .then(data => {
        const newList = cloneDeep(data.content).map(campGroundReview => {
          const convertCampGroundReview = {}
          convertCampGroundReview.id = campGroundReview.id
          convertCampGroundReview.idInfor = campGroundReview.idCustomer
          convertCampGroundReview.image = campGroundReview.imgUrl
          convertCampGroundReview.linkInfoBlank = {
            link: campGroundReview.cusName,
            path: `/quan-ly-tai-khoan-khach-hang/`,
          }
          convertCampGroundReview.star = campGroundReview.rating
          convertCampGroundReview.description = campGroundReview.comment
          convertCampGroundReview.time = moment(
            campGroundReview.dateCreated,
          ).format('DD/MM/YYYY hh:mm:ss')

          convertCampGroundReview.status =
            campGroundReview.status === 1 ? true : false

          convertCampGroundReview.linkViewBlank = {
            link: 'Chi tiết',
            path: '/quan-ly-danh-gia/',
          }
          return convertCampGroundReview
        })

        setListCampGroundReview(newList)
        setTotalListCampgroundReview(data.totalElements)
      })
      .catch(err => console.log(err))
  }

  const handleDataImageUpload = async () => {
    const introData = uploadImageRef.current.getFiles()

    const fileUploadImage = [...introData].map(async file => {
      if (file.type.startsWith('image/')) {
        const formData = new FormData()
        const newFile = await compressImageFile(file)
        formData.append('file', newFile)
        try {
          const token = window.localStorage.getItem('accessToken')
          const res = axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_UPLOAD_URL}/api/image/upload`,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
              srcType: 11,
            },
          })
          return await res
        } catch (e) {
          setIsLoading(false)
          console.log(e)
        }
      }
    })

    const responseImage = await Promise.all(fileUploadImage)

    const listUrl = new Object()
    if (responseImage) {
      if (responseImage.length > 0)
        listUrl.image = responseImage.map(item => item?.data.url)
    }
    return listUrl
  }

  const onSubmit = async data => {
    console.log(data)
    const listUrl = await handleDataImageUpload()
    let mediasUpdateImage = []
    if (listUrl?.image && listUrl?.image.length > 0) {
      mediasUpdateImage = (listUrl?.image || []).map((url, index) => {
        if (url) {
          const media = new Object()
          media.mediaType = 3
          media.mediaFormat = 2
          media.url = url
          return media
        }
      })
    }
    const paramDetail = {
      medias: [...mediasUpdateImage].filter(item => !!item),
      idCustomer: parseInt(data.account.idCustomer, 0),
      idCampGround: parseInt(params.id),
      rating: rateArray.filter(x => x === 'primary').length,
      comment: data.noteReview,
    }
    try {
      const res = await addReview(paramDetail)
      if (res) {
        const param = {
          search: inputFilter,
          star: starFilter == 0 ? null : starFilter,
          status: statusFilter == 0 ? null : statusFilter,
          page: 0,
          size: 20,
        }
        fetchListCampGroundReview(param)
        dialogCustomRef.current.handleClose()
      }
    } catch (e) {
      setIsLoading(false)
    }

    setIsLoading(false)
  }

  React.useEffect(() => {
    const param = {
      search: inputFilter,
      star: starFilter == 0 ? null : starFilter,
      status: statusFilter == 0 ? null : statusFilter,
      page: 0,
      size: 20,
    }
    fetchListCampGroundReview(param)
    fetchListCustomerCampdi()
  }, [])

  return (
    <SimpleCard>
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
      <Grid container>
        <Grid item sm={6} xs={6}>
          <div style={{ display: 'flex' }}>
            <TextField
              style={{ marginRight: '50px' }}
              fullWidth
              size="medium"
              type="text"
              label="Số điện thoại, email, tên hiển thị, nội dung:"
              variant="outlined"
              sx={{ mb: 3 }}
              onChange={e => {
                setInputFilter(e.target.value)
              }}
              onKeyDown={() => {
                if (key.code === 13) {
                  const param = {
                    search: inputFilter,
                    star: starFilter == 0 ? null : starFilter,
                    status: statusFilter == 0 ? null : statusFilter,
                    page: 0,
                    size: 20,
                  }
                  fetchListCampGroundReview(param)
                }
              }}
            />
            <FormControl fullWidth style={{ marginRight: '50px' }}>
              <InputLabel id="demo-simple-select-label">Số sao</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Trạng thái"
                onChange={e => {
                  setStartFilter(e.target.value)
                }}
              >
                <MenuItem value={0}>Tất cả</MenuItem>
                <MenuItem value={1}>1 sao</MenuItem>
                <MenuItem value={2}>2 sao</MenuItem>
                <MenuItem value={3}>3 sao</MenuItem>
                <MenuItem value={4}>4 sao</MenuItem>
                <MenuItem value={5}>5 sao</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Trạng thái"
                onChange={e => {
                  setStatusFilter(e.target.value)
                }}
              >
                <MenuItem value={0}>Tất cả</MenuItem>
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={-1}>Đã chặn</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Button
            color="primary"
            variant="contained"
            type="submit"
            onClick={() => {
              tableRef.current.handleClickSearch()
              fetchListCampGroundReview({
                search: inputFilter || null,
                status: statusFilter == 0 ? null : statusFilter,
                star: starFilter === 0 ? null : starFilter,
                page: 0,
                size: 20,
              })
            }}
          >
            <Icon style={{ fontSize: '20px' }}>search</Icon> Tìm kiếm
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid
          item
          sm={6}
          xs={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
          }}
        >
          <Fab
            color="primary"
            aria-label="Add"
            className="button"
            sx={{ marginRight: '15px', cursor: 'pointer' }}
            size="small"
            onClick={() => {
              dialogCustomRef.current.handleClickOpen()
            }}
          >
            <Icon>add</Icon>
          </Fab>
          <Paragraph
            variant="h1"
            component="h2"
            children={undefined}
            className={undefined}
            ellipsis={undefined}
          >
            Thêm đánh giá
          </Paragraph>
        </Grid>
      </Grid>
      <TableCustom
        ref={tableRef}
        msgNoContent={
          inputFilter
            ? `Không tìm được kết quả nào phù hợp với từ khóa "${inputFilter}"`
            : 'Không có bản ghi nào'
        }
        title="Danh sách đánh giá"
        dataTable={listCampGroundReview || []}
        tableModel={tableModelReview}
        pagination={true}
        onDeleteData={deleteCampGroundService}
        updateStatus={changeStatusReview}
        totalData={parseInt(totalListCampGroundReview, 0)}
        fetchDataTable={fetchListCampGroundReview}
        filter={{
          search: inputFilter,
          status: statusFilter == 0 ? null : statusFilter,
          star: starFilter === 0 ? null : starFilter,
        }}
      />
      <DialogCustom ref={dialogCustomRef} title="Tạo đánh giá" maxWidth="md">
        <SimpleCard>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Paragraph> Chọn tài khoản*:</Paragraph>
            <Controller
              control={control}
              name="account"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  disablePortal
                  options={listAccount}
                  onChange={(_, data) => field.onChange(data)}
                  getOptionLabel={option => option.name}
                  sx={{ width: 200, marginRight: 5 }}
                  renderInput={params => (
                    <TextField
                      error={!!errors.account}
                      helperText={
                        errors.account ? 'Vui lòng chọn tài khoản' : ''
                      }
                      {...params}
                      label=""
                      margin="normal"
                    />
                  )}
                />
              )}
            />
            <Paragraph>Đánh giá:</Paragraph>
            {rateArray.map((colorIcon, index) => {
              return (
                <Icon
                  color={colorIcon}
                  key={colorIcon + index}
                  onClick={() => {
                    setRateArray([
                      ...Array(index + 1).fill('primary'),
                      ...Array(4 - index).fill(''),
                    ])
                  }}
                >
                  star
                </Icon>
              )
            })}
            <Paragraph>Nội dung đánh giá*:</Paragraph>
            <Grid item xs={12} md={12}>
              <Controller
                name="noteReview"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.noteReview}
                    helperText={errors.noteReview?.message}
                    {...field}
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Paragraph>Ảnh*:</Paragraph>
            <UploadImage
              ref={uploadImageRef}
              setValue={setValue}
              id="reviewId"
            />
            {errors?.file && (
              <FormHelperText error={true}>
                {errors.file?.message || ''}
              </FormHelperText>
            )}
            <div>
              <Button
                color="primary"
                type="submit"
                variant="contained"
                disabled={isLoading}
              >
                Lưu
              </Button>
              <Button
                style={{ marginLeft: '10px' }}
                color="primary"
                variant="contained"
                onClick={() => {
                  dialogCustomRef.current.handleClose()
                }}
              >
                Hủy
              </Button>
            </div>
          </form>
        </SimpleCard>
      </DialogCustom>
    </SimpleCard>
  )
}
