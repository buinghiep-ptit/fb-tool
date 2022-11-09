import { ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { MuiTypography } from 'app/components/common/MuiTypography'
import MuiStyledTable from 'app/components/common/MuiStyledTable'

import * as React from 'react'
import { columnsOrderProcessesDetail } from 'app/utils/columns/columnsOrders'
import { useNavigate } from 'react-router-dom'

export interface IOrderProcessProps {
  isError?: boolean
  error?: Error
  isFetching?: boolean
  rows?: any
}

export function OrderProcesses({
  isError,
  error,
  isFetching = false,
  rows,
}: IOrderProcessProps) {
  const navigate = useNavigate()
  const onClickRow = (cell: any, row: any) => {
    // if (cell.id === 'account') {
    //   if (row.userType === 1) {
    //     navigate(`/quan-ly-tai-khoan-admin/${row.userId}/chi-tiet`, {
    //       state: { modal: true, data: row },
    //     })
    //   } else {
    //     navigate(`/quan-ly-tai-khoan-khach-hang/${row.userId}/thong-tin`, {})
    //   }
    // }
  }
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <MuiTypography>Tiến trình đơn hàng</MuiTypography>
      </AccordionSummary>
      <AccordionDetails>
        <MuiStyledTable
          onClickRow={onClickRow}
          rows={rows ? (rows as any[]) : []}
          columns={columnsOrderProcessesDetail}
          isFetching={isFetching}
          error={isError ? error : null}
        />
      </AccordionDetails>
    </Accordion>
  )
}
