import { Box, shadows, styled } from '@mui/system'
import * as React from 'react'
import { Breadcrumb, SimpleCard, Container, StyledTable } from 'app/components'
import { Link } from 'react-router-dom'
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
  FormLabel,
  Radio,
  FormControlLabel,
  RadioGroup,
  Paper,
  ButtonGroup,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload'
import { headTableAccount, headTableAccountLog } from './const'
import { useState } from 'react'
import LockPersonIcon from '@mui/icons-material/LockPerson'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'

export interface Props {}
const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  boxShadow: 'none',
}))

export default function Information(props: Props) {
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
    <>
      <SimpleCard>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Item>
              <TextField
                id="outlined-basic"
                label="Email, SDT, Tên hiển thị"
                variant="outlined"
                fullWidth
              />
            </Item>
            <Item>
              <TextField
                id="outlined-basic"
                label="Email, SDT, Tên hiển thị"
                variant="outlined"
                fullWidth
              />
            </Item>
            <Item>
              <TextField
                id="outlined-basic"
                label="Email, SDT, Tên hiển thị"
                variant="outlined"
                fullWidth
              />
            </Item>
          </Grid>
          <Grid item xs={3}>
            <Item>
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
                  <MenuItem value={1}>Thường</MenuItem>
                  <MenuItem value={2}>Fan</MenuItem>
                </Select>
              </FormControl>
            </Item>
            <Item>
              <FormControl>
                <FormLabel id="sex-radio">Giới tính</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="Nam"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="Nam"
                    control={<Radio />}
                    label="Name"
                  />
                  <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                  <FormControlLabel
                    value="Khác"
                    control={<Radio />}
                    label="Khác"
                  />
                </RadioGroup>
              </FormControl>
            </Item>
            <Item>
              <div>
                <FormLabel id="sex-radio">Trạng thái: </FormLabel>
                <Chip label="Hoạt động" color="success" />
              </div>
            </Item>
          </Grid>
          <Grid
            item
            xs={3}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
          >
            <Item>
              <div>
                <FormLabel id="sex-radio">
                  Đăng ký bằng: Số điện thoại
                </FormLabel>
              </div>
            </Item>
            <Item>
              <div>
                <FormLabel id="sex-radio">Ngày đăng ký: 01/02/2023</FormLabel>
              </div>
            </Item>
            <Item>
              <div>
                <FormLabel id="sex-radio">
                  Lần cuối đăng nhập: 01/02/2023
                </FormLabel>
              </div>
            </Item>
          </Grid>
          <Grid item xs={3} sx={{ textAlign: 'center' }}>
            <Item>
              <AccountCircleRoundedIcon sx={{ fontSize: 100 }} />
            </Item>
            <Item>
              <ButtonGroup variant="text" aria-label="text button group">
                <Button startIcon={<LockPersonIcon />}>Khóa</Button>
                <Button color="success">Loại tài khoản: Fan</Button>
              </ButtonGroup>
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <div>Địa chỉ nhận hàng: Tòa nhà FPT Tower</div>
            </Item>
          </Grid>
        </Grid>
      </SimpleCard>
      <div style={{ height: '30px' }} />
      <SimpleCard title="Log hành động">
        <StyledTable>
          <TableHead>
            <TableRow>
              {headTableAccountLog.map(header => (
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
    </>
  )
}
