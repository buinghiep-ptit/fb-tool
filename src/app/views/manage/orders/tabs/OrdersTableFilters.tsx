import { useNavigateParams } from 'app/hooks/useNavigateParams'
import React, { useState } from 'react'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { IOrderOverall } from 'app/models/order'

export interface ITableProps {
  rows?: any
  totalRows?: number
  columns?: any
  filters: any
  setFilters: (value: any) => void
  onClickRow?: (cell: any, row: any) => void
  isFetching?: boolean
  error?: { message?: string } | null
}

export function TableFilters({
  rows = [],
  totalRows = 0,
  columns,
  filters,
  setFilters,
  onClickRow,
  isFetching = false,
  error,
}: ITableProps) {
  const navigate = useNavigateParams()

  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(20)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    setFilters((prevFilters: any) => {
      return {
        ...prevFilters,
        page: +newPage,
      }
    })
    navigate('', {
      ...filters,
      page: +newPage,
    } as any)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSize(+event.target.value)
    setPage(0)
    setFilters((prevFilters: any) => {
      return {
        ...prevFilters,
        page: 0,
        size: +event.target.value,
      }
    })
    navigate('', {
      ...filters,
      size: +event.target.value,
    } as any)
  }
  return (
    <React.Fragment>
      <MuiStyledTable
        rows={rows}
        columns={columns}
        onClickRow={onClickRow}
        isFetching={isFetching}
        error={error}
      />
      <MuiStyledPagination
        component="div"
        rowsPerPageOptions={[20, 50, 100]}
        count={totalRows}
        rowsPerPage={size}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}
