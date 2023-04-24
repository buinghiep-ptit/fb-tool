import CachedIcon from '@mui/icons-material/Cached'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Switch,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import {
  getProducts,
  syncCategory,
  syncStatus,
} from 'app/apis/shop/shop.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import * as React from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DialogSettingImage from './DialogSettingImage'
import { headTableDetailCategory } from './const'
export interface Props {}

export default function DetailCategory(props: Props) {
  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [products, setProducts] = useState<any>()
  const [nameFilter, setNameFilter] = useState<any>()
  const [statusFilter, setStatusFilter] = useState<any>(2)
  const dialogSettingImageRef = React.useRef<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const param = useParams()
  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage)

    fetchListProduct()
  }

  const handleChangeRowsPerPage = (event: {
    target: { value: string | number }
  }) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    fetchListProduct()
  }

  const fetchListProduct = async () => {
    const res = await getProducts(
      {
        search: nameFilter,
        status: statusFilter === 2 ? null : statusFilter,
        page: page,
        size: rowsPerPage,
      },
      param.id,
    )
    setProducts(res.content)
    setCountTable(res.totalElements)
  }

  const handleSearch = async () => {
    setIsLoading(true)
    await fetchListProduct()
    setIsLoading(false)
  }

  const handleSyncCategory = async () => {
    setIsLoading(true)
    const res = await syncCategory()
    if (res) {
      // eslint-disable-next-line prefer-const
      let status = 0
      while (status === 0) {
        await new Promise<void>(resolve =>
          setTimeout(async () => {
            const statusRes = await watchStatusSync()
            console.log(statusRes)
            if (statusRes === 0) {
              status = 1
              setIsLoading(false)
            }
            resolve()
          }, 20000),
        )
      }
    }
  }

  const watchStatusSync = async () => {
    const res = await syncStatus({ isProduct: 0 })
    return res.status
  }

  React.useEffect(() => {
    fetchListProduct()
  }, [])

  return (
    <Container>
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
          onClick={() => {
            dialogSettingImageRef?.current.handleClickOpen()
          }}
        >
          Cài đặt hình ảnh
        </Button>
        <Button
          variant="contained"
          startIcon={<CachedIcon />}
          style={{ width: '200px', margin: '15px 0', height: '52px' }}
          disabled={isLoading}
          onClick={handleSyncCategory}
        >
          {isLoading ? '...Đang đồng bộ' : 'Đồng bộ dữ liệu'}
        </Button>
      </div>
      <SimpleCard>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              id="outlined-basic"
              label="Tên sản phẩm"
              variant="outlined"
              fullWidth
              onChange={e => {
                setNameFilter(e.target.value)
              }}
              onKeyDown={async e => {
                if (e.keyCode === 13) {
                  handleSearch()
                }
              }}
            />
          </Grid>
          <Grid item xs={3}>
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
                <MenuItem value={2}>Tất cả</MenuItem>
                <MenuItem value={0}>Không hoạt động</MenuItem>
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={-1}>Đã xóa từ Kiotviet</MenuItem>
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
              onClick={handleSearch}
              disabled={isLoading}
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
            {(products || []).map((product: any, index: any) => {
              return (
                <TableRow hover key={product.name}>
                  <TableCell align="center">
                    {rowsPerPage * page + index + 1}
                  </TableCell>
                  <TableCell align="center">
                    <Link to="/customers/1">{product.name}</Link>
                  </TableCell>
                  <TableCell align="center">{product.amount}</TableCell>
                  <TableCell align="center">
                    {product.status === 0 && (
                      <Chip label="Không hoạt động" color="success" />
                    )}
                    {product.status === 1 && (
                      <Chip label="Hoạt động" color="success" />
                    )}
                    {product.status === -1 && (
                      <Chip label="Đã xóa từ kiotviet" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      color="success"
                      checked={product.isDisplay === 0 ? false : true}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      color="success"
                      checked={product.priority === 0 ? false : true}
                    />
                  </TableCell>
                  <TableCell align="center">{product.dateUpdate}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Chi tiết" placement="top">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(`/shop/product/${product.masterProductId}`)
                        }
                      >
                        <RemoveRedEyeIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </StyledTable>
        <TablePagination
          sx={{ px: 2 }}
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={countTable}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[20, 50, 100]}
          labelRowsPerPage={'Dòng / Trang'}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{ 'aria-label': 'Next Page' }}
          backIconButtonProps={{ 'aria-label': 'Previous Page' }}
        />
      </SimpleCard>
      <DialogSettingImage
        ref={dialogSettingImageRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Container>
  )
}
