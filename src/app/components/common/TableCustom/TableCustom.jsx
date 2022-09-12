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
} from '@mui/material'
import { useEffect, useState } from 'react'
import { SimpleCard } from 'app/components'
import { updatePlaceStatus } from 'app/apis/place/place.service'
import { Link } from 'react-router-dom'
import { cloneDeep } from 'lodash'

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
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [filterTable, setFilterTable] = useState({ name: '', size: 5, page: 0 })
  const handleChangePage = (_, newPage) => {
    console.log('xx')
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
    if (res) fetchDataTable({ ...filterTable })
  }

  const handleAddAction = async id => {
    console.log('xxx')
    const res = await onAddData(id)
    if (res) fetchDataTable({ ...filterTable })
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
                      style={{ width: cell.width }}
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
            {dataTable.map((data, index) => (
              <TableRow key={index}>
                {tableModel.bodyCell.map((element, id) => {
                  switch (element) {
                    case 'image':
                      return (
                        <TableCell align="center" key={id}>
                          <img src={data[element]} />
                        </TableCell>
                      )
                    case 'index':
                      return (
                        <TableCell align="center" key={id}>
                          {index + 1}
                        </TableCell>
                      )
                    case 'status':
                      return (
                        <TableCell align="center" key={id}>
                          <Switch
                            defaultChecked={data[element]}
                            onChange={e => {
                              updatePlaceStatus(
                                data.id,
                                e.target.checked ? 1 : -1,
                              )
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
                                    handleDeleteAction(data.id)
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
                        <TableCell align="center" key={id}>
                          <Link to={`/chi-tiet-dia-danh/${data.id}`}>
                            {data[element]}
                          </Link>
                        </TableCell>
                      )
                    default:
                      return (
                        <TableCell align="center" key={id}>
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
    </SimpleCard>
  )
}

export default TableCustom
