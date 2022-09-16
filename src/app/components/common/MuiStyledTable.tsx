import { Skeleton, styled } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Box } from '@mui/system'
import { TableColumn } from 'app/models'
import * as React from 'react'

export const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #f1f1f1;
  }
  &:last-child td,
  &:last-child th {
    border: 0;
  }
  :hover {
    background-color: black;
  }
`

type MuiPagingTableProps<T extends Record<string, any>> = {
  columns: readonly TableColumn<keyof T | 'action' | 'order' | 'something'>[]
  rows: T[]
  onClickRow?: (cell: any, row: any) => void
  isFetching: boolean
}

export default function MuiPagingTable<T extends Record<string, any>>({
  columns,
  rows,
  onClickRow,
  isFetching,
}: MuiPagingTableProps<T>) {
  const memoizedData = React.useMemo(() => rows, [rows])
  const memoizedColumns = React.useMemo(() => columns, [columns])
  const skeletons = Array.from({ length: 10 }, (x, i) => i)
  const noDataFound =
    !isFetching && (!memoizedData || !(memoizedData as T[]).length)

  const cellFormatter = (cell: any, row: any, value: any) => {
    if (cell.status) {
      return cell.status(value)
    }
    if (cell.action) {
      return cell.action(value ? value : row.status)
    }
    return cell.format ? cell.format(value) : value
  }

  return (
    <>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          {!isFetching && (
            <TableHead>
              <TableRow>
                {columns.map((column, idx) => (
                  <TableCell
                    key={idx}
                    align={column.align}
                    sx={{
                      minWidth: column.minWidth,
                      width: 50,
                      padding: '12px',
                      backgroundColor: 'white',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {!isFetching ? (
              memoizedData.map((row, index) => {
                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index} //row.userId ?? row.customerId ?? row.id ??
                    sx={{
                      '&.MuiTableRow-hover': {
                        '&:hover': {
                          backgroundColor: '#d9d9d9',
                        },
                      },
                    }}
                  >
                    {memoizedColumns.map((column, idx) => {
                      const value = idx === 0 ? index + 1 : row[column.id]
                      return (
                        <TableCell
                          key={idx}
                          align={column.align}
                          onClick={() => onClickRow?.(column, row)}
                          sx={{
                            minWidth: column.minWidth,
                            px: 1.5,
                            cursor: column.action ? 'pointer' : 'default',
                            // whiteSpace: 'nowrap',
                            // overflow: 'hidden',
                            // textOverflow: 'ellipsis',
                          }}
                        >
                          {cellFormatter(column, row, value)}
                        </TableCell>
                      )
                    })}
                  </StyledTableRow>
                )
              })
            ) : (
              <>
                {skeletons.map(skeleton => (
                  <TableRow key={skeleton}>
                    {Array.from({ length: columns.length }, (x, i) => i).map(
                      elm => (
                        <TableCell key={elm} sx={{ px: 1 }}>
                          <Skeleton height={28} />
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
        {noDataFound && (
          <Box my={2} textAlign="center">
            Không tìm thấy bản ghi
          </Box>
        )}
      </TableContainer>
    </>
  )
}
