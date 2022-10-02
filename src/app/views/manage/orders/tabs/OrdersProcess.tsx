import { Box } from '@mui/system'
import { IOrderOverall, IOrderResponse } from 'app/models/order'
import * as React from 'react'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'

export interface IOrdersProcessProps {
  orders?: IOrderResponse
}

export default function OrdersProcess({ orders }: IOrdersProcessProps) {
  console.log(orders)
  return (
    <Box mt={3}>
      {/* <MuiStyledTable
        rows={orders ? (orders?.content as IOrderOverall[]) : []}
        columns={columnsAdminAccounts}
        onClickRow={onClickRow}
        isFetching={isFetching}
        error={isError ? error : null}
      />
      <MuiStyledPagination
        component="div"
        rowsPerPageOptions={[20, 50, 100]}
        count={orders ? (data?.totalElements as number) : 0}
        rowsPerPage={size}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Box>
  )
}
