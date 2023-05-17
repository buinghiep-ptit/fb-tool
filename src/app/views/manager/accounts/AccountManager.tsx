import AddBoxIcon from '@mui/icons-material/AddBox'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import * as React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { headTableAccount } from './const'
export interface Props {}

export default function CustomerManager(props: Props) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
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

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý tài khoản vận' }]} />
      </Box>
      <div style={{ textAlign: 'end' }}>
        <Button
          variant="contained"
          startIcon={<AddBoxIcon />}
          style={{ width: '200px', margin: '15px 0', height: '52px' }}
        >
          Thêm tài khoản
        </Button>
      </div>

      <SimpleCard>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Loại tài khoản
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Loại tài khoản"
              >
                <MenuItem value={0}>Tất cả</MenuItem>
                <MenuItem value={1}>Admin</MenuItem>
                <MenuItem value={2}>Vận hành</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Trạng thái"
              >
                <MenuItem value={0}>Tất cả</MenuItem>
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={2}>Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={3}
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              justifyItems: 'baseline',
            }}
          >
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              style={{ width: '100%', marginRight: '15px', height: '52px' }}
            >
              Tìm kiếm
            </Button>
            <Button
              startIcon={<AutorenewIcon />}
              variant="contained"
              style={{ width: '100%', height: '52px' }}
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
              {headTableAccount.map(header => (
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
                <Chip label="Hội viên" color="warning" />
              </TableCell>
              <TableCell align="center">
                <Chip label="Hoạt động" color="success" />
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
