import { Avatar, Chip, Divider, Grid, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchPostsCheck } from 'app/apis/feed/feed.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { ImageListView } from 'app/components/common/ImageListCustomize'
import { MediaViewItem } from 'app/components/common/MediaViewItem'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useApproveFeed } from 'app/hooks/queries/useFeedsData'
import { IFeedDetail, Image } from 'app/models'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()

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

  const onSuccess = (data: any) => {
    toastSuccess({ message: 'Duyệt bài đăng thành công' })
  }
  const { mutate: approve, isLoading: approveLoading } =
    useApproveFeed(onSuccess)

  const approveFeed = (feedId: number) => {
    approve(feedId)
  }

  const renderRowItem = (post: IFeedDetail, index: number) => {
    return (
      <>
        <Grid container spacing={2} justifyContent="center">
          <Grid item sm={8} xs={12}>
            <Stack flexDirection={'row'} gap={2}>
              <Avatar
                alt="avatar"
                src={
                  post.customerInfo?.avatar
                    ? post.customerInfo?.avatar
                    : '/assets/images/app/avatar-default.svg'
                }
                sx={{ width: 56, height: 56 }}
              />
              <Stack flex={1} gap={2}>
                <Stack
                  flexDirection={'row'}
                  gap={0.5}
                  justifyContent={'space-between'}
                >
                  <Stack flexDirection={'column'}>
                    <MuiTypography variant="subtitle2">
                      {post.customerInfo?.fullName}
                    </MuiTypography>
                    <MuiTypography variant="body2">
                      {post.content}
                    </MuiTypography>
                    <Stack flexDirection={'row'} gap={1} my={1}>
                      {post?.tags?.map(tag => (
                        <Chip
                          key={tag.id}
                          label={`#${tag.value}`}
                          size="small"
                          // color={true ? 'primary' : 'default'}
                          sx={{
                            px: 1,
                            backgroundColor: '#DDD',
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>

                  <Stack flexDirection={'row'} gap={1}>
                    <MuiButton
                      title="Duyệt"
                      variant="contained"
                      color="primary"
                      onClick={() => approveFeed(post.id ?? 0)}
                      loading={approveLoading}
                    />
                    <MuiButton
                      title="Vi phạm"
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        navigate(`${post.id ?? 0}/vi-pham`, {
                          state: { modal: true },
                        })
                      }
                    />
                  </Stack>
                </Stack>
                {post.type === 1 ? (
                  <Box width={'50%'}>
                    <MediaViewItem
                      media={post.video as any}
                      orientation="vertical"
                    />
                  </Box>
                ) : (
                  <Box width={'75%'} mt={-2}>
                    <ImageListView medias={post.images as Image[]} />
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
