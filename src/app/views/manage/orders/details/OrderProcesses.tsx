import { ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { MuiTypography } from 'app/components/common/MuiTypography'
import MuiStyledTable from 'app/components/common/MuiStyledTable'

import * as React from 'react'
import { columnsOrderProcessesDetail } from 'app/utils/columns/columnsOrders'

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
          rows={rows ? (rows as any[]) : []}
          columns={columnsOrderProcessesDetail}
          isFetching={isFetching}
          error={isError ? error : null}
        />
      </AccordionDetails>
    </Accordion>
  )
}
