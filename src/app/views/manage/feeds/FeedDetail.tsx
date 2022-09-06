import { CardMedia, Grid, styled } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { Breadcrumb, SimpleCard } from 'app/components'
import MediaItem from 'app/components/common/MediaItem'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { columnsFeedLogs } from 'app/utils/columns'
import { NavLink } from 'react-router-dom'

export interface Props {}

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function FeedDetail(props: Props) {
  const medias = [
    {
      id: 1,
      name: 'God of game',
      backgroundImage: '/assets/videos/thumbnail.jpeg',
      clip: { clip: '/assets/videos/download.mp4', video: 'video1' },
    },
    {
      id: 2,
      name: 'God of game',
      backgroundImage: '/assets/videos/thumbnail.jpeg',
      clip: null,
    },
    ,
    {
      id: 3,
      name: 'God of game',
      backgroundImage: '/assets/videos/thumbnail.jpeg',
      clip: null,
    },
  ]
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý Feed', path: '/quan-ly-feeds' },
            { name: 'Chi tiết' },
          ]}
        />
      </Box>
      <SimpleCard title="Logs Table">
        <Box>
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
              <Box>
                <MuiTypography variant="subtitle2">[Nội dung]</MuiTypography>
                <MuiTypography variant="body2">Mô tả</MuiTypography>
              </Box>
              <Box mt={1}>
                <MuiTypography variant="subtitle2">[Hashtag]</MuiTypography>
                <MuiTypography variant="body2">#campdi</MuiTypography>
              </Box>
            </Grid>
            <Grid item sm={3} xs={12}>
              <MuiButton
                title="Duyệt"
                variant="contained"
                color="primary"
                type="submit"
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <NavLink to={'/quan-ly-feeds/bao-cao-vi-pham'}>
                <MuiButton
                  title="Vi phạm"
                  variant="outlined"
                  color="error"
                  type="submit"
                  sx={{ width: '100%' }}
                />
              </NavLink>
            </Grid>
          </Grid>
          <Box
            width={300}
            sx={{ position: 'relative', cursor: 'pointer', py: 2 }}
          >
            {medias.map(media => (
              <MediaItem key={(media as any).id} game={media as any} />
            ))}
          </Box>
        </Box>
        <Box mt={2}>
          <MuiStyledTable
            rows={[]}
            columns={columnsFeedLogs}
            onClickRow={() => {}}
            isFetching={false}
          />
        </Box>
      </SimpleCard>
    </Container>
  )
}
