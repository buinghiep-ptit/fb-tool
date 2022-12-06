import { FilterNone } from '@mui/icons-material'
import {
  Icon,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Toolbar,
  Tooltip,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
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
  maxHeight?: number | null
  onClickRow?: (cell: any, row: any) => void
  isFetching: boolean
  error?: { message?: string } | undefined | null
  rowsPerPage?: number
  page?: number
  actionKeys?: string[]
  actions?: {
    type?: 0 | 1 // 0: default with icon, 1: selection
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
  setSelectedItems?: (items: readonly number[]) => void
}

export default function MuiPagingTable<T extends Record<string, any>>({
  columns,
  rows,
  maxHeight,
  onClickRow,
  isFetching,
  error,
  rowsPerPage = 20,
  page = 0,
  actionKeys = ['status'],
  actions = [],
  setSelectedItems,
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

  const [selected, setSelected] = React.useState<readonly number[]>([])

  const handleClick = (event: React.MouseEvent<unknown>, name: number) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelectedItems && setSelectedItems(newSelected)
    setSelected(newSelected)
  }

  const isSelected = (name: number) => selected.indexOf(name) !== -1

  return (
    <>
      {selected.length ? (
        <EnhancedTableToolbar numSelected={selected.length} />
      ) : null}
      <TableContainer sx={{ maxHeight: maxHeight ?? null }}>
        <Table stickyHeader aria-label="sticky table" size="medium">
          {!isFetching && (
            <TableHead>
              <TableRow>
                {columns.map((column, idx) => (
                  <TableCell
                    key={idx}
                    align={column.align ?? 'center'}
                    sx={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth ?? null,
                      width: column.width ?? null,
                      padding: '4px',
                      backgroundColor: 'white',
                      ...column.sticky,
                      pb: 2,
                      fontWeight: 600,
                      // color: '#101426',
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
                const isItemSelected = isSelected(row.id ? row.id : 0)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index} //row.userId ?? row.customerId ?? row.id ??
                    selected={isItemSelected}
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
                            px: 1,
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
                                if (action.type) {
                                  return (
                                    <Tooltip
                                      key={index}
                                      arrow
                                      title={
                                        row.isLinked
                                          ? !isItemSelected
                                            ? 'Bỏ thêm'
                                            : 'Thêm'
                                          : !isItemSelected
                                          ? 'Thêm'
                                          : 'Bỏ thêm'
                                      }
                                    >
                                      <IconButton
                                        size="small"
                                        onClick={event =>
                                          handleClick(event, row.id)
                                        }
                                      >
                                        <Icon
                                          color={
                                            row.isLinked
                                              ? !isItemSelected
                                                ? 'error'
                                                : 'primary'
                                              : !isItemSelected
                                              ? 'primary'
                                              : 'error'
                                          }
                                        >
                                          {row.isLinked
                                            ? !isItemSelected
                                              ? 'remove_circle_outlined'
                                              : 'add_circle_outlined'
                                            : !isItemSelected
                                            ? 'add_circle_outlined'
                                            : 'remove_circle_outlined'}
                                        </Icon>
                                      </IconButton>
                                    </Tooltip>
                                  )
                                }
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
interface EnhancedTableToolbarProps {
  numSelected: number
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: theme =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
      {numSelected > 0 && (
        <MuiTypography
          sx={{ flex: '1 1 100%' }}
          color="primary"
          variant="subtitle2"
        >
          {numSelected} điểm camp đã được chọn
        </MuiTypography>
      )}
    </Toolbar>
  )
}
