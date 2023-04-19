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
  Autocomplete,
} from '@mui/material'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload'
import { useState } from 'react'
import { MuiButton } from 'app/components/common/MuiButton'
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
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
import { PlayersFilters, TeamResponse, TitlePlayer } from 'app/models'
import { getListPlayer } from 'app/apis/players/players.service'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { getListTeam } from 'app/apis/teams/teams.service'
import { MuiRHFAutoComplete } from 'app/components/common/MuiRHFAutoComplete'
import moment from 'moment'
import * as XLSX from 'xlsx'

export interface Props {}
const optionPosition = [
  { name: 'Thủ môn', value: 0 },
  { name: 'Hậu vệ', value: 1 },
  { name: 'Hậu vệ biên', value: -1 },
  { name: 'Tiền vệ', value: -2 },
  { name: 'Tiền vệ biên', value: -3 },
  { name: 'Trung vệ', value: -4 },
  { name: 'Tiền đạo', value: -5 },
]

export default function PlayerManager(props: Props) {
  let count = 1
  const [teamDefault, setTeamDefault] = useState<any>('')
  const navigate = useNavigateParams()
  const navigation = useNavigate()
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(20)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const onClickRow = (cell: any, row: any) => {
    if (cell.id === 'name') {
      navigation(`${row.id}/`)
    }
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        page: +newPage,
      }
    })
    navigate('', {
      ...filters,
      page: +newPage,
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
        size: +event.target.value,
      }
    })
    navigate('', {
      ...filters,
      page: 0,
      size: +event.target.value,
    } as any)
  }

  const [defaultValues] = useState<PlayersFilters>({
    status: queryParams.status ?? 'all',
    name: queryParams.search ?? '',
    position: queryParams.position ?? '',
    dateStart: queryParams.dateStart ?? '',
    dateEnd: queryParams.dateEnd ?? '',
    team: queryParams.team ?? '',
    sort: queryParams.sort ?? '',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })
  const [filters, setFilters] = useState<PlayersFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )
  const { data, isLoading, isFetching, isError, error } = useQuery<
    TitlePlayer[],
    Error
  >(['players', filters], () => getListPlayer(filters), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!filters,
  })

  const { data: teams }: UseQueryResult<TeamResponse, Error> = useQuery<
    TeamResponse,
    Error
  >(['teams'], () => getListTeam({ size: 5000, page: 0 }), {
    refetchOnWindowFocus: false,
    staleTime: 15 * 60 * 1000,
  })

  const validationSchema = Yup.object().shape(
    {
      name: Yup.string()
        .min(0, 'email must be at least 0 characters')
        .max(255, 'Nội dung không được vượt quá 255 ký tự'),
    },

    //   dateStart: Yup.date()
    //     .when('to', (to, yup) => {
    //       if (to && to != 'Invalid Date') {
    //         const dayAfter = new Date(to.getTime())
    //         return yup.max(dayAfter, 'Ngày đắt đầu không lớn hơn ngày kết thúc')
    //       }
    //       return yup
    //     })
    //     .typeError('Sai định dạng.')
    //     .nullable(),
    //   dateEnd: Yup.date()
    //     .when('from', (from, yup) => {
    //       if (from && from != 'Invalid Date') {
    //         const dayAfter = new Date(from.getTime())
    //         return yup.min(dayAfter, 'Ngày kết thúc phải lớn hơn ngày đắt đầu')
    //       }
    //       return yup
    //     })
    //     .typeError('Sai định dạng.')
    //     .nullable(),
    // },
    // [['from', 'to']],
  )

  const methods = useForm<PlayersFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })
  const from = methods.watch('dateStart')
  const to = methods.watch('dateEnd')

  React.useEffect(() => {
    if (!from || !to) return
    if (moment(new Date(from)).unix() <= moment(new Date(to)).unix()) {
      methods.clearErrors('dateStart')
      methods.clearErrors('dateEnd')
    }
  }, [from, to])

  React.useEffect(() => {
    if (searchParams) {
      if (!!Object.keys(queryParams).length) {
        setPage(parseInt(queryParams.page) || 0)
        setSize(parseInt(queryParams.size) || 20)

        setFilters(prevFilters => {
          return {
            ...prevFilters,
            ...queryParams,
          }
        })
      }
    }
  }, [searchParams])
  const onSubmitHandler: SubmitHandler<PlayersFilters> = (
    values: PlayersFilters,
  ) => {
    removeParamsHasDefaultValue(values)
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        ...values,
      }
    })
    navigate('', {
      ...filters,
      ...values,
    } as any)
  }

  const removeParamsHasDefaultValue = (objParams: Record<string, any>) => {
    Object.keys(objParams).forEach(key => {
      if (objParams[key] === 'all') objParams[key] = ''
    })
  }
  const onResetFilters = () => {
    methods.reset({
      name: '',
      position: '',
      status: '',
      dateStart: '',
      dateEnd: '',
      team: '',
      page: 0,
      size: 20,
    })

    setPage(0)
    setSize(20)

    setFilters({
      page: 0,
      size: 20,
    })

    navigate('', {
      page: 0,
      size: 20,
    } as any)
  }
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'Tất cả'
      case 1:
        return 'Hoạt động'
      case -1:
        return 'Không hoạt động'
    }
  }
  const onExportEcel = (fileName: any) => {
    console.log(data)
    // const ws = XLSX.utils.json_to_sheet(data ?? [])
    // const wb = XLSX.utils.book_new()
    // XLSX.utils.book_append_sheet(wb, ws, fileName)
    // XLSX.writeFile(wb, `${fileName}.xlsx`)
  }

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
          onClick={() => navigation(`/`, {})}
          startIcon={<Icon>control_point</Icon>}
        />
      </Stack>
      <Stack gap={3}>
        <SimpleCard>
          <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
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
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <Autocomplete
                    multiple
                    limitTags={2}
                    id="multiple-limit-tags"
                    options={optionPosition}
                    getOptionLabel={option => option.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Vị trí"
                        placeholder="Vị trí"
                      />
                    )}
                    sx={{ width: '100%' }}
                  />
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
                      <MenuItem value={-1}>Không hoạt động</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <MuiRHFAutoComplete
                    label="Đội thi đấu"
                    name="idTeam"
                    options={teams?.content ?? {}}
                    optionProperty="name"
                    getOptionLabel={option => option.name ?? ''}
                    defaultValue=""
                  />
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
                      onClick={onResetFilters}
                      sx={{ width: '33%' }}
                      startIcon={<Icon>cached</Icon>}
                    />

                    <MuiButton
                      title="Xuất excel"
                      variant="contained"
                      color="primary"
                      onClick={() => onExportEcel('Player')}
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
                {columnsPlayers.map(header => (
                  <TableCell align="center" style={{ minWidth: header.width }}>
                    {header.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map(item => (
                <TableRow key={item.id}>
                  <TableCell align="center">{count++}</TableCell>
                  <TableCell align="center">
                    {item.priority !== null && (
                      <RankIcon
                        rank={item.priority ?? 0}
                        sx={{ fontSize: 30 }}
                      ></RankIcon>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <Link to="/">{item.name}</Link>
                  </TableCell>
                  <TableCell align="center">{item.position}</TableCell>
                  <TableCell align="center">{item.idTeam}</TableCell>
                  <TableCell align="center">{item.dateOfBirth}</TableCell>
                  <TableCell align="center">{item.height}</TableCell>
                  <TableCell align="center">{item.dateJoined}</TableCell>
                  <TableCell align="center">
                    {item.status !== undefined ? (
                      <Chip
                        label={getStatusText(item.status)}
                        color="success"
                      />
                    ) : (
                      'Unknown'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Sửa" placement="top">
                      <IconButton color="primary">
                        <BorderColorIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
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
