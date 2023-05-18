import { Edit } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Chip,
  Icon,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { deleteMatch, getSchedule } from 'app/apis/leagues/leagues.service'
import { ConfirmationDialog, SimpleCard, StyledTable } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { toastSuccess } from 'app/helpers/toastNofication'
import { isNumber } from 'lodash'
import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DialogCreateMatch from './DialogCreatMatch'
import DialogEditMatch from './DialogEditMatch'
import { headTableScheduleCup } from './const'
export interface Props {
  setIsLoading: any
  isLoading: any
}

export default function ScheduleCup(props: Props) {
  const [schedule, setSchedule] = useState<any>()
  const navigate = useNavigate()
  const params = useParams()
  const dialogCreateMatchRef = React.useRef<any>(null)
  const dialogEditMatchRef = React.useRef<any>(null)
  const [idPicked, setIdPicked] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  const fetchScheduleCup = async () => {
    const res = await getSchedule(params.id)
    setSchedule(res.matches)
  }

  const closeConfirmDialog = () => {
    setOpenConfirmDialog(false)
  }

  const handleDeleteMatch = async () => {
    const res = await deleteMatch(idPicked)
    if (res) {
      toastSuccess({
        message: 'Xóa thành công',
      })
      setOpenConfirmDialog(false)
      fetchScheduleCup()
    }
  }

  React.useEffect(() => {
    fetchScheduleCup()
  }, [])

  return (
    <SimpleCard>
      <div style={{ textAlign: 'end', marginBottom: '20px' }}>
        <MuiButton
          title="Thêm mới lịch đấu"
          variant="contained"
          color="primary"
          type="submit"
          startIcon={<Icon>control_point</Icon>}
          onClick={() => {
            dialogCreateMatchRef.current.handleClickOpen()
          }}
        />
      </div>

      <Box width="100%" overflow="auto">
        <StyledTable>
          <TableHead>
            <TableRow>
              {headTableScheduleCup.map(header => (
                <TableCell align="center" style={{ minWidth: header.width }}>
                  {header.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(schedule || []).map((item: any, index: any) => {
              return (
                <TableRow hover key={item.name + index}>
                  <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                    {item.teamA.name}
                  </TableCell>
                  <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                    {item.teamB.name}
                  </TableCell>
                  <TableCell align="left">
                    {moment(item.dateStart).format('DD-MM-YYYY HH:mm')}
                  </TableCell>
                  <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                    {item.stadium}
                  </TableCell>
                  <TableCell align="center">
                    {item.status === 1 && (
                      <Chip label="Đang diễn ra" color="success" />
                    )}
                    {item.status === 0 && (
                      <Chip label="Chưa diễn ra" color="warning" />
                    )}
                    {item.status === 2 && (
                      <Chip label="Kết thúc" color="primary" />
                    )}
                    {item.status === 3 && (
                      <Chip label="Hoãn" color="secondary" />
                    )}
                    {item.status === 4 && <Chip label="Hủy" />}
                    {item.status === 5 && (
                      <Chip label="Chờ cập nhật" color="warning" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {!isNumber(item.goalForTeamA) ||
                    !isNumber(item.goalForTeamB)
                      ? 'Chờ cập nhật'
                      : `${item.goalForTeamA} - ${item.goalForTeamB}`}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Sửa" placement="top">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          dialogEditMatchRef.current.handleClickOpen(item)
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa" placement="top">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setIdPicked(item.id)
                          setOpenConfirmDialog(true)
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </StyledTable>
      </Box>
      <DialogCreateMatch
        ref={dialogCreateMatchRef}
        setIsLoading={props.setIsLoading}
        isLoading={props.isLoading}
        fetchScheduleCup={fetchScheduleCup}
      />
      <DialogEditMatch
        ref={dialogEditMatchRef}
        setIsLoading={props.setIsLoading}
        isLoading={props.isLoading}
        fetchScheduleCup={fetchScheduleCup}
      />
      <ConfirmationDialog
        open={openConfirmDialog}
        onConfirmDialogClose={closeConfirmDialog}
        text="Bạn có chắc chắn muốn xóa lịch thi đấu"
        onYesClick={handleDeleteMatch}
        textYes="Xóa"
        title="Xác nhận"
      />
    </SimpleCard>
  )
}
