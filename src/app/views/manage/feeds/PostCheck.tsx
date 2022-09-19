import { Avatar, Divider, Grid, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchPostsCheck } from 'app/apis/feed/feed.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MediaViewItem } from 'app/components/common/MediaViewItem'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { IFeedDetail, IMediaDetail, IMediaOverall } from 'app/models'
import _ from 'lodash'
import * as React from 'react'
import { ImageListView } from './components/ImageListCustomize'

export interface Props {}

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function PostCheck(props: Props) {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  }: UseQueryResult<IFeedDetail[], Error> = useQuery<IFeedDetail[], Error>(
    ['posts-check'],
    fetchPostsCheck,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  )

  const mediaDefault: IMediaOverall = {
    id: 1,
    mediaFormat: 1,
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
    detail: {
      id: 1,
      coverImgUrl:
        'https://img.meta.com.vn/Data/image/2021/07/27/good-girl-nghia-la-gi-2.jpg',
    },
  }

  const renderRowItem = (post: IFeedDetail, index: number) => {
    console.log('post:', post)
    return (
      <>
        <Grid container spacing={2} justifyContent="center">
          <Grid item sm={8} xs={12}>
            <Stack flexDirection={'row'} gap={2}>
              <Avatar
                alt="avatar"
                src="/assets/images/app/avatar-default.svg"
                sx={{ width: 56, height: 56 }}
              />
              <Stack flex={1} gap={2}>
                <Stack
                  flexDirection={'row'}
                  gap={0.5}
                  justifyContent={'space-between'}
                >
                  <Stack flexDirection={'column'}>
                    <MuiTypography variant="subtitle2">ThangND44</MuiTypography>
                    <MuiTypography variant="body2">Nôi Dung</MuiTypography>
                    <MuiTypography variant="body2">#hashtag</MuiTypography>
                  </Stack>

                  <Stack flexDirection={'row'} gap={1}>
                    <MuiButton
                      title="Duyệt"
                      variant="contained"
                      color="primary"
                      type="submit"
                    />
                    <MuiButton
                      title="Vi phạm"
                      variant="outlined"
                      color="error"
                      type="submit"
                    />
                  </Stack>
                </Stack>
                {post.medias &&
                !_.isEmpty(post.medias) &&
                post.medias[0]?.url?.includes('.mp4') ? (
                  <Box width={'50%'}>
                    <MediaViewItem
                      media={post.medias[0]}
                      orientation="vertical"
                    />
                  </Box>
                ) : (
                  <Box width={'75%'}>
                    <ImageListView medias={post.medias} />
                  </Box>
                )}
              </Stack>
            </Stack>

            <Divider
              orientation="horizontal"
              sx={{ backgroundColor: '#D9D9D9', mt: 3 }}
              flexItem
            />
          </Grid>
        </Grid>
      </>
    )
  }

  if (isLoading) return <MuiLoading />

  if (isError)
    return (
      <Box my={2} textAlign="center">
        <MuiTypography variant="h5">
          Have an errors: {error.message}
        </MuiTypography>
      </Box>
    )

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý Feed', path: '/hau-kiem' },
            { name: 'Hậu kiểm' },
          ]}
        />
      </Box>
      <SimpleCard title="Xét duyệt">
        <Stack gap={4} justifyContent="center" alignItems={'center'}>
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              {renderRowItem(post, index)}
            </React.Fragment>
          ))}
        </Stack>
      </SimpleCard>
    </Container>
  )
}
