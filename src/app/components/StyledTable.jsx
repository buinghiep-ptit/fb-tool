import { styled } from '@mui/system'
import { Table } from '@mui/material'

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
        textTransform: 'capitalize',
      },
    },
  },
}))

export default StyledTable
