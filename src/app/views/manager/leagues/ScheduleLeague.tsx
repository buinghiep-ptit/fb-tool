import { Edit } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import LaunchIcon from '@mui/icons-material/Launch'
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
import {
  deleteMatch,
  deleteRound,
  getSchedule,
} from 'app/apis/leagues/leagues.service'
import { ConfirmationDialog, SimpleCard, StyledTable } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { toastSuccess } from 'app/helpers/toastNofication'
import { isNumber } from 'lodash'
import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DialogCreateMatchLeague from './DialogCreatMatchLeague'
import DialogCreateRound from './DialogCreatRound'
import DialogEditMatch from './DialogEditMatch'
import DialogEditRound from './DialogEditRound'
import { headTableScheduleLeague } from './const'
export interface Props {
  setIsLoading: any
  isLoading: any
}

export default function ScheduleLeague(props: Props) {
  const [schedule, setSchedule] = useState<any>()
  const navigate = useNavigate()
  const params = useParams()
  const dialogCreateMatchRef = React.useRef<any>(null)
  const dialogEditMatchRef = React.useRef<any>(null)
  const dialogCreateRoundRef = React.useRef<any>(null)
  const dialogEditRoundRef = React.useRef<any>(null)
  const [idPicked, setIdPicked] = useState(null)
  const [idRoundPicked, setIdRoundPicked] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [openConfirmDeleteRoundDialog, setOpenConfirmDeleteRoundDialog] =
    useState(false)
  const league = useSelector((state: any) => state.leagues)

  const fetchScheduleCup = async () => {
    const res = await getSchedule(params.id)
    setSchedule(res.rounds)
  }

  const closeConfirmDialog = () => {
    setOpenConfirmDialog(false)
  }

  const closeConfirmDeleteRoundDialog = () => {
    setOpenConfirmDeleteRoundDialog(false)
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

  const handleDeleteRound = async () => {
    const res = await deleteRound(idRoundPicked)
    if (res) {
      toastSuccess({
        message: 'Xóa thành công',
      })
      setOpenConfirmDeleteRoundDialog(false)
      fetchScheduleCup()
    }
  }

  React.useEffect(() => {
    fetchScheduleCup()
  }, [])

  return (
    <>
      <div style={{ textAlign: 'end', marginBottom: '20px' }}>
        <MuiButton
          title="Thêm mới vòng đấu"
          variant="contained"
          color="primary"
          type="submit"
          startIcon={<Icon>control_point</Icon>}
          onClick={() => {
            dialogCreateRoundRef.current.handleClickOpen(
              schedule[schedule.length - 1],
            )
          }}
        />
      </div>
      {schedule &&
        schedule.map((round: any, index: any) => {
          return (
            <div style={{ marginTop: '50px' }}>
              <SimpleCard
                title={`${round.idOrder} - ${round.name} - ${league.shortName}`}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-48px', right: 0 }}>
                    <Tooltip title="Sửa" placement="top">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          dialogEditRoundRef.current.handleClickOpen(round)
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa vòng đấu" placement="top">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setOpenConfirmDeleteRoundDialog(true)
                          setIdRoundPicked(round.id)
                        }}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>

                <Box width="100%" overflow="auto">
                  <StyledTable>
                    <TableHead>
                      <TableRow>
                        {headTableScheduleLeague.map(header => (
                          <TableCell
                            align="center"
                            style={{ minWidth: header.width }}
                          >
                            {header.name}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(round.matches || []).map((item: any, index: any) => {
                        return (
                          <TableRow hover key={item.name + index}>
                            <TableCell
                              align="left"
                              style={{ wordBreak: 'keep-all' }}
                            >
                              {item.teamA?.name || ''}
                            </TableCell>
                            <TableCell
                              align="left"
                              style={{ wordBreak: 'keep-all' }}
                            >
                              {item.teamB?.name || ''}
                            </TableCell>
                            <TableCell align="center">
                              {moment(item.dateStart).format(
                                'DD-MM-YYYY HH:mm',
                              ) || ''}
                            </TableCell>
                            <TableCell align="left">
                              <p className="overflow-hidden">
                                {item.stadium || ''}
                              </p>
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
                                    dialogEditMatchRef.current.handleClickOpen(
                                      item,
                                      round.name,
                                    )
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
                              <Tooltip
                                title="thông tin trận đấu"
                                placement="top"
                              >
                                <IconButton
                                  color="primary"
                                  onClick={() => {
                                    navigate(`/matches/${item.id}`)
                                  }}
                                >
                                  <LaunchIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </StyledTable>
                </Box>
                <div style={{ textAlign: 'end', marginTop: '20px' }}>
                  <Link
                    onClick={() => {
                      dialogCreateMatchRef.current.handleClickOpen(round)
                    }}
                    to={''}
                    style={{ color: 'blue' }}
                  >
                    + Thêm mới lịch đấu
                  </Link>
                </div>
              </SimpleCard>
            </div>
          )
        })}

      <DialogCreateMatchLeague
        ref={dialogCreateMatchRef}
        setIsLoading={props.setIsLoading}
        isLoading={props.isLoading}
        fetchScheduleCup={fetchScheduleCup}
      />
      <DialogCreateRound
        ref={dialogCreateRoundRef}
        setIsLoading={props.setIsLoading}
        isLoading={props.isLoading}
        fetchScheduleCup={fetchScheduleCup}
      />
      <DialogEditRound
        ref={dialogEditRoundRef}
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
        open={openConfirmDeleteRoundDialog}
        onConfirmDialogClose={closeConfirmDeleteRoundDialog}
        text="Chắc chắn muốn xóa vòng đấu"
        onYesClick={handleDeleteRound}
        title="Xác nhận"
      />
      <ConfirmationDialog
        open={openConfirmDialog}
        onConfirmDialogClose={closeConfirmDialog}
        text="Bạn có chắc chắn muốn xóa lịch thi đấu"
        textYes="Xóa"
        onYesClick={handleDeleteMatch}
        title="Xác nhận"
      />
    </>
  )
}
