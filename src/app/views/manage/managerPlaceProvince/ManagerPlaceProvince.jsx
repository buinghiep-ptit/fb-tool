import {
  Box,
  Button,
  Grid,
  Icon,
  styled,
  TextField,
  Autocomplete,
  Fab,
} from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'
import { cloneDeep } from 'lodash'
import { Paragraph } from 'app/components/Typography'
import { useState } from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import {
  deletePlace,
  getListPlaceProvince,
  updatePlaceStatus,
} from 'app/apis/place/place.service'
import { tableModel, typeAreas } from './const'
import { useNavigate } from 'react-router-dom'
import { getProvinces } from 'app/apis/common/common.service'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function ManagerPlaceProvince(props) {
  const [listPlace, setListPlace] = useState()
  const [totalPlace, setTotalPlace] = useState()
  const [inputNamePlace, setInputNamePlace] = useState('')
  const [statusFilter, setStatusFilter] = useState(0)
  const [provinces, setProvinces] = useState()
  const [provinceId, setProvinceId] = useState(null)
  const navigate = useNavigate()
  const tableRef = React.useRef()
  const fetchListPlace = async param => {
    await getListPlaceProvince(param)
      .then(data => {
        const newList = cloneDeep(data.content).map(place => {
          const convertPlace = {}
          convertPlace.id = place.id
          convertPlace.image = place.imgUrl
          convertPlace.linkDetail = {
            link: place.name,
            path: '/chi-tiet-dia-danh-tinh-thanh/',
          }
          convertPlace.quantity = place.campGroundAmount
          convertPlace.eventPlace = {
            active: place.eventActiveAmount,
            inactive: place.eventInactiveAmount,
          }
          convertPlace.address = place.address
          convertPlace.type = place.campType
          convertPlace.status = place.status === 1 ? true : false
          convertPlace.action = ['edit']
          return convertPlace
        })

        setListPlace(newList)
        setTotalPlace(data.totalElements)
        return data.content
      })
      .catch(err => console.log(err))
  }

  const handleSearch = async () => {
    tableRef.current.handleClickSearch()
    const res = fetchListPlace({
      name: inputNamePlace,
      page: 0,
      size: 20,
      status: statusFilter === 0 ? null : statusFilter,
      idProvince: provinceId,
    })
    if (res.length === 0) {
      toastWarning({
        message: `Không tìm được kết quả nào phù hợp với từ khóa “${inputFilter}”`,
      })
    }
  }

  const fetchProvinces = async () => {
    const res = await getProvinces()
    setProvinces(res)
  }

  React.useEffect(() => {
    const param = {
      name: inputNamePlace,
      page: 0,
      size: 20,
      idProvince: provinceId,
    }
    fetchListPlace(param)
    fetchProvinces()
  }, [])

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý địa danh tỉnh thành' }]} />
      </Box>
      <SimpleCard>
        <Grid container>
          <Grid item sm={12} xs={12}>
            <div style={{ display: 'flex' }}>
              <TextField
                id="namePlace"
                size="medium"
                type="text"
                name="namePlace"
                label="Tên địa danh/địa chỉ"
                variant="outlined"
                sx={{ mb: 3 }}
                onChange={e => {
                  setInputNamePlace(e.target.value)
                }}
                onKeyDown={async e => {
                  if (e.keyCode === 13) {
                    handleSearch()
                  }
                }}
              />
              <FormControl sx={{ minWidth: 200, ml: 10 }}>
                <InputLabel id="demo-simple-select-label">
                  Trạng thái
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Trạng thái"
                  defaultValue={0}
                  onChange={e => {
                    setStatusFilter(e.target.value)
                  }}
                >
                  <MenuItem value={1}>Hoạt động</MenuItem>
                  <MenuItem value={-1}>Không hoạt dộng</MenuItem>
                  <MenuItem value={0}>Tất cả</MenuItem>
                </Select>
              </FormControl>
              <Autocomplete
                disablePortal
                sx={{ minWidth: 200, ml: 10 }}
                options={provinces}
                getOptionLabel={option => option.name}
                onChange={(_, data) => {
                  console.log(data)
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
              type="button"
              style={{ marginBottom: '15px' }}
              onClick={() => {
                handleSearch()
              }}
            >
              <Icon style={{ fontSize: '20px' }}>search</Icon>
              <span>Tìm kiếm</span>
            </Button>
          </Grid>
        </Grid>

        <TableCustom
          ref={tableRef}
          title="Danh sách địa danh tỉnh thành"
          dataTable={listPlace || []}
          tableModel={tableModel}
          totalData={parseInt(totalPlace, 0)}
          pagination={true}
          fetchDataTable={fetchListPlace}
          onDeleteData={deletePlace}
          updateStatus={updatePlaceStatus}
          filter={{
            name: inputNamePlace,
            status: statusFilter === 0 ? null : statusFilter,
            idProvince: provinceId,
            page: 0,
            size: 20,
          }}
        />
      </SimpleCard>
    </Container>
  )
}
