import { Box } from '@mui/system'
import { Breadcrumb, Container, SimpleCard } from 'app/components'
import * as React from 'react'

import { Button, Chip, Grid, LinearProgress, Typography } from '@mui/material'

import {
  getCategoriesSort,
  updateCategoriesSort,
} from 'app/apis/shop/shop.service'
import { useState } from 'react'
import RLDD from 'react-list-drag-and-drop/lib/RLDD'
import './shop.css'

interface category {
  name: string
  priority: number
  id: number
  status: number
}
export interface Props {}

export default function Sort(props: Props) {
  const [categories, setCategories] = useState<category[]>()
  const [isLoading, setIsloading] = useState(false)

  const fetchProductCategories = async () => {
    const res = await getCategoriesSort()
    setCategories(res)
  }

  React.useEffect(() => {
    fetchProductCategories()
  }, [])

  const handleRLDDChange = (reorderedItems: any) => {
    // console.log('Example.handleRLDDChange');
    setCategories(reorderedItems)
  }

  const updateProductCategories = async () => {
    setIsloading(true)
    const res = await updateCategoriesSort({
      sortCategories: categories?.map((item, index) => {
        item.priority = index + 1
        return item
      }),
    })
    if (res) {
      setIsloading(false)
      fetchProductCategories()
    }
  }

  const renderStatus = (status: any) => {
    switch (status) {
      case 0:
        return <Chip label="Ngừng kinh doanh" color="warning" />
      default:
        return <Chip label="Hoạt động" color="success" />
    }
  }

  const tableRowRender = (category: any, index: number): JSX.Element => {
    return (
      <Grid container style={{ textAlign: 'center' }} className="item">
        <Grid item xs={2} style={{ padding: 0, lineHeight: '80px' }}>
          {index + 1}
        </Grid>
        <Grid item xs={5} style={{ padding: 0, lineHeight: '80px' }}>
          {category.name}
        </Grid>
        <Grid item xs={5} style={{ padding: 0, lineHeight: '80px' }}>
          {renderStatus(category.status)}
        </Grid>
      </Grid>
    )
  }

  return (
    <Container>
      {isLoading && (
        <Box
          sx={{
            width: '100%',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '1000',
          }}
        >
          <LinearProgress />
        </Box>
      )}
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý cửa hàng', path: '/shop' },
            { name: 'Sắp xếp' },
          ]}
        />
      </Box>
      <SimpleCard title="Danh sách danh mục">
        <div style={{ textAlign: 'end' }}>
          <Button
            variant="contained"
            style={{ width: '200px', margin: '15px 0', height: '52px' }}
            onClick={updateProductCategories}
            disabled={isLoading}
          >
            Cập nhật thay đổi
          </Button>
        </div>
        <Grid container style={{ textAlign: 'center', marginTop: '20px' }}>
          <Grid item xs={2}>
            <Typography variant="h6"> Vị trí hiển thị</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h6"> Tên danh mục</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h6"> Trạng thái</Typography>
          </Grid>
        </Grid>
        {categories && (
          <RLDD
            cssClasses="list-container"
            items={categories}
            itemRenderer={tableRowRender}
            onChange={handleRLDDChange}
          />
        )}
      </SimpleCard>
    </Container>
  )
}
