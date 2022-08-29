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
import { useState } from 'react'
import { SimpleCard } from 'app/components'

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

const TableCustom = ({ title, dataTable, tableModel, pagination }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (_, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <SimpleCard title={title}>
      <Box width="100%" overflow="auto">
        <StyledTable>
          <TableHead>
            <TableRow>
              {tableModel.headCell.map((cell, index) => {
                if (cell.width) {
                  return (
                    <TableCell
                      align="center"
                      key={index}
                      style={{ width: cell.width }}
                    >
                      {cell.name}
                    </TableCell>
                  )
                }
                return (
                  <TableCell align="center" key={index}>
                    {cell.name}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {dataTable.map((data, index) => (
              <TableRow key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                {tableModel.bodyCell.map((element, id) => {
                  switch (element) {
                    case 'status':
                      return (
                        <TableCell align="center" key={id}>
                          <Switch checked={data[element]} />
                        </TableCell>
                      )
                    case 'action':
                      return (
                        <TableCell align="right" key={id}>
                          {data[element].map((type, indexType) => (
                            <IconButton key={indexType}>
                              <Icon color="error">{type}</Icon>
                            </IconButton>
                          ))}
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
            count={dataTable.length}
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
