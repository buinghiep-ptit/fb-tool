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

export default function AddBanner(props: Props) {
  const navigation = useNavigate()
  const navigate = useNavigateParams()
  const [bannerId, setBannerId] = useState<any>()
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

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: bannerId ? 'Chi tiết banner' : 'Thêm mới banner' },
          ]}
        />
      </Box>

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
      </SimpleCard>
    </Container>
  )
}
