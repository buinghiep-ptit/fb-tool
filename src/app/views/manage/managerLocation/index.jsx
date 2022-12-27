import {
  Box,
  Button,
  Grid,
  Icon,
  styled,
  TextField,
  Fab,
  Autocomplete,
} from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { tableModel } from './const'
import { Paragraph } from 'app/components/Typography'
import { useState } from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'
import {
  deleteCampGround,
  getListCampGround,
  updateCampGroundStatus,
} from 'app/apis/campGround/ground.service'
import { getProvinces } from 'app/apis/common/common.service'
import { cloneDeep } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { toastSuccess, toastWarning } from 'app/helpers/toastNofication'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function ManagerLocation(props) {
  const [inputFilter, setInputFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)
  const [isBooking, setIsBooking] = useState()
  const [listCampGround, setListCampGround] = useState([])
  const [totalListCampGround, setTotalListCampground] = useState()
  const [provinces, setProvinces] = useState()
  const [provinceId, setProvinceId] = useState(null)
  const navigate = useNavigate()
  const tableRef = React.useRef()

  const fetchListCampGround = async param => {
    const res = await getListCampGround(param)
      .then(data => {
        const newList = cloneDeep(data.content).map(campGround => {
          const convertCampGround = {}
          convertCampGround.id = campGround.id
          convertCampGround.image = campGround.imageUrl
          convertCampGround.linkDetail = {
            link: campGround.name,
            path: '/chi-tiet-diem-camp/',
          }
          convertCampGround.idMerchant = campGround.idMerchant
          convertCampGround.type = campGround.campTypes
          convertCampGround.service = campGround.campRentalAmount
          convertCampGround.place = campGround.campAreaName
          convertCampGround.contact = `${campGround.merchantEmail || ''}${
            campGround.merchantEmail && campGround.merchantMobilePhone
              ? ' - '
              : ''
          }${campGround.merchantMobilePhone || ''}`

          convertCampGround.address = campGround.address
          if (convertCampGround.status !== 0) {
            convertCampGround.status = campGround.status === 1 ? true : false
          }
          convertCampGround.action = ['edit']
          return convertCampGround
        })

        setListCampGround(newList)
        setTotalListCampground(data.totalElements)
        return data.content
      })
      .catch(err => console.log(err))
    return res
  }

  const handleSearch = () => {
    tableRef.current.handleClickSearch()
    fetchListCampGround({
      name: inputFilter,
      status: statusFilter,
      isSupportBooking: isBooking,
      idProvince: provinceId,
      page: 0,
      size: 20,
    })
  }

  const fetchProvinces = async () => {
    const res = await getProvinces()
    setProvinces(res)
  }

  React.useEffect(() => {
    const param = {
      name: inputFilter,
      status: statusFilter,
      isSupportBooking: isBooking,
      idProvince: provinceId,
      page: 0,
      size: 20,
    }
    fetchListCampGround(param)
    fetchProvinces()
  }, [])

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý địa điểm Camp' }]} />
      </Box>
      <SimpleCard>
        <Grid container>
          <Grid item sm={8} xs={8}>
            <div style={{ display: 'flex' }}>
              <TextField
                style={{ marginRight: '50px' }}
                id="namePlace"
                fullWidth
                size="medium"
                type="text"
                name="namePlace"
                label="Tên điểm camping/địa danh/liên hệ"
                variant="outlined"
                sx={{ mb: 3 }}
                onChange={e => {
                  setInputFilter(e.target.value)
                }}
                onKeyDown={async e => {
                  if (e.keyCode === 13) {
                    handleSearch()
                  }
                }}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Trạng thái
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Trạng thái"
                  style={{ marginRight: '50px' }}
                  onChange={e => {
                    setStatusFilter(e.target.value == 0 ? null : e.target.value)
                  }}
                >
                  <MenuItem value={0}>Tất cả</MenuItem>
                  <MenuItem value={1}>Hoạt động</MenuItem>
                  <MenuItem value={-1}>Không hoạt động</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Hỗ trợ đặt chỗ
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Hỗ trợ booking"
                  onChange={e => {
                    setIsBooking(e.target.value)
                  }}
                >
                  <MenuItem value={null}>Tất cả</MenuItem>
                  <MenuItem value={1}>Có</MenuItem>
                  <MenuItem value={0}>Không</MenuItem>
                </Select>
              </FormControl>
              <Autocomplete
                disablePortal
                sx={{ minWidth: 200, ml: 10 }}
                options={provinces}
                getOptionLabel={option => option.name}
                onChange={(_, data) => {
                  setProvinceId(data.id)
                }}
                renderInput={params => (
                  <TextField {...params} fullWidth label="Tỉnh/thành phố" />
                )}
              />
            </div>

            <Button
              color="primary"
              variant="contained"
              type="submit"
              onClick={async () => {
                handleSearch()
              }}
            >
              <Icon style={{ fontSize: '20px' }}>search</Icon>{' '}
              <span>Tìm kiếm</span>
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
                navigate('/them-diem-camp')
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
              Thêm địa điểm
            </Paragraph>
          </Grid>
        </Grid>
        <TableCustom
          title="Danh sách địa điểm Camp"
          ref={tableRef}
          msgNoContent={`Không tìm được kết quả nào phù hợp với từ khóa "${inputFilter}"`}
          dataTable={listCampGround || []}
          tableModel={tableModel}
          pagination={true}
          updateStatus={updateCampGroundStatus}
          totalData={parseInt(totalListCampGround, 0)}
          fetchDataTable={fetchListCampGround}
          filter={{
            name: inputFilter,
            status: statusFilter,
            isSupportBooking: isBooking,
            idProvince: provinceId,
            page: 0,
            size: 20,
          }}
          onDeleteData={deleteCampGround}
        />
      </SimpleCard>
    </Container>
  )
}
