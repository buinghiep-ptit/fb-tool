import { Grid, Icon, Fab, TextField, Button } from '@mui/material'
import * as React from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'
import DialogCustom from 'app/components/common/DialogCustom'
import { Paragraph } from 'app/components/Typography'
import {
  getListCamp,
  getListCampUnlinked,
  linkCamp,
  removeCampOnPlace,
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
      name: 'Tên điểm camp',
      width: null,
    },
    {
      name: 'Địa chỉ',
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
  bodyCell: ['index', 'name', 'address', 'des-status', 'action'],
}

const tableModelCampUnlinked = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Tên điểm camp',
      width: null,
    },
    {
      name: 'Địa chỉ',
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
  bodyCell: ['index', 'name', 'address', 'des-status', 'action'],
}

const param = {
  name: '',
  page: 0,
  size: 20,
}

export default function ListCampPlace(props) {
  const dialogCustomRef = React.useRef(null)
  const openDialog = () => {
    fetchListCampUnlinked(params.id, param)
    dialogCustomRef.current.handleClickOpen()
  }

  const params = useParams()
  const [listCamp, setListCamp] = React.useState()
  const [totalCamp, setTotalCamp] = React.useState()
  const [listCampUnlinked, setListCampUnlinked] = React.useState()
  const [totalCampUnlinked, setTotalCampUnlinked] = React.useState()
  const [filterCamp, setFilterCamp] = React.useState('')

  const fetchListCamp = async (id, param) => {
    await getListCamp(id, param)
      .then(data => {
        const newList = cloneDeep(data.content).map(camp => {
          const convertCamp = {}
          convertCamp.id = camp.id
          convertCamp.name = camp.name
          convertCamp.address = camp.address
          convertCamp['des-status'] =
            camp.status === 1 ? 'Hoạt động' : 'Không hoạt động'
          convertCamp.action = ['delete']
          return convertCamp
        })

        setListCamp(newList)
        setTotalCamp(data.totalElements)
      })
      .catch(err => console.log(err))
  }

  const fetchListCampUnlinked = async (id, param) => {
    await getListCampUnlinked(id, param)
      .then(data => {
        const newList = cloneDeep(data.content).map(camp => {
          const convertCamp = {}
          convertCamp.id = camp.id
          convertCamp.name = camp.name
          convertCamp.address = camp.address
          convertCamp['des-status'] =
            camp.status === 1 ? 'Hoạt động' : 'Không hoạt động'
          convertCamp.action = ['add']
          return convertCamp
        })

        setListCampUnlinked(newList)
        setTotalCampUnlinked(data.totalElements)
      })
      .catch(err => console.log(err))
  }

  const removeCamp = async idRemove => {
    const res = await removeCampOnPlace(params.id, idRemove)
    return res
  }

  const linkCampOnArea = async idLink => {
    const res = await linkCamp({ idCampArea: params.id, idCampGround: idLink })
    return res
  }

  React.useEffect(() => {
    fetchListCamp(params.id, param)
    fetchListCampUnlinked(params.id, param)
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
            Liên kết điểm camp
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
          <Link to="/them-diem-camp" target="_blank">
            Thêm điểm camp
          </Link>
        </Grid>
      </Grid>
      <TableCustom
        title="Danh sách điểm camp"
        tableModel={tableModel}
        pagination={true}
        dataTable={listCamp || []}
        totalData={parseInt(totalCamp, 0)}
        fetchDataTable={param => {
          fetchListCamp(params.id, param)
        }}
        onDeleteData={removeCamp}
        filter={{}}
      />
      <DialogCustom
        ref={dialogCustomRef}
        title="Liên kết điểm camp"
        maxWidth="md"
        fetchData={() => {
          fetchListCamp(params.id, param)
        }}
      >
        <div>
          <TextField
            id="outlined-basic"
            label="Tên điểm camp"
            variant="outlined"
            placeholder="Nhập tên điểm camp ..."
            style={{ display: 'block' }}
            onChange={e => {
              setFilterCamp(e.target.value)
            }}
          />
          <Button
            variant="contained"
            style={{ margin: '20px 0' }}
            onClick={() => {
              fetchListCampUnlinked(params.id, {
                name: filterCamp,
                size: 20,
                page: 0,
              })
            }}
          >
            Tìm kiếm
          </Button>
          <TableCustom
            title="Danh sách điểm camp"
            tableModel={tableModelCampUnlinked}
            pagination={true}
            dataTable={listCampUnlinked || []}
            totalData={parseInt(totalCampUnlinked, 0)}
            fetchDataTable={param => {
              fetchListCampUnlinked(params.id, param)
            }}
            onAddData={linkCampOnArea}
            filter={{ name: filterCamp, size: 20, page: 0 }}
          />
        </div>
      </DialogCustom>
    </>
  )
}
