import { UseQueryResult } from '@tanstack/react-query'
import { useLogsActionOrderData } from 'app/hooks/queries/useOrdersData'
import React, { useState } from 'react'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { columnsLogsOrderDetail } from 'app/utils/columns/columnsOrders'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { ExpandMore } from '@mui/icons-material'

export interface IActionsHistoryProps {
  orderId: number
}

export function ActionsHistory({ orderId }: IActionsHistoryProps) {
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(10)
  const [filters, setFilters] = useState({
    orderId,
    page,
    size,
  })

  const {
    data: logs,
    isLoading,
    isFetching,
    isError,
    error,
  }: UseQueryResult<any, Error> = useLogsActionOrderData(filters)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    setFilters((prevFilters: any) => {
      return {
        ...prevFilters,
        page: newPage,
      }
    })
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
        size: parseInt(event.target.value, 10),
      }
    })
  }

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <MuiTypography>Logs hành động</MuiTypography>
      </AccordionSummary>
      <AccordionDetails>
        <MuiStyledTable
          rows={logs?.content as any}
          columns={columnsLogsOrderDetail as any}
          onClickRow={() => {}}
          isFetching={isFetching}
        />
        <MuiStyledPagination
          component="div"
          rowsPerPageOptions={[5, 10, 20]}
          count={logs?.totalElements as number}
          rowsPerPage={size}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </AccordionDetails>
    </Accordion>
  )
}
