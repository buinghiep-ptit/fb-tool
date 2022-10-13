import { Box, Button, Grid, Icon, styled, TextField } from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'

import { tableModelHandBook, tableModelHandBookUnLinked } from '../const'
import { Paragraph } from 'app/components/Typography'
import { useState } from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'
import {
  deleteCampGroundService,
  updateCampGroundServiceStatus,
  getListHandBookLinked,
  getListHandBookUnLinked,
} from 'app/apis/campGround/ground.service'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import DialogCustom from 'app/components/common/DialogCustom'
import { Stack } from '@mui/system'

export default function ListCampHandBook(props) {
  const [listHandBookLinked, setListHandBookLinked] = useState([])
  const [totalListHandBookLinked, setTotalListHandBookLinked] = useState()
  const [listHandBookUnLinked, setListHandBookUnLinked] = useState([])
  const [totalListHandBookUnLinked, setTotalListHandBookUnLinked] = useState()

  const params = useParams()
  const dialogCustomRef = React.useRef(null)
  const fetchListHandBookLinked = async param => {
    await getListHandBookLinked(params.id, param)
      .then(data => {
        // const newList = cloneDeep(data.content).map(campGroundService => {
        //   const convertCampGroundService = {}
        //   convertCampGroundService.id = campGroundService.id
        //   convertCampGroundService.image = campGroundService.imgUrl
        //   convertCampGroundService.linkDetail = {
        //     link: campGroundService.name,
        //     path: '/chi-tiet-diem-camp/',
        //   }
        //   convertCampGroundService.type = campGroundService.type
        //   convertCampGroundService.quantity = campGroundService.capacity
        //   convertCampGroundService.status =
        //     campGroundService.status === 1 ? true : false
        //   convertCampGroundService.action = ['edit', 'delete']
        //   return convertCampGroundService
        // })
        // setListCampGroundService(newList)
        // setTotalListCampgroundService(data.totalElements)
      })
      .catch(err => console.log(err))
  }

  const fetchListHandBookUnLinked = async param => {
    await getListHandBookUnLinked(params.id, param)
      .then(data => {
        const newList = cloneDeep(data.content).map(handbook => {
          const convertHandBook = {}
          convertHandBook.id = handbook.id
          convertHandBook.nameHandBook = handbook.title
          convertHandBook.action = ['edit']
          return convertHandBook
        })
        setListHandBookUnLinked(newList)
        setTotalListHandBookUnLinked(data.totalElements)
      })
      .catch(err => console.log(err))
  }

  React.useEffect(() => {
    const param = {
      page: 0,
      size: 5,
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
          <Icon
            fontSize="large"
            color="primary"
            sx={{ marginRight: '5px' }}
            onClick={() => {
              const params = {
                page: 0,
                size: 5,
              }
              fetchListHandBookUnLinked(params)
              dialogCustomRef.current.handleClickOpen()
            }}
          >
            add_circle
          </Icon>
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
        // onDeleteData={deleteCampGroundService}
        // updateStatus={updateCampGroundServiceStatus}
        // totalData={parseInt(totalListCampGroundService, 0)}
        // fetchDataTable={fetchListHandBookLinked}
        filter={{}}
      />

      <DialogCustom
        ref={dialogCustomRef}
        title="Liên kết cẩm nang"
        maxWidth="md"
      >
        <>
          <Stack direction="row" mb={4}>
            <TextField
              id="outlined-basic"
              label="Tên cẩm nang"
              variant="outlined"
              placeholder="Nhập tên cẩm nang ..."
              onChange={e => {
                // setFilterCamp(e.target.value)
              }}
            />
            <Button
              variant="contained"
              sx={{ height: '53px', marginLeft: '15px' }}
              // onClick={() => {
              //   fetchListCampUnlinked(params.id, {
              //     name: filterCamp,
              //     size: 5,
              //     page: 0,
              //   })
              // }}
            >
              Tìm kiếm
            </Button>
          </Stack>

          <TableCustom
            title="Danh sách cẩm nang"
            tableModel={tableModelHandBookUnLinked}
            pagination={true}
            dataTable={listHandBookUnLinked || []}
            totalData={parseInt(totalListHandBookUnLinked, 0)}
            fetchDataTable={param => {
              fetchListHandBookUnLinked(params.id, param)
            }}
            // onAddData={linkCampOnArea}
            // filter={{ name: filterCamp }}
          />
          <Stack spacing={2} direction="row" mt={2}>
            <Button
              variant="outlined"
              // onClick={() => {
              //   fetchListCampUnlinked(params.id, {
              //     name: filterCamp,
              //     size: 5,
              //     page: 0,
              //   })
              // }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              // onClick={() => {
              //   fetchListCampUnlinked(params.id, {
              //     name: filterCamp,
              //     size: 5,
              //     page: 0,
              //   })
              // }}
            >
              Lưu
            </Button>
          </Stack>
        </>
      </DialogCustom>
    </>
  )
}
