import * as React from 'react'
import {
  Box,
  Button,
  Grid,
  Icon,
  styled,
  TextField,
  Table,
} from '@mui/material'
import { Breadcrumb } from 'app/components'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { values } from 'lodash'
import { H4, Paragraph } from 'app/components/Typography'
import TableCustom from 'app/components/common/TableCustom/TableCustom'
import StatusSelect from './StatusSelect'
import TypeSelect from './TypeSelect'
import { NavLink } from 'react-router-dom'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

// form field validation schema
// const validationSchema = Yup.object().shape({
//   password: Yup.string()
//     .min(6, 'Password must be 6 character length')
//     .required('Password is required!'),
// })

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: 'pre',
  '& thead': {
    '& tr': { '& th': { paddingLeft: 0, paddingRight: 0 } },
  },
  '& tbody': {
    '& tr': { '& td': { paddingLeft: 0, textTransform: 'capitalize' } },
  },
}))

export default function ServiceDetail(props) {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Chi tiết dịch vụ' }]} />
      </Box>
    </Container>
  )
}
