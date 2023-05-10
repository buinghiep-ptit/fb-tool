import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import SortIcon from '@mui/icons-material/Sort'
import {
  Button,
  Grid,
  Icon,
  IconButton,
  LinearProgress,
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
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import * as React from 'react'
import { useState } from 'react'
import DialogCreateLogo from './DialogCreateLogo'
import DialogDeleteLogo from './DialogDeleteLogo'
import DialogSortLogos from './DialogSortLogos'
import DialogUpdateLogo from './DialogUpdateLogo'
import { headTableLogos } from './const'

const CardTitle = styled(Box)<Props>(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: 'none',
}))

export interface Props {}

export default function LogoManager(props: Props) {
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

  const [isLoading, setIsLoading] = useState(false)

  const fetchListLogo = async () => {
    setIsLoading(true)
    await getLogos({
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
          routeSegments={[{ name: 'Quản lý logo', path: '/logos' }]}
        />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Thêm mới logo"
          variant="contained"
          color="primary"
          type="button"
          onClick={() => dialogCreateLogoRef?.current.handleClickOpen()}
          startIcon={<Icon>control_point</Icon>}
        />
      </Stack>

      <Stack gap={1}>
        <div style={{ height: '30px' }} />
        <SimpleCard>
          <Grid container justifyContent="space-between">
            <CardTitle>Danh sách logo</CardTitle>
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
                onClick={reset}
                startIcon={<RefreshIcon />}
              >
                Làm mới
              </Button>
            </Box>
          </Grid>
          {logos?.length === 0 && (
            <Typography color="gray" textAlign="center">
              Không có dữ liệu
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
                          height="100px"
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
    </Container>
  )
}
