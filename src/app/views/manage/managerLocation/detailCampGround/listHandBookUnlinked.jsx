import {
  Box,
  Icon,
  IconButton,
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

const ListHandBookUnlinked = ({ tableData }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
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
            <TableCell align="left">STT</TableCell>
            <TableCell align="center">Tên cẩm nang</TableCell>
            <TableCell align="center">Liên kết</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((subscriber, index) => (
              <TableRow key={index}>
                <TableCell align="left">{subscriber.id}</TableCell>
                <TableCell align="center">{subscriber.title}</TableCell>
                <TableCell align="center">
                  <Button variant="text">
                    Thêm <Icon>task_alt_icon</Icon>
                  </Button>
                  <Button variant="text" color="error">
                    Bỏ thêm <Icon>highlight_off_icon</Icon>
                  </Button>
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
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ 'aria-label': 'Next Page' }}
        backIconButtonProps={{ 'aria-label': 'Previous Page' }}
      />
    </Box>
  )
}

export default ListHandBookUnlinked
