import {
  Box,
  Icon,
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import { useEffect, useState } from 'react'

const StyledTable = styled(Table)(() => ({
  whiteSpace: 'pre',
  '& thead': {
    '& tr': { '& th': { paddingLeft: 0, paddingRight: 0 } },
  },
  '& tbody': {
    '& tr': { '& td': { paddingLeft: 0, textTransform: 'capitalize' } },
  },
}))

const ListHandBookUnlinked = ({
  tableData,
  handleLinkedHandbook,
  msgNoContent,
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [arrCheck, setArrCheck] = useState([])

  const handleChangePage = (_, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  useEffect(() => {
    const arr = tableData.map(data => {
      return {
        id: data.id,
        ckeck: true,
      }
    })
    setArrCheck(arr)
  }, [])

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left" width="100px">
              STT
            </TableCell>
            <TableCell align="center" width="400px">
              Tên cẩm nang
            </TableCell>
            <TableCell align="center" width="200px">
              Liên kết
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                {msgNoContent}
              </td>
            </tr>
          )}
          {tableData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((handbook, index) => (
              <TableRow key={handbook.id}>
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell align="center">{handbook.title}</TableCell>
                <TableCell align="center">
                  {!handbook.linked ? (
                    <Button
                      variant="text"
                      onClick={() => handleLinkedHandbook(index, true)}
                    >
                      Thêm <Icon>task_alt_icon</Icon>
                    </Button>
                  ) : (
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => handleLinkedHandbook(index, false)}
                    >
                      Bỏ thêm <Icon>highlight_off_icon</Icon>
                    </Button>
                  )}
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
        count={tableData.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[20, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ 'aria-label': 'Next Page' }}
        backIconButtonProps={{ 'aria-label': 'Previous Page' }}
      />
    </Box>
  )
}

export default ListHandBookUnlinked
