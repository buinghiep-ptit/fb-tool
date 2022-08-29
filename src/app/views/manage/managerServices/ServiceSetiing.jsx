import * as React from 'react'
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
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { values } from 'lodash'
import { H4, Paragraph } from 'app/components/Typography'
import TableCustom from 'app/components/TableCustom/TableCustom'

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
    status: true,
    action: ['edit', 'delete'],
  },
  {
    image: 'image2',
    nameService: 'name2',
    type: 'Tính theo số lượng hai ba hai',
    typeService: 'Thuê theo giờ',
    address: 'address',
    quantity: 20,
    status: false,
    action: ['edit'],
  },
]

const tableModel = {
  headCell: [
    'STT',
    'Ảnh',
    'Tên dịch vụ',
    'Loại',
    'Loại dịch vụ',
    'Địa chỉ',
    'Số lượng',
    'Trạng thái',
    'Hành động',
  ],
  bodyCell: [
    {
      name: 'image',
    },
    {
      name: 'nameService',
    },
    {
      name: 'type',
    },
    {
      name: 'typeService',
    },
    {
      name: 'address',
    },
    {
      name: 'quantity',
    },
    {
      name: 'status',
    },
    {
      name: 'action',
    },
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
          sm={6}
          xs={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
            justifyContent: 'space-between',
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
      </Grid>
      <Grid container>
        <Grid item sm={6} xs={6}>
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
                  fullWidth
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
                  sx={{ mb: 3 }}
                />
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
            className={undefined}
            children={undefined}
            ellipsis={undefined}
          >
            Thêm dịch vụ
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
