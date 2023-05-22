import { DragHandle } from '@mui/icons-material'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import { Grid, Icon, IconButton, Stack, Tooltip } from '@mui/material'
import { getListBanner, sortBanner } from 'app/apis/banner/banner.service'
import { Container, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { toastSuccess } from 'app/helpers/toastNofication'
import React, { useState } from 'react'
import RLDD from 'react-list-drag-and-drop/lib/RLDD'
import { Link, useNavigate } from 'react-router-dom'
import '../shop/shop.css'
interface banner {
  priority: number
  id: number
  title: string
  dateCreated: string
}
export interface Props {
  isLoading: any
  setIsLoading: any
}

export default function SubBanner(props: Props) {
  const navigate = useNavigate()
  const [banners, setBanner] = useState<banner[]>()

  const fetBanner = async () => {
    const res = await getListBanner({ position: 2 })
    setBanner(res)
  }
  React.useEffect(() => {
    fetBanner()
  }, [])

  const handleRLDDChange = (reorderedItems: any) => {
    setBanner(reorderedItems)
  }
  const priorityMap: { [id: number]: number } = {}
  banners?.forEach((item, index) => {
    item.priority = index + 1
    priorityMap[item.id] = item.priority
  })
  const updateBanner = async () => {
    props.setIsLoading(true)
    const res = await sortBanner({ priorityMap })
    if (res) {
      toastSuccess({
        message: 'Cập nhật thành công',
      })
      props.setIsLoading(false)
      fetBanner()
    }
  }

  const tableRowRender = (banner: any): JSX.Element => {
    return (
      <Grid container className="item">
        <Grid
          item
          xs={1}
          style={{
            padding: 0,
            lineHeight: '80px',
            textAlign: 'center',
          }}
        >
          {banner.priority}
        </Grid>
        <Grid
          item
          xs={6}
          style={{
            padding: 0,
            lineHeight: '80px',
            textAlign: 'left',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          <Link
            to={`/banner/${banner.id}`}
            style={{
              color: '#1AA3FF',
              textDecorationLine: 'underline',
              textAlign: 'left',
            }}
          >
            {banner.title}
          </Link>
        </Grid>
        <Grid
          item
          xs={3}
          style={{ padding: 0, lineHeight: '80px', textAlign: 'center' }}
        >
          {banner.dateCreated
            ? new Date(banner.dateCreated).toLocaleString()
            : ''}
        </Grid>
        <Grid
          item
          xs={2}
          style={{ padding: 0, lineHeight: '80px', textAlign: 'center' }}
        >
          <Tooltip title="Kéo để sắp xếp" placement="top">
            <IconButton color="info" sx={{ width: '33%' }}>
              <DragHandle />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sửa" placement="top">
            <IconButton
              color="secondary"
              sx={{ width: '33%' }}
              onClick={() => navigate(`/banner/${banner.id}`)}
            >
              <BorderColorIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    )
  }

  return (
    <Container>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '100px', zIndex: 9 }}
      >
        <MuiButton
          title="Cập nhật thay đổi "
          variant="contained"
          color="primary"
          type="submit"
          onClick={updateBanner}
          sx={{ whiteSpace: 'nowrap' }}
          startIcon={<Icon>upgrade</Icon>}
          disabled={props.isLoading}
        />
      </Stack>
      <SimpleCard title="Danh sách banner">
        <Grid container style={{ textAlign: 'center', paddingTop: '20px' }}>
          <Grid item xs={1}>
            Vị trí hiển thị
          </Grid>
          <Grid item xs={6}>
            Tiêu đề
          </Grid>
          <Grid item xs={3}>
            Thời gian thêm
          </Grid>
          <Grid item xs={2}>
            Hành động
          </Grid>
        </Grid>
        {banners && (
          <RLDD
            cssClasses="list-container"
            items={banners}
            itemRenderer={tableRowRender}
            onChange={handleRLDDChange}
          />
        )}
      </SimpleCard>
    </Container>
  )
}
