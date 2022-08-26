import {
  Box,
  Button,
  Grid,
  Icon,
  styled,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  IconButton,
} from '@mui/material'
import { Breadcrumb } from 'app/components'
import * as React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { values } from 'lodash'
import { Paragraph } from 'app/components/Typography'

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

const subscribarList = [
  {
    imagePlace: 'image',
    namePlace: 'name',
    quantity: 10,
    event: '1231',
    address: 'address',
    type: 'adasd',
    status: 'on',
  },
]

const tableModel = {
  headCell: [
    'STT',
    'Ảnh',
    'Tên địa danh',
    'Số điểm camp',
    'Sự kiện',
    'Địa chỉ',
    'Loại hình',
    'Trang thái',
    'Hành động',
  ],
  bodyCell: [
    'imagePlace',
    'namePlace',
    'quantity',
    'event',
    'address',
    'type',
    'status',
  ],
}

export default function ManagerPlace(props) {
  const handleFormSubmit = values => {
    console.log('submit')
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'ManagerPlace' }]} />
      </Box>
      <Grid container>
        <Grid item sm={6} xs={6}>
          <Formik
            onSubmit={values => {
              console.log(values)
            }}
            initialValues={{
              namePlace: '',
            }}
            // validationSchema={validationSchema}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  id="namePlace"
                  fullWidth
                  size="medium"
                  type="text"
                  name="namePlace"
                  label="Tên địa danh/địa chỉ"
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.namePlace}
                  onChange={handleChange}
                  helperText={touched.namePlace && errors.namePlace}
                  error={Boolean(errors.namePlace && touched.namePlace)}
                  sx={{ mb: 3 }}
                />
                <Button color="primary" variant="contained" type="submit">
                  <Icon>search</Icon>
                </Button>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
      <Grid container>
        <Grid
          item
          sm={6}
          xs={6}
          sx={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}
        >
          <Icon fontSize="large" color="primary" sx={{ marginRight: '5px' }}>
            add_circle
          </Icon>
          <Paragraph
            variant="h1"
            component="h2"
            children={undefined}
            className={undefined}
            ellipsis={undefined}
          >
            Thêm địa danh
          </Paragraph>
        </Grid>
      </Grid>
      <Box width="100%" overflow="auto">
        <StyledTable>
          <TableHead>
            <TableRow>
              {tableModel.headCell.map((cell, index) => (
                <TableCell align="center" key={index}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {subscribarList.map((subscriber, index) => (
              <TableRow key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                {tableModel.bodyCell.map((element, id) => (
                  <TableCell align="center" key={id}>
                    {subscriber[element]}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <IconButton>
                    <Icon color="error">edit</Icon>
                  </IconButton>
                  <IconButton>
                    <Icon color="error">delete</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </Box>
    </Container>
  )
}
