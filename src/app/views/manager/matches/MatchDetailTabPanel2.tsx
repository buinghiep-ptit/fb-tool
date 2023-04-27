import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import PropTypes from 'prop-types'

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
          <Typography>Dien bien tran dau</Typography>
        </Box>
      )}
    </div>
  )
}
