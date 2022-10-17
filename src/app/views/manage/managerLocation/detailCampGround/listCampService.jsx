import { Box, Button, Grid, Icon, styled, TextField } from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { tableModelSevrvice } from '../const'
import { Paragraph } from 'app/components/Typography'
import { useState } from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'
import {
  deleteCampGroundService,
  getListCampGroundService,
  updateCampGroundServiceStatus,
} from 'app/apis/campGround/ground.service'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'

export default function ListCampService(props) {
  const [inputFilter, setInputFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)
  const [typeFilter, setTypeFilter] = useState(null)
  const [listCampGroundService, setListCampGroundService] = useState([])
  const [totalListCampGroundService, setTotalListCampgroundService] = useState()

  const params = useParams()

  const fetchListCampGroundService = async param => {
    await getListCampGroundService(params.id, param)
      .then(data => {
        const newList = cloneDeep(data.content).map(campGroundService => {
          const convertCampGroundService = {}
          convertCampGroundService.id = campGroundService.id
          convertCampGroundService.image = campGroundService.imgUrl
          convertCampGroundService.linkDetail = {
            link: campGroundService.name,
            path: '/chi-tiet-diem-camp/',
          }
          convertCampGroundService.type = campGroundService.type

          convertCampGroundService.quantity = campGroundService.capacity

          convertCampGroundService.status =
            campGroundService.status === 1 ? true : false

          convertCampGroundService.action = ['edit', 'delete']
          return convertCampGroundService
        })

        setListCampGroundService(newList)
        setTotalListCampgroundService(data.totalElements)
      })
      .catch(err => console.log(err))
  }

  React.useEffect(() => {
    const param = {
      name: inputFilter,
      status: statusFilter,
      type: typeFilter,
      page: 0,
      size: 5,
    }
    fetchListCampGroundService(param)
  }, [])

  return (
    <SimpleCard>
      <Grid container>
        <Grid item sm={6} xs={6}>
          <div style={{ display: 'flex' }}>
            <TextField
              style={{ marginRight: '50px' }}
              id="namePlace"
              fullWidth
              size="medium"
              type="text"
              name="namePlace"
              label="Tên dịch vụ"
              variant="outlined"
              sx={{ mb: 3 }}
              onChange={e => {
                setInputFilter(e.target.value)
              }}
            />
            <FormControl fullWidth style={{ marginRight: '50px' }}>
              <InputLabel id="demo-simple-select-label">
                Loại dịch vụ
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Trạng thái"
                onChange={e => {
                  setTypeFilter(e.target.value)
                }}
              >
                <MenuItem value={0}>Nghỉ</MenuItem>
                <MenuItem value={1}>Thuê</MenuItem>
                <MenuItem value={2}>Khác</MenuItem>
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
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={-1}>Không hoạt dộng</MenuItem>
                <MenuItem value={0}>Lưu nháp</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Button
            color="primary"
            variant="contained"
            type="submit"
            onClick={() => {
              fetchListCampGroundService({
                name: inputFilter,
                status: statusFilter,
                page: 0,
                size: 5,
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
            cursor: 'pointer',
          }}
        >
          <Icon fontSize="large" color="primary" sx={{ marginRight: '5px' }}>
            add_circle
          </Icon>
          <Paragraph
            variant="h1"
            component="h2"
            children={undefined}
            className={undefined}
            ellipsis={undefined}
          >
            Thêm dịch vụ
          </Paragraph>
        </Grid>
      </Grid>
      <TableCustom
        title="Danh sách dịch vụ"
        dataTable={listCampGroundService || []}
        tableModel={tableModelSevrvice}
        pagination={true}
        onDeleteData={deleteCampGroundService}
        updateStatus={updateCampGroundServiceStatus}
        totalData={parseInt(totalListCampGroundService, 0)}
        fetchDataTable={fetchListCampGroundService}
        filter={{ name: inputFilter, status: statusFilter, type: typeFilter }}
      />
    </SimpleCard>
  )
}
