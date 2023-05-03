import {
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { getMemberLogs } from 'app/apis/members/members.service'
import { SimpleCard, StyledTable } from 'app/components'
import dayjs from 'dayjs'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { headTableLogs } from './const'

export interface Props {
  idMember: number
}

export default function MemberActionHistory(props: Props) {
  const { idMember } = props
  const [logs, setLogs] = useState<any>()
  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [doRerender, setDoRerender] = useState(false)

  const fetchLogs = async () => {
    await getMemberLogs(idMember)
      .then(res => {
        setLogs(res.content)
        setCountTable(res.totalElements)
      })
      .catch(() => {})
      .finally(() => {})
  }

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage)
    setDoRerender(!doRerender)
  }

  const handleChangeRowsPerPage = (event: {
    target: { value: string | number }
  }) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    setDoRerender(!doRerender)
  }

  useEffect(() => {
    if (idMember) fetchLogs()
  }, [page, doRerender, idMember])

  return (
    <SimpleCard>
      <Typography>Log hành động</Typography>

      <Box width="100%" overflow="auto">
        <StyledTable>
          <TableHead>
            <TableRow>
              {headTableLogs.map(header => (
                <TableCell
                  align="center"
                  style={{ minWidth: header.width }}
                  key={header.name}
                >
                  {header.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {logs?.length === 0 && (
              <Typography color="gray" textAlign="center">
                Không có dữ liệu
              </Typography>
            )}
            {(logs || []).map((log: any, index: any) => {
              return (
                <TableRow hover key={index}>
                  <TableCell align="center">
                    {rowsPerPage * page + index + 1}
                  </TableCell>
                  <TableCell align="left">{log.actionName}</TableCell>
                  <TableCell align="left">
                    {dayjs(log.registerDate).format('DD/MM/YYYY HH:mm')}
                  </TableCell>
                  <TableCell align="left">{log.performer}</TableCell>
                  <TableCell align="left">{log.note}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </StyledTable>
        <TablePagination
          sx={{ px: 2 }}
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={countTable}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[20, 50, 100]}
          labelRowsPerPage={'Dòng / Trang'}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{ 'aria-label': 'Next Page' }}
          backIconButtonProps={{ 'aria-label': 'Previous Page' }}
        />
      </Box>
    </SimpleCard>
  )
}
