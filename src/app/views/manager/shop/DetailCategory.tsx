import { Box } from '@mui/system'
import * as React from 'react'
import { Breadcrumb, SimpleCard, Container, StyledTable } from 'app/components'
import { Link, useParams } from 'react-router-dom'
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import CachedIcon from '@mui/icons-material/Cached'
import { useState } from 'react'
import { headTableCategory, headTableDetailCategory } from './const'
import SettingsIcon from '@mui/icons-material/Settings'
import { getProducts } from 'app/apis/shop/shop.service'
export interface Props {}

export default function DetailCategory(props: Props) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const param = useParams()
  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: {
    target: { value: string | number }
  }) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    const newSize = +event.target.value
  }

  const fetchListProduct = async (params: any) => {
    const res = await getProducts(params, param.id)
  }

  React.useEffect(() => {
    fetchListProduct({ page: 0, size: 20 })
  }, [])

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý cửa hàng', path: '/shop' },
            { name: 'Danh mục' },
          ]}
        />
      </Box>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          startIcon={<SettingsIcon />}
          style={{ width: '200px', margin: '15px 0', height: '52px' }}
          // onClick={() => {
          //   console.log('data')
          //   dialogSettingImageRef?.current.handleClickOpen()
          // }}
        >
          Cài đặt hình ảnh
        </Button>
        <Button
          variant="contained"
          startIcon={<CachedIcon />}
          style={{ width: '200px', margin: '15px 0', height: '52px' }}
        >
          Đồng bộ dữ liệu
        </Button>
      </div>
      <SimpleCard>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              id="outlined-basic"
              label="Email, SDT, Tên hiển thị"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Trạng thái"
              >
                <MenuItem value={0}>Tất cả</MenuItem>
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={2}>Khóa</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              justifyItems: 'baseline',
            }}
          >
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              style={{ width: '100%' }}
            >
              Tìm kiếm
            </Button>
          </Grid>
        </Grid>
      </SimpleCard>
      <div style={{ height: '30px' }} />
      <SimpleCard title="Danh sách khách hàng">
        <StyledTable>
          <TableHead>
            <TableRow>
              {headTableDetailCategory.map(header => (
                <TableCell align="center" style={{ minWidth: header.width }}>
                  {header.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover>
              <TableCell align="center">1</TableCell>
              <TableCell align="center">
                <Link to="/customers/1">123</Link>
              </TableCell>
              <TableCell align="center">1</TableCell>
              <TableCell align="center">1</TableCell>
              <TableCell align="center">
                <Chip label="fan" color="warning" />
              </TableCell>
              <TableCell align="center">1</TableCell>
              <TableCell align="center">1</TableCell>
              <TableCell align="center">
                <Chip label="Hoạt động" color="success" />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Sửa" placement="top">
                  <IconButton color="primary">
                    <BorderColorIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableBody>
        </StyledTable>
        <TablePagination
          sx={{ px: 2 }}
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={40}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[20, 50, 100]}
          labelRowsPerPage={'Dòng / Trang'}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{ 'aria-label': 'Next Page' }}
          backIconButtonProps={{ 'aria-label': 'Previous Page' }}
        />
      </SimpleCard>
    </Container>
  )
}
