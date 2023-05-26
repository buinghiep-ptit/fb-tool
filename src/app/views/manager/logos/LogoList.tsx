import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SortIcon from '@mui/icons-material/Sort'
import {
  Button,
  Grid,
  Icon,
  IconButton,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import Link from '@mui/material/Link'
import { red } from '@mui/material/colors'
import { Box, styled } from '@mui/system'
import { getLogos } from 'app/apis/logos/logos.service'
import { SimpleCard, StyledTable } from 'app/components'
import * as React from 'react'
import { useState } from 'react'
import DialogCreateLogo from './DialogCreateLogo'
import DialogDeleteLogo from './DialogDeleteLogo'
import DialogSortLogos from './DialogSortLogos'
import DialogUpdateLogo from './DialogUpdateLogo'
import { headTableLogos } from './const'

const CardTitle = styled(Box)<any>(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: 'none',
}))

export interface Props {
  index: number
  value: number
  type: number
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LogoList(props: Props) {
  const { value, index, type, isLoading, setIsLoading, ...other } = props

  const dialogCreateLogoRef = React.useRef<any>(null)
  const dialogUpdateLogoRef = React.useRef<any>(null)
  const dialogSortLogosRef = React.useRef<any>(null)
  const dialogDeleteLogoRef = React.useRef<any>(null)
  const [focusedLogo, setFocusedLogo] = useState<any>()

  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [doRerender, setDoRerender] = useState(false)

  const [logos, setLogos] = useState<any>()

  const fetchListLogo = async () => {
    setIsLoading(true)
    await getLogos({
      type: type,
      page: page,
      size: rowsPerPage,
    })
      .then(res => {
        setLogos(res.content)
        setCountTable(res.totalElements)
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  const reset = () => {
    setPage(0)
    setDoRerender(!doRerender)
  }

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

  React.useEffect(() => {
    fetchListLogo()
  }, [page, doRerender])

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Stack gap={1}>
        <div style={{ height: '30px' }} />
        <SimpleCard>
          <Grid container justifyContent="space-between">
            <CardTitle>
              {type === 1
                ? 'Danh sách logo nhà tài trợ chính'
                : 'Danh sách logo nhà tài trợ thường'}
            </CardTitle>
            <Box>
              <Button
                disabled={isLoading}
                sx={{ mx: 1 }}
                onClick={() => {
                  dialogSortLogosRef?.current.handleClickOpen()
                }}
                startIcon={<SortIcon />}
              >
                Sắp xếp
              </Button>
              <Button
                disabled={isLoading}
                sx={{ mx: 1 }}
                onClick={() => {
                  dialogCreateLogoRef?.current.handleClickOpen()
                }}
                startIcon={<Icon>control_point</Icon>}
              >
                Thêm mới
              </Button>
            </Box>
          </Grid>
          {logos?.length === 0 && (
            <Typography color="gray" textAlign="center">
              Không có kết quả thỏa mãn điều kiện tìm kiếm
            </Typography>
          )}
          <Box width="100%" overflow="auto" hidden={logos?.length === 0}>
            <StyledTable>
              <TableHead>
                <TableRow>
                  {headTableLogos.map(header => (
                    <TableCell
                      align="center"
                      style={{ minWidth: header.width }}
                      key={header.name}
                    >
                      {header.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(logos || []).map((logo: any, index: any) => {
                  return (
                    <TableRow hover key={logo.id}>
                      <TableCell align="center">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ background: 'tomato', p: 1 }}
                      >
                        <img
                          src={logo.logo}
                          height="60px"
                          style={{ objectFit: 'contain' }}
                        ></img>
                      </TableCell>
                      <TableCell align="left">
                        <Link href={logo.strUrl}>{logo.strUrl}</Link>
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa" placement="top">
                          <IconButton
                            onClick={() => {
                              setFocusedLogo(logo)
                              dialogUpdateLogoRef?.current.handleClickOpen()
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa" placement="top">
                          <IconButton
                            onClick={() => {
                              setFocusedLogo(logo)
                              dialogDeleteLogoRef?.current.handleClickOpen()
                            }}
                          >
                            <DeleteIcon sx={{ color: red[500] }} />
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
      </Stack>

      <DialogCreateLogo
        ref={dialogCreateLogoRef}
        type={type}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={reset}
      />

      <DialogUpdateLogo
        ref={dialogUpdateLogoRef}
        logoId={focusedLogo?.id}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={reset}
      />

      <DialogDeleteLogo
        ref={dialogDeleteLogoRef}
        logo={focusedLogo}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={reset}
      />

      <DialogSortLogos
        ref={dialogSortLogosRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={reset}
        list={logos}
      />
    </div>
  )
}
