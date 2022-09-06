import { Grid, Icon, Fab, TextField, Button } from '@mui/material'
import * as React from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'
import DialogCustom from 'app/components/common/DialogCustom'
import { Paragraph } from 'app/components/Typography'

const dataList = [
  {
    imagePlace: 'image',
    namePlace: 'name',
    address: 'address',
    status: true,
    action: ['delete'],
  },
  {
    imagePlace: 'image',
    namePlace: 'name',
    address: 'address',
    status: true,
    action: ['delete'],
  },
  {
    imagePlace: 'image',
    namePlace: 'name',
    address: 'address',
    status: true,
    action: ['delete'],
  },
  {
    imagePlace: 'image',
    namePlace: 'name',
    address: 'address',
    status: true,
    action: ['delete'],
  },
  {
    imagePlace: 'image',
    namePlace: 'name',
    address: 'address',
    status: true,
    action: ['delete'],
  },
]

const tableModel = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Tên sự kiện',
      width: null,
    },
    {
      name: 'Thời gian diễn ra',
      width: null,
    },
    {
      name: 'Trạng thái',
      width: null,
    },
    {
      name: '',
      width: null,
    },
  ],
  bodyCell: ['index', 'namePlace', 'address', 'status', 'action'],
}

export default function ListEventPlace(props) {
  const dialogCustomRef = React.useRef(null)
  const openDialog = () => {
    dialogCustomRef.current.handleClickOpen()
  }
  return (
    <>
      <Grid container>
        <Grid
          item
          sm={6}
          xs={6}
          sx={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}
        >
          <Fab
            color="primary"
            aria-label="Add"
            className="button"
            sx={{ marginRight: '15px', cursor: 'pointer' }}
            size="small"
            onClick={openDialog}
          >
            <Icon>add</Icon>
          </Fab>
          <Paragraph
            variant="h1"
            component="h2"
            children={undefined}
            className={undefined}
            ellipsis={undefined}
          >
            Liên kết điểm Camp
          </Paragraph>
        </Grid>
      </Grid>
      <TableCustom
        title="Danh sách điểm Camp"
        dataTable={dataList}
        tableModel={tableModel}
        pagination={true}
      />
      <DialogCustom
        ref={dialogCustomRef}
        title="Liên kết điểm camp"
        maxWidth="md"
      >
        <div>
          <TextField
            id="outlined-basic"
            label="Tên điểm camp"
            variant="outlined"
            placeholder="Nhập tên điểm camp ..."
            style={{ display: 'block' }}
          />
          <Button variant="contained" style={{ margin: '20px 0' }}>
            Tìm
          </Button>

          <TableCustom
            title="Danh sách điểm Camp"
            dataTable={dataList}
            tableModel={tableModel}
            pagination={true}
          />
        </div>
      </DialogCustom>
    </>
  )
}
