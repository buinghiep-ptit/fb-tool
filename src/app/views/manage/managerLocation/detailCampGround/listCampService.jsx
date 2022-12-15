import { Button, Grid, Icon, Fab, TextField } from '@mui/material'
import { SimpleCard } from 'app/components'
import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { tableModelService, typeService } from '../const'
import { Paragraph } from 'app/components/Typography'
import { useState } from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'
import DialogCustom from 'app/components/common/DialogCustom'
import {
  deleteCampGroundService,
  getListCampGroundService,
  updateCampGroundServiceStatus,
} from 'app/apis/campGround/ground.service'
import { cloneDeep } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import ServiceDetail from '../../managerServices/ServiceDetail'

export default function ListCampService(props) {
  const [inputFilter, setInputFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)
  const [typeFilter, setTypeFilter] = useState(null)
  const [listCampGroundService, setListCampGroundService] = useState([])
  const [totalListCampGroundService, setTotalListCampgroundService] = useState()
  const navigate = useNavigate()
  const params = useParams()
  const dialogCustomRef = React.useRef()

  const fetchListCampGroundService = async param => {
    await getListCampGroundService(params.id, param)
      .then(data => {
        const newList = cloneDeep(data.content).map(campGroundService => {
          const convertCampGroundService = {}
          convertCampGroundService.id = campGroundService.id
          convertCampGroundService.image = campGroundService.imageUrl
          convertCampGroundService.linkView = {
            link: campGroundService.name,
            path: `/quan-ly-dich-vu/`,
          }
          convertCampGroundService.type = typeService[campGroundService.type]

          convertCampGroundService.quantity = campGroundService.capacity

          convertCampGroundService.status =
            campGroundService.status === 1 ? true : false

          convertCampGroundService.action = ['editModal', 'delete']
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
      size: 20,
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
                <MenuItem value={0}>Tất cả</MenuItem>
                <MenuItem value={1}>Gói dịch vụ</MenuItem>
                <MenuItem value={2}>Lưu trú</MenuItem>
                <MenuItem value={3}>Khác</MenuItem>
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
                <MenuItem value={-1}>Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Button
            color="primary"
            variant="contained"
            type="submit"
            onClick={() => {
              fetchListCampGroundService({
                name: inputFilter || null,
                status: statusFilter === 0 ? null : statusFilter,
                type: typeFilter === 0 ? null : typeFilter,
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
            Thêm dịch vụ
          </Paragraph>
        </Grid>
      </Grid>
      <TableCustom
        title="Danh sách dịch vụ"
        dataTable={listCampGroundService || []}
        tableModel={tableModelService}
        pagination={true}
        onDeleteData={deleteCampGroundService}
        updateStatus={updateCampGroundServiceStatus}
        totalData={parseInt(totalListCampGroundService, 0)}
        fetchDataTable={fetchListCampGroundService}
        filter={{ name: inputFilter, status: statusFilter, type: typeFilter }}
      />
      <DialogCustom ref={dialogCustomRef} title="Tạo dịch vụ" maxWidth="xl">
        <ServiceDetail
          isModal={false}
          idCampGround={params.id}
          handleCloseModal={() => dialogCustomRef.current.handleClose()}
          extendFunction={() => fetchListCampGroundService()}
        />
      </DialogCustom>
    </SimpleCard>
  )
}
