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

  const params = useParams()

  const fetchListRank = async () => {
    const res = await getRank(params.id)
    setRanks(res)
  }

  React.useEffect(() => {
    fetchListRank()
  }, [])

  return (
    <SimpleCard>
      <div style={{ textAlign: 'end', marginBottom: '20px' }}>
        <Typography>Cập nhật vào: </Typography>
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
                  <TableCell align="center">{item.idTeam}</TableCell>
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
