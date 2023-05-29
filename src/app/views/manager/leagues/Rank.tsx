import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import {
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { changeRank, getRank } from 'app/apis/leagues/leagues.service'
import { SimpleCard, StyledTable } from 'app/components'
import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { headTableRank } from './const'
export interface Props {
  setIsLoading: any
  isLoading: any
}

export default function Rank(props: Props) {
  const [ranks, setRanks] = useState<any>()
  const [timeUpdate, setTimeUpdate] = useState<any>(null)
  const params = useParams()

  const fetchListRank = async () => {
    const res = await getRank(params.id)
    setRanks([...res])
    const newArr = res.sort(function (d1: any, d2: any) {
      return Number(new Date(d2.dateUpdated)) - Number(new Date(d1.dateUpdated))
    })

    setTimeUpdate(moment(newArr[0].dateUpdated).format('HH:mm DD/MM/YYYY'))
  }

  const handleChangeRank = async (
    idTeamA: any,
    rankA: any,
    idTeamB: any,
    rankB: any,
  ) => {
    props.setIsLoading(true)
    const payload = [
      {
        idTeam: idTeamA,
        rank: rankA,
      },
      {
        idTeam: idTeamB,
        rank: rankB,
      },
    ]
    const res = await changeRank(params.id, payload)
    if (res) {
      props.setIsLoading(false)
      fetchListRank()
    }
  }

  React.useEffect(() => {
    fetchListRank()
  }, [])

  return (
    <SimpleCard>
      <div style={{ textAlign: 'end', marginBottom: '20px' }}>
        <Typography style={{ fontStyle: 'italic' }}>
          Cập nhật vào: {timeUpdate}
        </Typography>
      </div>

      <Box width="100%" overflow="auto">
        <StyledTable>
          <TableHead>
            <TableRow>
              {headTableRank.map(header => (
                <TableCell align="center" style={{ minWidth: header.width }}>
                  {header.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(ranks || []).map((item: any, index: any) => {
              return (
                <TableRow hover key={item.name + index}>
                  <TableCell align="center">{item.rank}</TableCell>
                  <TableCell align="center">
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: 'fit-content',
                      }}
                    >
                      {item.rank !== 1 && (
                        <Tooltip title="Tăng hạng" placement="top-start">
                          <IconButton
                            size="small"
                            disabled={props.isLoading}
                            onClick={() =>
                              handleChangeRank(
                                item.idTeam,
                                item.rank - 1,
                                ranks[index - 1].idTeam,
                                ranks[index - 1].rank + 1,
                              )
                            }
                          >
                            <KeyboardArrowUpIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Giảm hạng" placement="top-start">
                        <IconButton
                          size="small"
                          disabled={props.isLoading}
                          onClick={() =>
                            handleChangeRank(
                              item.idTeam,
                              item.rank + 1,
                              ranks[index + 1].idTeam,
                              ranks[index + 1].rank - 1,
                            )
                          }
                        >
                          <KeyboardArrowDownIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell align="left" style={{ wordBreak: 'keep-all' }}>
                    <div style={{ display: 'flex' }}>
                      <img
                        src={item?.team?.logo}
                        style={{
                          marginRight: '10px',
                          objectFit: 'contain',
                          width: '50px',
                          height: '50px',
                        }}
                      ></img>
                      <p> {item.name}</p>
                    </div>
                  </TableCell>
                  <TableCell align="center">{item.numOfMatch}</TableCell>
                  <TableCell align="center">{item.numOfWin}</TableCell>
                  <TableCell align="center">{item.numOfDraw}</TableCell>
                  <TableCell align="center">{item.numOfLost}</TableCell>
                  <TableCell align="center">{item.goalFor}</TableCell>
                  <TableCell align="center">{item.goalAgainst}</TableCell>
                  <TableCell align="center">{item.goalDifference}</TableCell>
                  <TableCell align="center">{item.score}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </StyledTable>
      </Box>
    </SimpleCard>
  )
}
