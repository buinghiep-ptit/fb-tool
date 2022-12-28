import { Avatar, Chip, Divider, Grid, Icon, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { UseQueryResult } from '@tanstack/react-query'
import { Breadcrumb, SimpleCard } from 'app/components'
import { CountdownTimer } from 'app/components/common/CountdownTimer'
import { ImageListView } from 'app/components/common/ImageListCustomize'
import { MediaViewItem } from 'app/components/common/MediaViewItem'
import { ModalFullScreen } from 'app/components/common/ModalFullScreen'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useApproveFeed,
  usePostsCheckData,
} from 'app/hooks/queries/useFeedsData'
import { IFeedDetail, Image } from 'app/models'
import { messages } from 'app/utils/messages'
import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export interface Props {}

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function PostsCheck(props: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const [open, setOpen] = useState(false)
  const [initialIndexSlider, setInitialIndexSlider] = useState(0)
  const [imagesModal, setImagesModal] = useState<Image[]>([])
  const type = location.state?.type ?? 1

  const {
    data: posts,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }: UseQueryResult<IFeedDetail[], Error> = usePostsCheckData(type)

  const onSuccess = (data: any) => {
    toastSuccess({ message: 'Duyệt bài đăng thành công' })
  }
  const { mutate: approve, isLoading: approveLoading } =
    useApproveFeed(onSuccess)

  const approveFeed = (feedId: number) => {
    approve(feedId)
  }

  const onClickMedia = (imgIndex?: number, images?: Image[]) => {
    setImagesModal(images ?? [])
    setInitialIndexSlider(imgIndex ?? 0)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const THREE_DAYS_IN_MS = 30 * 60 * 1000
  const NOW_IN_MS = new Date().getTime()

  const dateTimeAfterThreeDays = NOW_IN_MS + THREE_DAYS_IN_MS

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
                      sx={{ minWidth: 100 }}
                      onClick={() => approveFeed(post.id ?? 0)}
                      loading={approveLoading}
                    />
                    <MuiButton
                      title="Vi phạm"
                      variant="outlined"
                      color="error"
                      sx={{ minWidth: 100 }}
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
                    <>
                      <ImageListView
                        medias={post.images as Image[]}
                        onClickMedia={posImg =>
                          onClickMedia(posImg, post?.images as Image[])
                        }
                      />
                    </>
                  </Box>
                )}
              </Stack>
            </Stack>

            {posts && index < posts?.length - 1 && (
              <Divider
                orientation="horizontal"
                sx={{ backgroundColor: '#D9D9D9', mt: 3 }}
                flexItem
              />
            )}
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
      <Stack
        sx={{
          position: 'fixed',
          right: '48px',
          top: '80px',
          zIndex: 999,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CountdownTimer
          targetDate={dateTimeAfterThreeDays}
          callBack={() => refetch()}
        />

        <MuiButton
          title="Quay lại"
          variant="contained"
          color="inherit"
          onClick={() => navigate(-1)}
          startIcon={<Icon>keyboard_return</Icon>}
        />
      </Stack>
      <SimpleCard title={type === 1 ? 'Xét duyệt' : 'Vi phạm'}>
        <Stack gap={4} justifyContent="center" alignItems={'center'}>
          {posts.length ? (
            posts.map((post, index) => (
              <React.Fragment key={post.id}>
                {renderRowItem(post, index)}
              </React.Fragment>
            ))
          ) : (
            <Box
              minHeight={200}
              display="flex"
              alignItems="center"
              justifyContent={'center'}
              textAlign="center"
            >
              <Stack flexDirection={'row'} gap={1} alignItems="center">
                <Icon>find_in_page</Icon>
                <MuiTypography>{messages.MSG24}</MuiTypography>
              </Stack>
            </Box>
          )}
        </Stack>
      </SimpleCard>

      {imagesModal.length && (
        <ModalFullScreen
          mode="view"
          data={imagesModal}
          open={open}
          onCloseModal={handleClose}
          initialIndexSlider={initialIndexSlider}
        />
      )}
    </Container>
  )
}
