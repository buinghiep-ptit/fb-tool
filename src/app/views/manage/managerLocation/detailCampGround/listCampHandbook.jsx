import { Box, Button, Grid, Icon, Fab, TextField } from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'

import { tableModelHandBook, tableModelHandBookUnLinked } from '../const'
import { Paragraph } from 'app/components/Typography'
import { useState } from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'
import {
  removeHandBookWithCamp,
  getListHandBookLinked,
  getListHandBookUnLinked,
  addHandBookToCamp,
} from 'app/apis/campGround/ground.service'
import { cloneDeep, set } from 'lodash'
import { useParams } from 'react-router-dom'
import DialogCustom from 'app/components/common/DialogCustom'
import { Stack } from '@mui/system'
import ListHandBookUnlinked from './listHandBookUnlinked'
import { toastSuccess } from 'app/helpers/toastNofication'

export default function ListCampHandBook(props) {
  const [listHandBookLinked, setListHandBookLinked] = useState([])
  const [totalListHandBookLinked, setTotalListHandBookLinked] = useState()
  const [listHandBookUnLinked, setListHandBookUnLinked] = useState([])
  const [filterHandBook, setFilterHandBook] = useState('')
  const params = useParams()
  const dialogCustomRef = React.useRef(null)
  const fetchListHandBookLinked = async param => {
    await getListHandBookLinked(params.id, param)
      .then(data => {
        const newList = cloneDeep(data.content).map(handbook => {
          const convertHandBook = {}
          convertHandBook.id = handbook.id
          convertHandBook.nameHandBook = handbook.title
          convertHandBook.creator = handbook.userName
          convertHandBook.statusHandBook =
            handbook.status == 1 ? 'Hoạt động' : 'Không hoạt động'
          convertHandBook.action = ['delete']
          return convertHandBook
        })
        setListHandBookLinked(newList)
        setTotalListHandBookLinked(data.totalElements)
      })
      .catch(err => console.log(err))
  }

  const fetchListHandBookUnLinked = async param => {
    await getListHandBookUnLinked(params.id, param)
      .then(data => {
        const newList = cloneDeep(data.content).map(handbook => {
          const convertHandBook = {}
          convertHandBook.id = handbook.id
          convertHandBook.title = handbook.title
          convertHandBook.linked = false
          return convertHandBook
        })
        setListHandBookUnLinked(newList)
      })
      .catch(err => console.log(err))
  }

  const onRemoveHandBookWithCamp = async id => {
    const res = await removeHandBookWithCamp({
      idCampGround: params.id,
      idHandBook: id,
    })
    return res
  }

  const handleLinkedHandbook = (id, status) => {
    const newList = cloneDeep(listHandBookUnLinked)
    newList[id].linked = status
    setListHandBookUnLinked(newList)
  }

  const onAddHandBookToCamp = async () => {
    const listHandBookWillLink = listHandBookUnLinked
      .filter(handbook => handbook.linked)
      .map(handbook => {
        return {
          idCampGround: parseInt(params.id),
          idHandBook: handbook.id,
        }
      })

    const res = await addHandBookToCamp({
      isAdd: 1,
      handbooksToLink: listHandBookWillLink,
    })
    if (res) {
      toastSuccess({ message: 'Liên kết thành công' })
      setFilterHandBook('')
      dialogCustomRef.current.handleClose()
      fetchListHandBookLinked({
        page: 0,
        size: 20,
      })
    }
  }

  React.useEffect(() => {
    const param = {
      page: 0,
      size: 20,
    }
    fetchListHandBookLinked(param)
  }, [])

  return (
    <>
      <Grid container>
        <Grid
          item
          sm={6}
          xs={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
            cursor: 'pointer',
          }}
        >
          <Fab
            color="primary"
            aria-label="Add"
            className="button"
            sx={{ marginRight: '15px', cursor: 'pointer' }}
            size="small"
            onClick={() => {
              const params = {
                page: 0,
                size: 20,
              }
              fetchListHandBookUnLinked(params)
              dialogCustomRef.current.handleClickOpen()
            }}
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
            Chọn cẩm nang
          </Paragraph>
        </Grid>
      </Grid>
      <TableCustom
        title="Danh sách cẩm nang"
        dataTable={listHandBookLinked || []}
        tableModel={tableModelHandBook}
        pagination={true}
        onDeleteData={onRemoveHandBookWithCamp}
        // updateStatus={updateCampGroundServiceStatus}
        totalData={parseInt(totalListHandBookLinked, 0)}
        fetchDataTable={fetchListHandBookLinked}
        filter={{}}
      />

      <DialogCustom
        ref={dialogCustomRef}
        title="Liên kết cẩm nang"
        maxWidth="md"
        fetchData={() => {
          setFilterHandBook('')
        }}
      >
        <>
          <Stack direction="row" mb={4}>
            <TextField
              id="outlined-basic"
              label="Tên cẩm nang"
              variant="outlined"
              placeholder="Nhập tên cẩm nang ..."
              onChange={e => {
                setFilterHandBook(e.target.value)
              }}
              onKeyDown={async e => {
                if (e.keyCode === 13) {
                  const param = {
                    page: 0,
                    size: 20,
                    title: filterHandBook,
                  }
                  fetchListHandBookUnLinked(param)
                }
              }}
            />
            <Button
              variant="contained"
              sx={{ height: '53px', marginLeft: '15px' }}
              onClick={() => {
                const param = {
                  page: 0,
                  size: 20,
                  title: filterHandBook,
                }
                fetchListHandBookUnLinked(param)
              }}
            >
              Tìm kiếm
            </Button>
          </Stack>

          <ListHandBookUnlinked
            msgNoContent={`Không tìm được kết quả nào phù hợp với từ khóa "${filterHandBook}"`}
            tableData={listHandBookUnLinked}
            handleLinkedHandbook={handleLinkedHandbook}
          />
          <Stack spacing={2} direction="row" mt={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setFilterHandBook('')
                dialogCustomRef.current.handleClose()
              }}
            >
              Hủy
            </Button>
            <Button variant="contained" onClick={() => onAddHandBookToCamp()}>
              Lưu
            </Button>
          </Stack>
        </>
      </DialogCustom>
    </>
  )
}
