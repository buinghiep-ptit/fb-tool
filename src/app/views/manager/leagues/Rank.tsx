import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { getRank } from 'app/apis/leagues/leagues.service'
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
    setRanks(res)
    const newArr = res.sort(function (d1: any, d2: any) {
      return Number(new Date(d2.dateUpdated)) - Number(new Date(d1.dateUpdated))
    })
    console.log(newArr)
    setTimeUpdate(moment(newArr[0].dateUpdated).format('HH:mm DD/MM/YYYY'))
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
                  <TableCell align="center">{index + 1}</TableCell>
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
