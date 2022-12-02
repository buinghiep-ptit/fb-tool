import { Grid, Icon, Fab, TextField, Button } from '@mui/material'
import * as React from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'
import DialogCustom from 'app/components/common/DialogCustom'
import { Paragraph } from 'app/components/Typography'
import {
  getListEvent,
  getListEventUnlinked,
  linkEvent,
  removeEventOnPlace,
} from 'app/apis/place/place.service'
import { useParams, Link } from 'react-router-dom'
import { cloneDeep } from 'lodash'
const tableModel = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Tên sự kiện',
      width: 150,
    },
    {
      name: 'Thời gian diễn ra',
      width: 150,
    },
    {
      name: 'Trạng thái',
      width: 100,
    },
    {
      name: '',
      width: 100,
    },
  ],
  bodyCell: ['index', 'name', 'time', 'des-status', 'action'],
}

const tableModelEventUnlinked = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Tên sự kiện',
      width: 150,
    },
    {
      name: 'Thời gian diễn ra sự kiện',
      width: 150,
    },
    {
      name: 'Trạng thái',
      width: 100,
    },
    {
      name: '',
      width: 100,
    },
  ],
  bodyCell: ['index', 'name', 'time', 'des-status', 'action'],
}

const param = {
  name: '',
  page: 0,
  size: 20,
}

export default function ListEventPlace(props) {
  const dialogCustomRef = React.useRef(null)
  const openDialog = () => {
    fetchListEventUnlinked(params.id, param)
    dialogCustomRef.current.handleClickOpen()
  }

  const params = useParams()
  const [listEvent, setListEvent] = React.useState()
  const [totalEvent, setTotalEvent] = React.useState()
  const [listEventUnlinked, setListEventUnlinked] = React.useState()
  const [totalEventUnlinked, setTotalEventUnlinked] = React.useState()
  const [filterEvent, setFilterEvent] = React.useState('')
  const tableRef = React.useRef()
  const fetchListEvent = async (id, param) => {
    await getListEvent(id, param)
      .then(data => {
        const newList = cloneDeep(data.content).map(event => {
          const convertEvent = {}
          convertEvent.id = event.id
          convertEvent.name = event.name
          convertEvent.time = `${event.startDate || ''} ${
            event.startDate && event.endDate ? '-' : ''
          } ${event.endDate || ''}`
          convertEvent['des-status'] =
            event.status === 1 ? 'Hoạt động' : 'Không hoạt động'
          convertEvent.action = ['unlinked']
          return convertEvent
        })

        setListEvent(newList)
        setTotalEvent(data.totalElements)
      })
      .catch(err => console.log(err))
  }

  const fetchListEventUnlinked = async (id, param) => {
    await getListEventUnlinked(id, param)
      .then(data => {
        const newList = cloneDeep(data.content).map(event => {
          const convertEvent = {}
          convertEvent.id = event.id
          convertEvent.name = event.name
          convertEvent.time = `${event.startDate || ''} ${
            event.startDate && event.endDate ? '-' : ''
          } ${event.endDate || ''}`
          convertEvent['des-status'] =
            event.status === 1 ? 'Hoạt động' : 'Không hoạt động'
          convertEvent.action = ['add']
          return convertEvent
        })

        setListEventUnlinked(newList)
        setTotalEventUnlinked(data.totalElements)
      })
      .catch(err => console.log(err))
  }

  const removeEvent = async idRemove => {
    const res = await removeEventOnPlace(params.id, idRemove)
    return res
  }

  const linkEventOnArea = async idLink => {
    const res = await linkEvent({ idCampArea: params.id, idCampEvent: idLink })
    return res
  }

  React.useEffect(() => {
    fetchListEvent(params.id, param)
  }, [])

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
            Liên kết sự kiện
          </Paragraph>
        </Grid>
        <Grid
          item
          sm={6}
          xs={6}
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            color: '#07bc0c',
            textDecoration: 'underline',
          }}
        >
          <Link to="/quan-ly-su-kien/them-moi-su-kien" target="_blank">
            Thêm sự kiện
          </Link>
        </Grid>
      </Grid>
      <TableCustom
        title="Danh sách sự kiện"
        tableModel={tableModel}
        pagination={true}
        dataTable={listEvent || []}
        totalData={parseInt(totalEvent, 0)}
        fetchDataTable={param => {
          fetchListEvent(params.id, param)
        }}
        onDeleteData={removeEvent}
        filter={{}}
      />
      <DialogCustom
        ref={dialogCustomRef}
        title="Liên kết sự kiện"
        maxWidth="md"
        fetchData={() => {
          fetchListEvent(params.id, param)
        }}
      >
        <div>
          <TextField
            label="Tên sự kiện"
            variant="outlined"
            placeholder="Nhập tên sự kiện ..."
            style={{ display: 'block' }}
            onChange={e => {
              setFilterEvent(e.target.value)
            }}
          />
          <Button
            variant="contained"
            style={{ margin: '20px 0' }}
            onClick={() => {
              tableRef.current.handleClickSearch()
              fetchListEventUnlinked(params.id, {
                name: filterEvent,
                size: 20,
                page: 0,
              })
            }}
          >
            Tìm
          </Button>

          <TableCustom
            title="Danh sách sự kiện"
            ref={tableRef}
            tableModel={tableModelEventUnlinked}
            pagination={true}
            dataTable={listEventUnlinked || []}
            totalData={parseInt(totalEventUnlinked, 0)}
            fetchDataTable={param => {
              fetchListEventUnlinked(params.id, param)
            }}
            onAddData={linkEventOnArea}
            filter={{ name: filterEvent, size: 20, page: 0 }}
          />
        </div>
      </DialogCustom>
    </>
  )
}
