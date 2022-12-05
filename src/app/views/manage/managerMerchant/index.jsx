import { Box, Button, Grid, Icon, styled, TextField, Fab } from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { tableModel, TYPEMERCHANT } from './const'
import { Paragraph } from 'app/components/Typography'
import { useState } from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'

import {
  getListMerchant,
  deleteMerchant,
  updateMerchantStatus,
} from 'app/apis/merchant/merchant.service'
import { cloneDeep } from 'lodash'
import { useNavigate } from 'react-router-dom'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function ManagerMerchant(props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)
  const [merchantType, setMerchantType] = useState()
  const [listMerchant, setListMerchant] = useState([])
  const [totalListMerchant, setTotalListMerchant] = useState()
  const navigate = useNavigate()
  const tableRef = React.useRef()
  const fetchListMerchant = async param => {
    await getListMerchant(param)
      .then(data => {
        const newList = cloneDeep(data.content).map(merchant => {
          const convertMerchant = {}
          convertMerchant.id = merchant.id
          convertMerchant.email = merchant.email
          convertMerchant.mobilePhone = merchant.mobilePhone
          convertMerchant.represent = merchant.represent
          convertMerchant.merchantType = TYPEMERCHANT[merchant.merchantType]
          convertMerchant.linkDetail = {
            link: merchant.name,
            path: '/cap-nhat-thong-tin-doi-tac/',
          }
          if (convertMerchant.status !== 0) {
            convertMerchant.status = merchant.status === 1 ? true : false
          }
          convertMerchant.action = ['edit', 'delete']
          return convertMerchant
        })

        setListMerchant(newList)
        setTotalListMerchant(data.totalElements)
      })
      .catch(err => console.log(err))
  }

  React.useEffect(() => {
    const param = {
      page: 0,
      size: 20,
    }
    fetchListMerchant(param)
  }, [])

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý đối tác' }]} />
      </Box>
      <SimpleCard>
        <Grid container>
          <Grid item sm={6} xs={6}>
            <div style={{ display: 'flex' }}>
              <TextField
                style={{ marginRight: '50px' }}
                id="search"
                fullWidth
                size="medium"
                type="text"
                name="search"
                label="Tên, email, SDT, Người đại diện"
                variant="outlined"
                sx={{ mb: 3 }}
                onChange={e => {
                  setSearch(e.target.value)
                }}
              />
              <FormControl fullWidth style={{ marginRight: '50px' }}>
                <InputLabel id="demo-simple-select-label">
                  Loại đối tác
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Trạng thái"
                  onChange={e => {
                    setMerchantType(e.target.value)
                  }}
                >
                  <MenuItem value={0}>Tất cả</MenuItem>
                  <MenuItem value={1}>Điểm camp</MenuItem>
                  <MenuItem value={2}>Nhà cung cấp</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Trạng thái
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Trạng thái"
                  onChange={e => {
                    setStatusFilter(e.target.value)
                  }}
                >
                  <MenuItem value={''}>Tất cả</MenuItem>
                  <MenuItem value={1}>Hoạt dộng</MenuItem>
                  <MenuItem value={-2}>Khóa</MenuItem>
                </Select>
              </FormControl>
            </div>

            <Button
              color="primary"
              variant="contained"
              type="submit"
              onClick={() => {
                tableRef.current.handleClickSearch()
                fetchListMerchant({
                  search: search,
                  status: statusFilter,
                  merchantType: merchantType === 0 ? '' : merchantType,
                  page: 0,
                  size: 20,
                })
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
              cursor: 'pointer',
            }}
          >
            <Fab
              color="primary"
              aria-label="Add"
              className="button"
              sx={{ marginRight: '15px', cursor: 'pointer' }}
              size="small"
              onClick={() => {
                navigate('/them-doi-tac')
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
              Thêm đối tác
            </Paragraph>
          </Grid>
        </Grid>
        <TableCustom
          key={tableModel}
          ref={tableRef}
          title="Danh sách đối tác"
          dataTable={listMerchant || []}
          tableModel={tableModel}
          pagination={true}
          updateStatus={updateMerchantStatus}
          totalData={parseInt(totalListMerchant, 0)}
          fetchDataTable={fetchListMerchant}
          filter={{
            search: search,
            status: statusFilter,
            merchantType: merchantType === 0 ? '' : merchantType,
            size: 20,
            page: 0,
          }}
          onDeleteData={deleteMerchant}
        />
      </SimpleCard>
    </Container>
  )
}
