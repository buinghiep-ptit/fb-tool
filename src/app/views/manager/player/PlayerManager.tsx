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
import { columnsPlayers } from 'app/utils/columns'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import StarIcon from '@mui/icons-material/Star'
import Star from '@mui/icons-material/Star'
import RankIcon from 'app/components/common/RankIcon'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { PlayerResponse, PlayersFilters, TitlePlayer } from 'app/models'
import { getListPlayer } from 'app/apis/players/players.service'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
export interface Props {}

export default function PlayerManager(props: Props) {
  const navigate = useNavigateParams()
  const navigation = useNavigate()
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(1)
  const onClickRow = (cell: any, row: any) => {
    if (cell.id === 'name') {
      navigation(`${row.id}/`)
    }
  }

  const handleChangePage = (service: unknown, newPage: number) => {
    setPage(newPage)
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        page: newPage,
      }
    })
    navigate('', {
      ...filters,
      page: newPage,
    } as any)
  }
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSize(+event.target.value)
    setPage(0)
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        page: 0,
        size: parseInt(event.target.value, 10),
      }
    })
    navigate('', {
      ...filters,
      size: parseInt(event.target.value, 10),
    } as any)
  }

  const onSubmitHandler = () => console.log('Hello')
  const [defaultValues] = useState<PlayersFilters>({
    status: queryParams.status ?? '1',
    search: queryParams.search ?? '',
    position: queryParams.position ?? '',
    dateStart: queryParams.dateStart ?? '',
    dateEnd: queryParams.dateEnd ?? '',
    sort: queryParams.sort ?? '',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 1,
  })
  const [filters, setFilters] = useState<PlayersFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  }: UseQueryResult<PlayerResponse, Error> = useQuery<PlayerResponse, Error>(
    ['players', filters],
    () => getListPlayer(filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!filters,
    },
  )
  const validationSchema = Yup.object().shape({
    search: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(256, 'hashtag must be at almost 256 characters'),
  })

  const methods = useForm<PlayersFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  React.useEffect(() => {
    if (searchParams) {
      if (!!Object.keys(queryParams).length) {
        setPage(parseInt(queryParams.page) || 0)
        setSize(parseInt(queryParams.size) || 1)

        setFilters(prevFilters => {
          return {
            ...prevFilters,
            ...queryParams,
          }
        })
      }
    }
  }, [searchParams])

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
          <MuiStyledTable
            rows={data?.content as TitlePlayer[]}
            columns={columnsPlayers}
            onClickRow={onClickRow}
            isFetching={isFetching}
            rowsPerPage={size}
            page={page}
            // actions={[
            //   {
            //     icon: 'edit',
            //     color: 'warning',
            //     tooltip: 'Chi tiết',
            //     onClick: onRowUpdate,
            //   },
            //   {
            //     icon: 'delete',
            //     color: 'error',
            //     tooltip: 'Xoá',
            //     onClick: onRowDelete,
            //   },
            // ]}
          />
          <MuiStyledPagination
            component="div"
            rowsPerPageOptions={[20, 50, 100]}
            count={data ? (data?.totalElements as number) : 0}
            rowsPerPage={size}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </SimpleCard>
      </Stack>
    </Container>
  )
}
