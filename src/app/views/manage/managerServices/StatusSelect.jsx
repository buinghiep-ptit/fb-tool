import * as React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

export default function StatusSelect() {
  const [status, setStatus] = React.useState('')

  const handleChange = event => {
    setStatus(event.target.value)
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="status">Trạng thái</InputLabel>
        <Select
          labelId="status"
          id="status"
          value={status}
          label="Trạng thái"
          onChange={handleChange}
          sx={{ mb: 3, width: '75%' }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="effect">Hiệu lực</MenuItem>
          <MenuItem value="invalid">Không hiệu lực</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
