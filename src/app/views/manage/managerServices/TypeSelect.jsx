import * as React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

export default function TypeSelect() {
  const [typeService, setTypeservice] = React.useState('')

  const handleChange = event => {
    setTypeservice(event.target.value)
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="typeService">Loại dịch vụ</InputLabel>
        <Select
          labelId="typeService"
          id="typeService"
          value={typeService}
          label="Loại dịch vụ"
          onChange={handleChange}
          sx={{ mb: 3, width: '75%' }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="byhour">Thuê theo giờ</MenuItem>
          <MenuItem value="allInOne">Trọn gói</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
