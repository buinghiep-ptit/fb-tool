import ControlPointIcon from '@mui/icons-material/ControlPoint'
import SortIcon from '@mui/icons-material/Sort'
import { Button, List, ListItem } from '@mui/material'
import { Box } from '@mui/system'
import { getMatchProcesses } from 'app/apis/matches/matches.service'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import DialogSortProcesses from './DialogSortProcesses'
import MatchProcess from './MatchProcess'
import MatchProcessCreate from './MatchProcessCreate'
import './style.css'

MatchDetailTabPanel2.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  matchId: PropTypes.any.isRequired,
  match: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
}

export default function MatchDetailTabPanel2(props: any) {
  const { value, index, matchId, match, isLoading, setIsLoading, ...other } =
    props

  const createMatcheProcessRef = useRef<any>(null)
  const sortProcessesRef = useRef<any>(null)

  const [processes, setProcesses] = useState<any>([])

  const fetchMatchProcesses = async () => {
    setIsLoading(true)
    await getMatchProcesses(matchId)
      .then(res => setProcesses(res.content)) // TODO update api: page -> list
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchMatchProcesses()
  }, [])

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              m: 1,
            }}
          >
            <Button
              disabled={isLoading}
              onClick={() => {
                createMatcheProcessRef?.current.handleClickOpen()
              }}
              startIcon={<ControlPointIcon />}
              sx={{ mx: 1 }}
            >
              Thêm diễn biến mới
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => {
                sortProcessesRef?.current.handleClickOpen()
              }}
              startIcon={<SortIcon />}
              sx={{ mx: 1 }}
            >
              Sắp xếp
            </Button>
          </Box>
          <DialogSortProcesses
            ref={sortProcessesRef}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            list={processes}
            refresh={fetchMatchProcesses}
          />
          <MatchProcessCreate
            ref={createMatcheProcessRef}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            match={match}
            refresh={fetchMatchProcesses}
          />

          <List>
            {(processes || []).map((process: any, index: any) => {
              return (
                <ListItem key={index}>
                  <MatchProcess
                    match={match}
                    matchProcess={process}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    refresh={fetchMatchProcesses}
                  />
                </ListItem>
              )
            })}
          </List>
        </Box>
      )}
    </div>
  )
}
