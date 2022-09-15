import { Box, Button, Grid, Icon, styled, TextField } from '@mui/material'
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
import { cloneDeep } from 'lodash'

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
  const [listCampGround, setListCampGround] = useState([])
  const [totalListCampGround, setTotalListCampground] = useState()

  const fetchListCampGround = async param => {
    await getListCampGround(param)
      .then(data => {
        const newList = cloneDeep(data.content).map(campGround => {
          const convertCampGround = {}
          convertCampGround.id = campGround.id
          convertCampGround.imageGround = campGround.imgUrl
          convertCampGround.linkDetail = {
            link: campGround.name,
            path: '/chi-tiet-diem-camp/',
          }
          convertCampGround.place = campGround.campAreaName
          convertCampGround.contact =
            campGround.merchantEmail + campGround.merchantMobilePhone
          convertCampGround.address = campGround.address
          convertCampGround.type = campGround.campType
          if (convertCampGround.status !== 0) {
            convertCampGround.status = campGround.status === 1 ? true : false
          }
          convertCampGround.action = ['edit', 'delete']
          return convertCampGround
        })

        setListCampGround(newList)
        setTotalListCampground(data.totalElements)
      })
      .catch(err => console.log(err))
  }

  React.useEffect(() => {
    const param = {
      name: inputFilter,
      status: statusFilter,
      page: 0,
      size: 5,
    }
    fetchListCampGround(param)
  }, [])

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý địa điểm Camp' }]} />
      </Box>
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
                label="Tên địa danh/địa chỉ"
                variant="outlined"
                sx={{ mb: 3 }}
                onChange={e => {
                  setInputFilter(e.target.value)
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
                  onChange={e => {
                    console.log(e.target.value)
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
                console.log(inputFilter, statusFilter)
                fetchListCampGround({
                  name: inputFilter,
                  status: statusFilter,
                  page: 0,
                  size: 5,
                })
              }}
            >
              <Icon>search</Icon>
            </Button>
          </Grid>
        </Grid>
        <Grid container>
          <Grid
            item
            sm={6}
            xs={6}
            sx={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}
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
              Thêm địa điểm
            </Paragraph>
          </Grid>
        </Grid>
        <TableCustom
          title="Danh sách địa điểm Camp"
          dataTable={listCampGround || []}
          tableModel={tableModel}
          pagination={true}
          updateStatus={updateCampGroundStatus}
          totalData={parseInt(totalListCampGround, 0)}
          fetchDataTable={fetchListCampGround}
          filter={{ name: inputFilter, status: statusFilter }}
          onDeleteData={deleteCampGround}
        />
      </SimpleCard>
    </Container>
  )
}
