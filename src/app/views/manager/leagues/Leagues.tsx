import { Edit } from '@mui/icons-material'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import CachedIcon from '@mui/icons-material/Cached'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
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
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { getLeagues } from 'app/apis/leagues/leagues.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import * as React from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { headTableLeagues, typeLeagues } from './const'

export interface Props {}

export default function LeaguesManager(props: Props) {
  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [leagues, setLeagues] = useState<any>()
  const [nameFilter, setNameFilter] = useState<any>()
  const [statusFilter, setStatusFilter] = useState<any>()
  // const [nameFilter, setNameFilter] = useState<any>()
  // const [statusFilter, setStatusFilter] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const param = useParams()

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage)
    fetchLeagues({ page: page, size: rowsPerPage })
  }

  const handleChangeRowsPerPage = (event: {
    target: { value: string | number }
  }) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    fetchLeagues({ page: 0, size: rowsPerPage })
  }

  const fetchLeagues = async (params: any) => {
    const res = await getLeagues(params)
    setLeagues(res.content)
    setCountTable(res.totalElements)
  }

  const handleSearch = async () => {
    setIsLoading(true)
    await fetchLeagues({
      search: nameFilter,
      status: statusFilter,
      page: 0,
      size: 20,
    })
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchLeagues({ page: 0, size: 20 })
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
        <Breadcrumb routeSegments={[{ name: 'Quản lý giải đấu' }]} />
      </Box>
      <div style={{ textAlign: 'end' }}>
        <Button
          variant="contained"
          startIcon={<AddBoxOutlinedIcon />}
          style={{ width: '200px', margin: '15px 0', height: '52px' }}
        >
          Thêm mới giải đấu
        </Button>
      </div>
      <SimpleCard>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              id="name1"
              label="Tên giải đấu"
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
            <TextField
              id="name2"
              label="Tên viết tắt"
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
              <InputLabel id="demo-simple-select-label">Loại giải</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Trạng thái"
                onChange={e => {
                  setStatusFilter(e.target.value)
                }}
              >
                <MenuItem value={2}>Tất cả</MenuItem>
                <MenuItem value={0}>Chưa diễn ra</MenuItem>
                <MenuItem value={1}>Đang diễn ra</MenuItem>
                <MenuItem value={-1}>Kết thúc</MenuItem>
              </Select>
            </FormControl>
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
                <MenuItem value={0}>Chưa diễn ra</MenuItem>
                <MenuItem value={1}>Đang diễn ra</MenuItem>
                <MenuItem value={-1}>Kết thúc</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              style={{ width: '100%', padding: '15px' }}
              onClick={handleSearch}
              disabled={isLoading}
            >
              Tìm kiếm
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              startIcon={<CachedIcon />}
              style={{ width: '100%', padding: '15px' }}
              onClick={handleSearch}
              disabled={isLoading}
            >
              Làm mới
            </Button>
          </Grid>
        </Grid>
      </SimpleCard>
      <div style={{ height: '30px' }} />
      <SimpleCard title="Danh sách khách hàng">
        <StyledTable>
          <TableHead>
            <TableRow>
              {headTableLeagues.map(header => (
                <TableCell align="center" style={{ minWidth: header.width }}>
                  {header.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(leagues || []).map((product: any, index: any) => {
              return (
                <TableRow hover key={product.name}>
                  <TableCell align="center">
                    {rowsPerPage * page + index + 1}
                  </TableCell>
                  <TableCell align="center">
                    <Link to="/customers/1">{product.name}</Link>
                  </TableCell>
                  <TableCell align="center">{product.logo}</TableCell>
                  <TableCell align="center">{product.shortName}</TableCell>
                  <TableCell align="center">
                    {typeLeagues[product.type - 1]}
                  </TableCell>
                  <TableCell align="center">
                    {product.status === 1 && (
                      <Chip label="Đang diễn ra" color="success" />
                    )}
                    {product.status === 0 && (
                      <Chip label="Chưa diễn ra" color="warning" />
                    )}
                    {product.status === 2 && (
                      <Chip label="Kết thúc" color="primary" />
                    )}
                    {product.status === 3 && (
                      <Chip label="Tạm dừng" color="secondary" />
                    )}
                    {product.status === 4 && <Chip label="Đóng" />}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Sửa" placement="top">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(`/shop/product/${product.masterProductId}`)
                        }
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa" placement="top">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(`/shop/product/${product.masterProductId}`)
                        }
                      >
                        <DeleteIcon />
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
    </Container>
  )
}
