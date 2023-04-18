import { Grid, Icon, IconButton, Stack, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import { getListBanner } from 'app/apis/banner/banner.service'
import { Breadcrumb, Container, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { Banner } from 'app/models'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import React, { useState } from 'react'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import RLDD, { RLDDItem } from 'react-list-drag-and-drop/lib/RLDD'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Delete, DragHandle } from '@mui/icons-material'

export interface Props {}
export interface BannerFilters {
  page?: number | 0
  size?: number | 20
}

export default function BannerManager(props: Props) {
  const navigation = useNavigate()
  const navigate = useNavigateParams()
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [page, setPage] = useState<number>(
    queryParams.page ? +queryParams.page : 0,
  )
  const [size, setSize] = useState<number>(
    queryParams.size ? +queryParams.size : 20,
  )
  const [defaultValues] = useState<BannerFilters>({
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })
  const [filters, setFilters] = useState<BannerFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )
  const { data, isLoading, isFetching, isError, error } = useQuery<
    Banner[],
    Error
  >(['banners', filters], () => getListBanner(filters), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!filters,
  })
  console.log(data)

  //   const tableRowRender = (): JSX.Element => {
  //     return (
  //       <>
  //         {data?.map(banner => (
  //           <Grid
  //             container
  //             style={{ textAlign: 'center' }}
  //             className="item"
  //             key={banner.id}
  //           >
  //             <Grid item xs={2} style={{ padding: 0, lineHeight: '80px' }}>
  //               {banner.priority}
  //             </Grid>
  //             <Grid item xs={4} style={{ padding: 0, lineHeight: '80px' }}>
  //               {banner.title}
  //             </Grid>
  //             <Grid item xs={4} style={{ padding: 0, lineHeight: '80px' }}>
  //               {banner.dateCreated}
  //             </Grid>
  //             <Grid item xs={2} style={{ padding: 0, lineHeight: '80px' }}></Grid>
  //           </Grid>
  //         ))}
  //       </>
  //     )
  //   }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý banner' }]} />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Thêm banner"
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => navigation(`chi-tiet-banner`, {})}
          startIcon={<Icon>control_point</Icon>}
          sx={{ width: '50%' }}
        />
        <MuiButton
          title="Cập nhật thay đổi "
          variant="contained"
          color="primary"
          type="submit"
          sx={{ width: '50%', whiteSpace: 'nowrap' }}
          startIcon={<Icon>upgrade</Icon>}
        />
      </Stack>
      <SimpleCard title="Danh sách banner">
        <Grid container style={{ textAlign: 'center', paddingTop: '20px' }}>
          <Grid item xs={2}>
            Vị trí hiển thị (trên Home)
          </Grid>
          <Grid item xs={4}>
            Tiêu đề
          </Grid>
          <Grid item xs={4}>
            Thời gian thêm
          </Grid>
          <Grid item xs={2}>
            Hành động
          </Grid>
        </Grid>
        {data?.map(banner => (
          <Grid
            container
            style={{ textAlign: 'center' }}
            className="item"
            key={banner.id}
          >
            <Grid item xs={2} style={{ padding: 0, lineHeight: '80px' }}>
              {banner.priority}
            </Grid>
            <Grid item xs={4} style={{ padding: 0, lineHeight: '80px' }}>
              <Link
                to="/"
                style={{ color: 'green', textDecorationLine: 'underline' }}
              >
                {banner.title}
              </Link>
            </Grid>
            <Grid item xs={4} style={{ padding: 0, lineHeight: '80px' }}>
              {banner.dateCreated}
            </Grid>
            <Grid item xs={2} style={{ padding: 0, lineHeight: '80px' }}>
              <Tooltip title="Sắp xếp" placement="top">
                <IconButton color="info" sx={{ width: '33%' }}>
                  <DragHandle />
                </IconButton>
              </Tooltip>
              <Tooltip title="Sửa" placement="top">
                <IconButton color="secondary" sx={{ width: '33%' }}>
                  <BorderColorIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa" placement="top">
                <IconButton color="primary" sx={{ width: '33%' }}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        ))}
      </SimpleCard>
    </Container>
  )
}
