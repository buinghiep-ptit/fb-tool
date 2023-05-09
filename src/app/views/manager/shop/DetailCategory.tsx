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
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import {
  displayProduct,
  getProducts,
  priorityProduct,
  syncProduct,
  syncStatus,
} from 'app/apis/shop/shop.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import DialogSettingImage from './DialogSettingImage'
import { headTableDetailCategory } from './const'
export interface Props {}

export default function DetailCategory(props: Props) {
  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [products, setProducts] = useState<any>()
  const [nameFilter, setNameFilter] = useState<any>('')
  const [statusFilter, setStatusFilter] = useState<any>(2)
  const dialogSettingImageRef = React.useRef<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [doRerender, setDoRerender] = React.useState(false)
  const navigate = useNavigate()
  const param = useParams()
  const { state, pathname } = useLocation()

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage)
    setDoRerender(!doRerender)
  }

  const handleChangeRowsPerPage = (event: {
    target: { value: string | number }
  }) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    setDoRerender(!doRerender)
  }

  const fetchListProduct = async () => {
    setIsLoading(true)
    const res = await getProducts(
      {
        search: nameFilter.trim(),
        status: statusFilter === 2 ? null : statusFilter,
        page: page,
        size: rowsPerPage,
      },
      param.id,
    )
    setProducts(res.content)
    setCountTable(res.totalElements)
    setIsLoading(false)
  }

  const handleSearch = async () => {
    setPage(0)
    setDoRerender(!doRerender)
  }

  const handleSyncCategory = async () => {
    setIsLoading(true)
    const res = await syncProduct()
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
              fetchListProduct()
              setIsLoading(false)
            }
            resolve()
          }, 20000),
        )
      }
    }
  }

  const toggleDisplay = async (id: any, index: any) => {
    const res = await displayProduct(id)
    if (res) {
      const newProducts = [...products]
      newProducts[index].isDisplay = newProducts[index].isDisplay === 1 ? 0 : 1
      setProducts(newProducts)
    }
  }

  const togglePrority = async (id: any, index: any) => {
    const res = await priorityProduct(id)
    if (res) {
      const newProducts = [...products]
      newProducts[index].priority = newProducts[index].priority === 1 ? 0 : 1
      setProducts(newProducts)
    }
  }

  const watchStatusSync = async () => {
    const res = await syncStatus({ isProduct: 0 })
    return res.status
  }

  React.useEffect(() => {
    fetchListProduct()
  }, [page, doRerender])

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
        {products && (
          <Breadcrumb
            routeSegments={[
              { name: 'Quản lý cửa hàng', path: '/shop' },
              { name: products[0]?.categoryName || '' },
            ]}
          />
        )}
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
              value={nameFilter}
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
                value={statusFilter}
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
      <SimpleCard title="Danh sách sản phẩm">
        <Box width="100%" overflow="auto">
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
                      <Typography
                        onClick={() =>
                          navigate(`/shop/product/${product.masterProductId}`)
                        }
                      >
                        {product.name}
                      </Typography>
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
                        onChange={e => {
                          toggleDisplay(product.id, index)
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        color="success"
                        checked={product.priority === 0 ? false : true}
                        onChange={e => {
                          togglePrority(product.id, index)
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {moment(product.dateUpdated).format('DD-MM-YYYY HH:mm')}
                    </TableCell>
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
        </Box>
      </SimpleCard>
      <DialogSettingImage
        ref={dialogSettingImageRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Container>
  )
}
