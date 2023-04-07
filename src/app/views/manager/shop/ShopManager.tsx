import { Box } from '@mui/system'
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
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CachedIcon from '@mui/icons-material/Cached'
import { useState } from 'react'
export interface Props {}

export default function ShopManager(props: Props) {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý cửa hàng' }]} />
      </Box>
      <div style={{ textAlign: 'end' }}>
        <Button
          variant="contained"
          startIcon={<CachedIcon />}
          style={{ width: '200px', margin: '15px 0', height: '52px' }}
        >
          Đông bộ dữ liệu
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
    </Container>
  )
}
