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

const serviceList = [
  {
    image: 'image1',
    nameService: 'name1',
    type: 'Tính theo đầu người',
    typeService: 'Trọn gói',
    address: 'address',
    quantity: 10,
    status: 'all',
    action: ['edit', 'delete'],
  },
  {
    image: 'image2',
    nameService: 'name2',
    type: 'Tính theo số lượng hai ba hai',
    typeService: 'Thuê theo giờ',
    address: 'address',
    quantity: 20,
    status: 'all',
    action: ['edit'],
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
      name: 'Tên dịch vụ',
      width: null,
    },
    {
      name: 'Loại',
      width: null,
    },
    {
      name: 'Loại dịch vụ',
      width: null,
    },
    {
      name: 'Địa chỉ',
      width: null,
    },
    {
      name: 'Số lượng',
      width: 60,
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
    'image',
    'nameService',
    'type',
    'typeService',
    'address',
    'quantity',
    'status',
    'action',
  ],
}

export default function ServiceSetting(props) {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý dịch vụ ' }]} />
      </Box>
      <Grid container>
        <Grid
          item
          sm={4}
          xs={4}
          sx={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
          }}
        >
          <H4
            variant="h1"
            component="h2"
            className={undefined}
            children={undefined}
            ellipsis={undefined}
          >
            Nhập thông tin tìm kiếm:
          </H4>
        </Grid>

        <Grid
          item
          sm={4}
          xs={4}
          sx={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
          }}
        >
          <H4
            variant="h1"
            component="h2"
            className={undefined}
            children={undefined}
            ellipsis={undefined}
          >
            Loại dịch vụ
          </H4>
        </Grid>

        <Grid
          item
          sm={4}
          xs={4}
          sx={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
          }}
        >
          <H4
            variant="h1"
            component="h2"
            className={undefined}
            children={undefined}
            ellipsis={undefined}
          >
            Trạng thái
          </H4>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sm={4} xs={4}>
          <Formik
            onSubmit={values => {
              console.log(values)
            }}
            initialValues={{
              nameService: '',
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
                  id="nameService"
                  size="medium"
                  type="text"
                  name="nameService"
                  label="Tên địa điểm Camping/dịch vụ"
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.nameService}
                  onChange={handleChange}
                  helperText={touched.nameService && errors.nameService}
                  error={Boolean(errors.nameService && touched.nameService)}
                  sx={{ mb: 3, width: '75%' }}
                />
              </form>
            )}
          </Formik>
        </Grid>

        <Grid item sm={4} xs={4}>
          <TypeSelect></TypeSelect>
        </Grid>

        <Grid item sm={4} xs={4}>
          <StatusSelect></StatusSelect>
        </Grid>
      </Grid>
      <Grid container>
        <Grid
          item
          sm={4}
          xs={4}
          sx={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}
        >
          <Icon fontSize="large" color="primary" sx={{ marginRight: '5px' }}>
            add_circle
          </Icon>
          <Paragraph
            variant="h1"
            component="h2"
            className={undefined}
            children={undefined}
            ellipsis={undefined}
          >
            <NavLink to="/chi-tiet-dich-vu">Thêm dịch vụ</NavLink>
          </Paragraph>
        </Grid>
      </Grid>
      <TableCustom
        title=" "
        dataTable={serviceList}
        tableModel={tableModel}
        pagination={true}
      />
    </Container>
  )
}
