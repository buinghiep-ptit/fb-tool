import { Table } from '@mui/material'
import { styled } from '@mui/system'

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: 'pre',
  '& thead': {
    '& tr': {
      '& th': {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  },
  '& tbody': {
    '& tr': {
      '& td': {
        paddingLeft: 10,
        paddingRight: 10,
        textTransform: 'none',
      },
    },
  },
}))

export default StyledTable
