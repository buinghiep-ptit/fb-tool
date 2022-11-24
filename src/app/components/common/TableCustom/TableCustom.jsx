import {
  Box,
  Icon,
  styled,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  IconButton,
  TablePagination,
  Switch,
  Button,
  Typography,
} from '@mui/material'
import React, { forwardRef, useEffect, useState } from 'react'
import { SimpleCard } from 'app/components'
import { Link, useNavigate } from 'react-router-dom'
import { cloneDeep, isNaN } from 'lodash'
import DialogCustom from '../DialogCustom'
import { toastSuccess } from 'app/helpers/toastNofication'
import ServiceDetail from 'app/views/manage/managerServices/ServiceDetail'

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: 'pre',
  '& thead': {
    '& tr': {
      '& th': {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  },
  '& tbody': {
    '& tr': {
      '& td': {
        paddingLeft: 10,
        paddingRight: 10,
        textTransform: 'capitalize',
      },
    },
  },
}))

const TableCustom = forwardRef(
  (
    {
      title,
      totalData,
      dataTable,
      tableModel,
      pagination,
      fetchDataTable,
      onDeleteData,
      onAddData,
      filter,
      updateStatus,
    },
    ref,
  ) => {
    React.useImperativeHandle(ref, () => ({
      handleClickSearch: () => {
        setPage(0)
      },
    }))

    const dialogConfirm = React.useRef()
    const dialogCustomRef = React.useRef()
    const [selectedId, setSelectedId] = React.useState()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [filterTable, setFilterTable] = useState({
      name: '',
      size: 20,
      page: 0,
    })
    const idDelete = React.useRef()
    const navigate = useNavigate()
    const handleChangePage = (_, newPage) => {
      setPage(newPage)
      filter.page = newPage
      filter.size = rowsPerPage
      setFilterTable(cloneDeep(filter))
      fetchDataTable(filter)
    }

    const handleChangeRowsPerPage = event => {
      setRowsPerPage(+event.target.value)
      setPage(0)
      filter.page = 0
      filter.size = +event.target.value
      setFilterTable(cloneDeep(filter))
      fetchDataTable(filter)
    }

    const isNumeric = value => {
      return /^-?\d+$/.test(value)
    }

    const handleDeleteAction = async id => {
      const res = await onDeleteData(id)
      if (res) {
        toastSuccess({ message: 'Đã được xóa' })
        fetchDataTable(filter)
      }
    }

    const handleAddAction = async id => {
      const res = await onAddData(id)
      if (res) {
        toastSuccess({ message: 'Liên kết thành công' })
        fetchDataTable(filter)
      }
    }

    return (
      <SimpleCard title={title}>
        <Box width="100%" overflow="auto">
          <StyledTable>
            <TableHead>
              <TableRow>
                {tableModel.headCell.map(cell => {
                  if (cell.width) {
                    return (
                      <TableCell
                        align="center"
                        key={cell.name}
                        style={{ minWidth: cell.width }}
                      >
                        {cell.name}
                      </TableCell>
                    )
                  }
                  return (
                    <TableCell
                      align="center"
                      key={cell.name}
                      style={{ minWidth: 100 }}
                    >
                      {cell.name}
                    </TableCell>
                  )
                })}
              </TableRow>
            </TableHead>

            <TableBody>
              {dataTable.length === 0 && (
                <tr>
                  <td
                    colSpan={tableModel.headCell.length}
                    style={{ textAlign: 'center', padding: '20px' }}
                  >
                    Không tồn tại bản ghi
                  </td>
                </tr>
              )}
              {(dataTable || []).map((data, index) => (
                <TableRow key={data.id} style={{ wordbreak: 'normal' }}>
                  {tableModel.bodyCell.map((element, id) => {
                    switch (element) {
                      case 'image':
                        return (
                          <TableCell align="center" key={`${element}${id}`}>
                            {data[element] && (
                              <img
                                src={data[element]}
                                style={{
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  padding: '5px',
                                  width: '100px',
                                  height: '60px',
                                  objectFit: 'cover',
                                }}
                              />
                            )}
                          </TableCell>
                        )
                      case 'index':
                        return (
                          <TableCell align="center" key={`${element}${id}`}>
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                        )
                      case 'status':
                        if (data[element] === 0) {
                          return data[element]
                        }
                        return (
                          <TableCell align="center" key={`${element}${id}`}>
                            <Switch
                              defaultChecked={data[element]}
                              onChange={e => {
                                updateStatus(data.id, e.target.checked ? 1 : -1)
                                fetchDataTable(filterTable)
                              }}
                            />
                          </TableCell>
                        )
                      case 'action':
                        return (
                          <TableCell align="right" key={id}>
                            {data[element].map((type, indexType) => {
                              if (type === 'delete') {
                                return (
                                  <IconButton
                                    key={indexType}
                                    onClick={() => {
                                      dialogConfirm.current.handleClickOpen()
                                      idDelete.current = data.id
                                    }}
                                  >
                                    <Icon color="error">{type}</Icon>
                                  </IconButton>
                                )
                              }

                              if (type === 'add') {
                                return (
                                  <IconButton
                                    key={indexType}
                                    onClick={() => {
                                      handleAddAction(data.id)
                                    }}
                                  >
                                    <Icon color="error">{type}</Icon>
                                  </IconButton>
                                )
                              }

                              if (type === 'edit') {
                                return (
                                  <IconButton
                                    key={indexType}
                                    onClick={() => {
                                      navigate(
                                        `${data.linkDetail.path}${data.id}`,
                                        {
                                          state: { modal: true },
                                        },
                                      )
                                    }}
                                  >
                                    <Icon color="error">{type}</Icon>
                                  </IconButton>
                                )
                              }

                              if (type === 'editModal') {
                                return (
                                  <>
                                    <IconButton
                                      key={indexType}
                                      onClick={() => {
                                        setSelectedId(data.id)
                                        dialogCustomRef.current.handleClickOpen()
                                      }}
                                    >
                                      <Icon color="error">edit</Icon>
                                    </IconButton>
                                  </>
                                )
                              }

                              return (
                                <IconButton key={indexType}>
                                  <Icon color="error">{type}</Icon>
                                </IconButton>
                              )
                            })}
                          </TableCell>
                        )
                      case 'linkDetail':
                        return (
                          <TableCell
                            align="left"
                            key={`${element}${id}`}
                            style={{ wordBreak: 'normal' }}
                          >
                            <Link
                              to={`${data[element].path}${data.id}`}
                              style={{
                                textDecoration: 'underline',
                                color: '#07bc0c',
                                wordBreak: 'normal',
                                // whiteSpace: 'nowrap',
                                // width: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                webkitLineClamp: '2',
                                display: '-webkit-box',
                                webkitBoxOrient: 'vertical',
                              }}
                            >
                              {data[element].link}
                            </Link>
                          </TableCell>
                        )
                      case 'contact':
                        return (
                          <TableCell
                            align="left"
                            key={`${element}${id}`}
                            style={{ wordBreak: 'normal', color: '#07bc0c' }}
                          >
                            <Link
                              style={{ textDecoration: 'underline' }}
                              to={`/cap-nhat-thong-tin-doi-tac/${data.idMerchant}`}
                            >
                              {data[element]}
                            </Link>
                          </TableCell>
                        )
                      case 'eventPlace':
                        return (
                          <TableCell
                            align="center"
                            key={`${element}${id}`}
                            style={{ wordBreak: 'normal' }}
                          >
                            <span style={{ color: '#217f32' }}>
                              {data[element].active} -
                            </span>{' '}
                            <span style={{ color: 'red' }}>
                              {data[element].inactive}
                            </span>
                          </TableCell>
                        )
                      default:
                        const alight = !isNumeric(data[element])
                          ? 'left'
                          : 'center'
                        console.log(parseInt(data[element]))
                        return (
                          <TableCell align={alight} key={`${element}${id}`}>
                            <div
                              style={{
                                wordBreak: 'normal',
                                // whiteSpace: 'nowrap',
                                // width: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                webkitLineClamp: '2',
                                display: '-webkit-box',
                                webkitBoxOrient: 'vertical',
                              }}
                            >
                              {data[element]}
                            </div>
                          </TableCell>
                        )
                    }
                  })}
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
          {pagination && (
            <TablePagination
              sx={{ px: 2 }}
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={totalData || 0}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[20, 50, 100]}
              labelRowsPerPage={'Dòng / Trang'}
              onRowsPerPageChange={handleChangeRowsPerPage}
              nextIconButtonProps={{ 'aria-label': 'Next Page' }}
              backIconButtonProps={{ 'aria-label': 'Previous Page' }}
            />
          )}
        </Box>
        <DialogCustom ref={dialogConfirm} title="Xác nhận" maxWidth="sm">
          <Typography variant="h5" component="h6" align="center" mt={5} mb={5}>
            Bạn chắc chắn muốn xóa?
          </Typography>
          <div style={{ textAlign: 'center' }}>
            <Button
              style={{ marginRight: '10px' }}
              color="primary"
              variant="contained"
              type="button"
              onClick={() => {
                dialogConfirm.current.handleClose()
                handleDeleteAction(idDelete.current)
              }}
            >
              Đồng ý
            </Button>
            <Button
              style={{ backgroundColor: '#cccccc' }}
              variant="contained"
              type="button"
              onClick={() => {
                dialogConfirm.current.handleClose()
              }}
            >
              Hủy
            </Button>
          </div>
        </DialogCustom>
        <DialogCustom
          ref={dialogCustomRef}
          title="Cập nhật dịch vụ"
          maxWidth="xl"
        >
          <ServiceDetail
            isModal={false}
            handleCloseModal={() => dialogCustomRef.current.handleClose()}
            extendFunction={() => fetchDataTable(filterTable)}
            idService={selectedId}
          />
        </DialogCustom>
      </SimpleCard>
    )
  },
)

export default TableCustom
