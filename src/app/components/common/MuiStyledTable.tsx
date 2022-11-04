import { FilterNone } from '@mui/icons-material'
import {
  Icon,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Tooltip,
} from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Box } from '@mui/system'
import { TableColumn } from 'app/models'
import { messages } from 'app/utils/messages'
import * as React from 'react'
import { MuiTypography } from './MuiTypography'

export const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    // background-color: #f1f1f1;
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
  error?: { message?: string } | undefined | null
  rowsPerPage?: number
  page?: number
  actionKeys?: string[]
  actions?: {
    icon?: string
    tooltip?: string
    color?:
      | 'inherit'
      | 'action'
      | 'disabled'
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning'
    onClick?: (col: any, row?: any) => void
    contrastIcon?: {
      icon?: React.ReactElement
      tooltip?: string
    }
    disableKey?: string
    disableActions?: (key?: number) => boolean
  }[]
}

export default function MuiPagingTable<T extends Record<string, any>>({
  columns,
  rows,
  onClickRow,
  isFetching,
  error,
  rowsPerPage = 20,
  page = 0,
  actionKeys = ['status'],
  actions = [],
}: MuiPagingTableProps<T>) {
  const memoizedData = React.useMemo(() => rows, [rows])
  const memoizedColumns = React.useMemo(() => columns, [columns])
  const skeletons = Array.from({ length: 10 }, (x, i) => i)
  const noDataFound =
    !isFetching && (!memoizedData || !(memoizedData as T[]).length || error)

  const cellFormatter = (cell: any, row: any, value: any) => {
    if (cell.media) {
      return cell.media(value)
    }
    if (cell.status) {
      return cell.status(value)
    }
    if (cell.action) {
      return cell.action(
        value ? value : row[actionKeys[1]] ?? row[actionKeys[0]],
      )
    }
    if (cell.link) {
      return cell.link(value)
    }
    return cell.format ? cell.format(value) : value
  }

  return (
    <>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          {!isFetching && (
            <TableHead>
              <TableRow>
                {columns.map((column, idx) => (
                  <TableCell
                    key={idx}
                    align={'center' ?? column.align}
                    sx={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth ?? null,
                      width: 50,
                      padding: '4px',
                      backgroundColor: 'white',
                      ...column.sticky,
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
                      const value =
                        idx === 0
                          ? page * rowsPerPage + index + 1
                          : row[column.id]
                      return (
                        <TableCell
                          key={idx}
                          align={column.align}
                          onClick={() => onClickRow?.(column, row)}
                          sx={{
                            ...column.sticky,
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth ?? null,
                            px: 0.5,
                            cursor:
                              column.action || column.link
                                ? 'pointer'
                                : 'default',
                            zIndex: 1,
                          }}
                        >
                          {column.id === 'actions' ? (
                            <Stack
                              flexDirection={'row'}
                              justifyContent="center"
                              gap={0.5}
                            >
                              {actions.map((action, index) => {
                                if (
                                  action.disableActions &&
                                  action.disableActions(
                                    row[action?.disableKey ?? 'status'],
                                  )
                                ) {
                                  if (action?.contrastIcon?.icon) {
                                    return (
                                      <Tooltip
                                        key={index}
                                        arrow
                                        title={
                                          action.contrastIcon.tooltip ?? ''
                                        }
                                      >
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            action.onClick &&
                                            action.onClick(column, row)
                                          }
                                        >
                                          {action?.contrastIcon?.icon}
                                        </IconButton>
                                      </Tooltip>
                                    )
                                  }
                                  return <Icon key={index}></Icon>
                                }
                                return (
                                  <Tooltip
                                    key={index}
                                    arrow
                                    title={action.tooltip}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        action.onClick &&
                                        action.onClick(column, row)
                                      }
                                    >
                                      <Icon color={action.color ?? 'inherit'}>
                                        {action.icon}
                                      </Icon>
                                    </IconButton>
                                  </Tooltip>
                                )
                              })}
                            </Stack>
                          ) : (
                            cellFormatter(column, row, value)
                          )}
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
          <Box
            my={2}
            minHeight={200}
            display="flex"
            alignItems="center"
            justifyContent={'center'}
            textAlign="center"
          >
            <Stack flexDirection={'row'} gap={1}>
              <FilterNone />
              <MuiTypography>
                {error ? error.message : messages.MSG24}
              </MuiTypography>
            </Stack>
          </Box>
        )}
      </TableContainer>
    </>
  )
}
