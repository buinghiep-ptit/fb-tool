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
import { deleteLeagues, getSchedule } from 'app/apis/leagues/leagues.service'
import { SimpleCard, StyledTable } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DialogCreateMatch from './DialogCreatMatch'
import { headTableScheduleCup } from './const'
export interface Props {
  setIsLoading: any
  isLoading: any
}

export default function ScheduleCup(props: Props) {
  const [page, setPage] = useState(0)
  const [countTable, setCountTable] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [schedule, setSchedule] = useState<any>()
  const navigate = useNavigate()
  const params = useParams()
  const dialogCreateMatchRef = React.useRef<any>(null)
  const fetchScheduleCup = async () => {
    const res = await getSchedule(params.id)
    setSchedule(res.content)
  }

  const handleDeleteLeagues = async (id: any) => {
    const res = await deleteLeagues(id)
    if (res) {
      toastSuccess({
        message: 'Xóa thành công',
      })
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
          title="Thêm mới cầu thủ"
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
                <TableRow hover key={item.name}>
                  <TableCell align="center">
                    {rowsPerPage * page + index + 1}
                  </TableCell>
                  <TableCell align="center">
                    <Link to="/customers/1">{item.name}</Link>
                  </TableCell>
                  <TableCell align="center">
                    <img
                      style={{
                        objectFit: 'cover',
                        width: '100px',
                        height: '100px',
                      }}
                      src={item.logo}
                    ></img>
                  </TableCell>
                  <TableCell align="center">{item.shortName}</TableCell>
                  <TableCell align="center"></TableCell>
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
                      <Chip label="Tạm dừng" color="secondary" />
                    )}
                    {item.status === 4 && <Chip label="Đóng" />}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Sửa" placement="top">
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa" placement="top">
                      <IconButton color="primary">
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
      />
    </SimpleCard>
  )
}
