import {
  Box,
  Typography,
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Icon,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import DialogCustom from 'app/components/common/DialogCustom'
import { cloneDeep } from 'lodash'
import { getListPolicy } from 'app/apis/campGround/ground.service'

const StyledTable = styled(Table)(() => ({
  whiteSpace: 'pre',
  '& thead': {
    '& tr': { '& th': { paddingLeft: 0, paddingRight: 0 } },
  },
  '& tbody': {
    '& tr': { '& td': { paddingLeft: 0, textTransform: 'capitalize' } },
  },
}))
const Policy = ({ setValue, detailPolicy, setDetailPolicy }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [tableData, setTableData] = useState([])

  const handleChangePage = (_, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const dialogCustomRef = useRef()

  const fetchListPolicy = async param => {
    await getListPolicy(param).then(data => {
      const newList = cloneDeep(data.content).map(policy => {
        const convertPolicy = {}
        convertPolicy.id = policy.id
        convertPolicy.name = policy.name
        convertPolicy.scaleAmount = policy.scaleAmount
        convertPolicy.scope = policy.scope
        convertPolicy.dateUpdated = policy.dateUpdated
        convertPolicy.minAmount = policy.minAmount
        convertPolicy.maxAmount = policy.maxAmount
        return convertPolicy
      })
      setTableData(newList)
    })
  }

  useEffect(() => {
    fetchListPolicy()
  }, [])

  return (
    <>
      {!!detailPolicy && (
        <div>
          <Typography variant="h6" gutterBottom>
            Đặt cọc
          </Typography>
          <div>
            {`- Loại chính sách: ${
              detailPolicy?.scope === 1 ? 'Chung' : 'Riêng'
            }`}
          </div>
          <div>{`- Tên chính sách: ${detailPolicy?.name}`}</div>
          <div>{`- ${detailPolicy?.scaleAmount}% giá trị giao dịch, Tối đa: ${
            detailPolicy?.maxAmount || ''
          }, Tối thiểu: ${detailPolicy.minAmount || ''}`}</div>
        </div>
      )}
      <Button
        style={{ marginTop: '20px' }}
        variant="contained"
        onClick={() => {
          dialogCustomRef.current.handleClickOpen()
        }}
      >
        Chọn lại
      </Button>
      <DialogCustom ref={dialogCustomRef} title="Chọn chính sách" maxWidth="md">
        {' '}
        <Box width="100%" overflow="auto">
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell align="left" width="100px">
                  STT
                </TableCell>
                <TableCell align="center" width="400px">
                  Tên chính sách
                </TableCell>
                <TableCell align="center" width="200px">
                  Phạm vi
                </TableCell>
                <TableCell align="center" width="300px">
                  Giá trị
                </TableCell>
                <TableCell align="center" width="300px">
                  Thời gian cập nhật
                </TableCell>
                <TableCell align="center" width="300px">
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((policy, index) => (
                  <TableRow key={policy.id}>
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="center">{policy.name}</TableCell>
                    <TableCell align="center">{policy.scope}</TableCell>
                    <TableCell align="center">{policy.scaleAmount}</TableCell>
                    <TableCell align="center">{policy.dateUpdated}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        onClick={() => {
                          setValue('policy', policy.id)
                          setDetailPolicy({
                            scope: policy.scope,
                            scaleAmount: policy.scaleAmount,
                            name: policy.name,
                            minAmount: policy.minAmount,
                            maxAmount: policy.maxAmount,
                          })
                          dialogCustomRef.current.handleClose()
                        }}
                      >
                        Chọn
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
      </DialogCustom>
    </>
  )
}

export default Policy
