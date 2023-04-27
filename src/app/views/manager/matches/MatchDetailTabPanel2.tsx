import ControlPointIcon from '@mui/icons-material/ControlPoint'
import SortIcon from '@mui/icons-material/Sort'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import PropTypes from 'prop-types'
import { useRef } from 'react'
import DialogSortProcesses from './DialogSortProcesses'
import MatchProcess from './MatchProcess'
import MatchProcessCreate from './MatchProcessCreate'
import './style.css'

MatchDetailTabPanel2.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  match: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
}

export default function MatchDetailTabPanel2(props: any) {
  const { value, index, match, isLoading, setIsLoading, refresh, ...other } =
    props

  const createMatcheProcessRef = useRef<any>(null)
  const sortProcessesRef = useRef<any>(null)

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
            list={[]}
            refresh={() => {}}
          />
          <MatchProcessCreate
            ref={createMatcheProcessRef}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            match={match}
            refresh={() => {}}
          />
          {/* // TODO api // TODO list process */}

          <MatchProcess />
          <MatchProcess />
          <MatchProcess />
        </Box>
      )}
    </div>
  )
}
