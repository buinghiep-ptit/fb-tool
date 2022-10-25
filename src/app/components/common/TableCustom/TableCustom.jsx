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
import React, { useState } from 'react'
import { SimpleCard } from 'app/components'
import { Link, useNavigate } from 'react-router-dom'
import { cloneDeep } from 'lodash'
import DialogCustom from '../DialogCustom'
import { toastSuccess } from 'app/helpers/toastNofication'

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
        paddingLeft: 0,
        textTransform: 'capitalize',
      },
    },
  },
}))

const TableCustom = ({
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
}) => {
  const dialogConfirm = React.useRef()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [filterTable, setFilterTable] = useState({ name: '', size: 5, page: 0 })
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

  const handleDeleteAction = async id => {
    const res = await onDeleteData(id)
    if (res) {
      toastSuccess({ message: 'Đã được xóa' })
      fetchDataTable({ ...filterTable })
    }
  }

  const handleAddAction = async id => {
    const res = await onAddData(id)
    if (res) {
      toastSuccess({ message: 'Liên kết thành công' })
      fetchDataTable({ ...filterTable })
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
                  <TableCell align="center" key={cell.name}>
                    {cell.name}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>

          <TableBody>
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
                                width: '120px',
                                height: '90px',
                                objectFit: 'cover',
                              }}
                            />
                          )}
                        </TableCell>
                      )
                    case 'index':
                      return (
                        <TableCell align="center" key={`${element}${id}`}>
                          {index + 1}
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
                                    console.log(data.linkDetail.path)
                                    navigate(
                                      `${data.linkDetail.path}${data.id}`,
                                    )
                                  }}
                                >
                                  <Icon color="error">{type}</Icon>
                                </IconButton>
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
                          key={`${element}${id}`}
                          style={{ wordBreak: 'normal' }}
                        >
                          <Link to={`${data[element].path}${data.id}`}>
                            {data[element].link}
                          </Link>
                        </TableCell>
                      )
                    case 'eventPlace':
                      return (
                        <TableCell
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
                      return (
                        <TableCell
                          align="left"
                          key={`${element}${id}`}
                          style={{ wordBreak: 'normal' }}
                        >
                          {data[element]}
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
            rowsPerPageOptions={[5, 10, 25]}
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
    </SimpleCard>
  )
}

export default TableCustom
