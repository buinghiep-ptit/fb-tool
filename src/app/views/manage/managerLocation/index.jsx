import {
  Box,
  Button,
  Grid,
  Icon,
  styled,
  TextField,
  Autocomplete,
} from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { values } from 'lodash'
import { Paragraph } from 'app/components/Typography'
import { useState } from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'

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

const dataList = [
  {
    imagePlace: 'image',
    namePlace: 'name',
    quantity: 10,
    event: '1231',
    address: 'address',
    type: 'adasd',
    status: true,
    action: ['edit', 'delete'],
  },
  {
    imagePlace: 'image',
    namePlace: 'name',
    quantity: 10,
    event: '1231',
    address: 'address',
    type: 'adasd',
    status: false,
    action: ['edit'],
  },
  {
    imagePlace: 'image',
    namePlace: 'name',
    quantity: 10,
    event: '1231',
    address: 'address',
    type: 'adasd',
    status: true,
    action: ['delete'],
  },
  {
    imagePlace: 'image',
    namePlace: 'name',
    quantity: 10,
    event: '1231',
    address: 'address',
    type: 'adasd',
    status: true,
    action: ['edit', 'delete'],
  },
  {
    imagePlace: 'image',
    namePlace: 'name',
    quantity: 10,
    event: '1231',
    address: 'address',
    type: 'adasd',
    status: true,
    action: ['edit', 'delete'],
  },
]

const tableModel = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Ảnh',
      width: null,
    },
    {
      name: 'Tên địa danh',
      width: null,
    },
    {
      name: 'Số điểm camp',
      width: null,
    },
    {
      name: 'Sự kiện',
      width: null,
    },
    {
      name: 'Địa chỉ',
      width: null,
    },
    {
      name: 'Loại hình',
      width: null,
    },
    {
      name: 'Trạng thái',
      width: null,
    },

    {
      name: 'Hành động',
      width: null,
    },
  ],
  bodyCell: [
    'index',
    'imagePlace',
    'namePlace',
    'quantity',
    'event',
    'address',
    'type',
    'status',
    'action',
  ],
}

export default function ManagerLocation(props) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (_, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const handleFormSubmit = values => {
    console.log('submit')
  }
  const options = ['Option 1', 'Option 2']

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý địa điểm Camp' }]} />
      </Box>
      <SimpleCard>
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
                  {/* <Autocomplete
                    sx={{ width: 300 }}
                    options={options}
                    renderInput={params => (
                      <TextField {...params} label="Controllable" />
                    )}
                  /> */}
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
              Thêm địa điểm
            </Paragraph>
          </Grid>
        </Grid>
        <TableCustom
          title="Danh sách địa điểm Camp"
          dataTable={dataList}
          tableModel={tableModel}
          pagination={true}
        />
      </SimpleCard>
    </Container>
  )
}
