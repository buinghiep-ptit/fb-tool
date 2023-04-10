import { Box } from '@mui/system'
import * as React from 'react'
import { Breadcrumb, SimpleCard, Container, StyledTable } from 'app/components'
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Icon,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
  IconButton,
  TablePagination,
} from '@mui/material'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload'
import { useState } from 'react'
import { MuiButton } from 'app/components/common/MuiButton'
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
import { FormProvider, useForm } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SearchSharp } from '@mui/icons-material'
import { headTablePlayer } from 'app/utils/columns'
import { Link } from 'react-router-dom'
import StarIcon from '@mui/icons-material/Star'
import Star from '@mui/icons-material/Star'
import RankIcon from 'app/components/common/RankIcon'
export interface Props {}

export default function PlayerManager(props: Props) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage)
  }
  const methods = useForm()
  const handleChangeRowsPerPage = (event: {
    target: { value: string | number }
  }) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    const newSize = +event.target.value
  }
  const onSubmitHandler = () => console.log('Hello')
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý cầu thủ' }]} />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Thêm mới cầu thủ"
          variant="contained"
          color="primary"
          type="submit"
          // onClick={() => navigation(`chi-tiet-dich-vu`, {})}
          startIcon={<Icon>control_point</Icon>}
        />
      </Stack>
      <Stack gap={3}>
        <SimpleCard>
          <form
            onSubmit={methods.handleSubmit(onSubmitHandler)}
            noValidate
            autoComplete="off"
          >
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <FormInputText
                    type="text"
                    name="name"
                    label={'Tên cầu thủ'}
                    defaultValue=""
                    placeholder="Nhập tên cầu thủ"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Vị trí
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Vị trí"
                    >
                      <MenuItem value={0}>Tất cả</MenuItem>
                      <MenuItem value={1}>Thủ môn</MenuItem>
                      <MenuItem value={2}>Hậu vệ</MenuItem>
                      <MenuItem value={2}>Hậu vệ biên</MenuItem>
                      <MenuItem value={2}>Tiền vệ</MenuItem>
                      <MenuItem value={2}>Tiền vệ biên</MenuItem>
                      <MenuItem value={2}>Trung vệ</MenuItem>
                      <MenuItem value={2}>Tiền đạo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Trạng thái
                    </InputLabel>
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
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Đội thi đấu
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Đội thi đấu"
                    >
                      <MenuItem value={0}>Tất cả</MenuItem>
                      <MenuItem value={1}>Hoạt động</MenuItem>
                      <MenuItem value={2}>Hoạt động</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box mt={1}>
                <Grid container spacing={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid item xs={3}>
                      <MuiRHFDatePicker name="from" label="Từ ngày" />
                    </Grid>
                    <Grid item xs={3}>
                      <MuiRHFDatePicker name="to" label="Đến ngày" />
                    </Grid>
                  </LocalizationProvider>
                  <Grid
                    container
                    item
                    xs={6}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <MuiButton
                      title="Tìm kiếm "
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{ width: '33%' }}
                      startIcon={<SearchSharp />}
                    />

                    <MuiButton
                      title="Làm mới"
                      variant="contained"
                      color="primary"
                      // onClick={onResetFilters}
                      sx={{ width: '33%' }}
                      startIcon={<Icon>cached</Icon>}
                    />

                    <MuiButton
                      title="Xuất excel"
                      variant="contained"
                      color="primary"
                      // onClick={onResetFilters}
                      sx={{ width: '33%' }}
                      startIcon={<SimCardDownloadIcon />}
                    />
                  </Grid>
                </Grid>
              </Box>
            </FormProvider>
          </form>
        </SimpleCard>
        <SimpleCard title="Danh sách cầu thủ">
          <StyledTable>
            <TableHead>
              <TableRow>
                {headTablePlayer.map(header => (
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
                  <RankIcon rank={1} sx={{ fontSize: 30 }} />
                </TableCell>
                <TableCell align="center">
                  <Link to="/">Đoàn Văn Hậu</Link>
                </TableCell>
                <TableCell align="center">Hậu vệ</TableCell>
                <TableCell align="center">Đội hình 1,U20</TableCell>
                <TableCell align="center">22/03/2023</TableCell>
                <TableCell align="center">186</TableCell>
                <TableCell align="center">22/03/2023</TableCell>
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
      </Stack>
    </Container>
  )
}
