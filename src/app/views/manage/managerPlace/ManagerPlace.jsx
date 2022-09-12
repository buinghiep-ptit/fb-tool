import { Box, Button, Grid, Icon, styled, TextField } from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'
import { cloneDeep } from 'lodash'
import { Paragraph } from 'app/components/Typography'
import { useState } from 'react'
import TableCustom from 'app/components/common/TableCustom/TableCustom'
import { deletePlace, getListPlace } from 'app/apis/place/place.service'
import { tableModel } from './const'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function ManagerPlace(props) {
  const [listPlace, setListPlace] = useState()
  const [totalPlace, setTotalPlace] = useState()
  const [inputNamePlace, setInputNamePlace] = useState('')

  const fetchListPlace = async param => {
    await getListPlace(param)
      .then(data => {
        const newList = cloneDeep(data.content).map(place => {
          const convertPlace = {}
          convertPlace.id = place.id
          convertPlace.image = place.imgUrl
          convertPlace.linkDetail = place.name
          convertPlace.quantity = place.campGroundAmount
          convertPlace.event = place.eventName
          convertPlace.address = place.address
          convertPlace.type = place.campType
          convertPlace.status = place.status === 1 ? true : false
          convertPlace.action = ['edit', 'delete']
          return convertPlace
        })

        setListPlace(newList)
        setTotalPlace(data.totalElements)
      })
      .catch(err => console.log(err))
  }

  React.useEffect(() => {
    const param = {
      name: inputNamePlace,
      page: 0,
      size: 5,
    }
    fetchListPlace(param)
  }, [])

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý địa danh' }]} />
      </Box>
      <SimpleCard>
        <Grid container>
          <Grid item sm={6} xs={6}>
            <TextField
              id="namePlace"
              fullWidth
              size="medium"
              type="text"
              name="namePlace"
              label="Tên địa danh/địa chỉ"
              variant="outlined"
              sx={{ mb: 3 }}
              onChange={e => {
                setInputNamePlace(e.target.value)
              }}
            />
            <Button
              color="primary"
              variant="contained"
              type="button"
              onClick={() => {
                fetchListPlace({ name: inputNamePlace, page: 0, size: 5 })
              }}
            >
              <Icon>search</Icon>
            </Button>
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
        <TableCustom
          title="Danh sách địa điểm Camp"
          dataTable={listPlace || []}
          tableModel={tableModel}
          totalData={parseInt(totalPlace, 0)}
          pagination={true}
          fetchDataTable={fetchListPlace}
          onDeleteData={deletePlace}
          filter={{ name: inputNamePlace }}
        />
      </SimpleCard>
    </Container>
  )
}
