import { CircularProgress, ImageList, ImageListItem } from '@mui/material'
import { Box } from '@mui/system'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { FileInfoProgress } from 'app/hooks/useFilesUpload'
import { IMediaOverall } from 'app/models'
import * as React from 'react'
import { AbsoluteFillObject } from './AbsoluteFillObjectBox'

function useDimensions(targetRef: any) {
  const getDimensions = () => {
    return {
      width: targetRef.current ? targetRef.current.offsetWidth : 0,
      height: targetRef.current ? targetRef.current.offsetHeight : 0,
    }
  }

  const [dimensions, setDimensions] = React.useState(getDimensions)

  const handleResize = () => {
    setDimensions(getDimensions())
  }

  React.useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  React.useLayoutEffect(() => {
    handleResize()
  }, [])
  return dimensions
}

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}`,
    srcSet: `${image}`,
  }
}
const transformData = (images: any, dimensions: any) => {
  const HEIGHT_CONTAINER = dimensions.width
  const cloneImages = [...images]
  switch (cloneImages.length) {
    case 1:
      cloneImages[0].rows = 4
      cloneImages[0].cols = 4
      return {
        height: HEIGHT_CONTAINER,
        maxCols: 4,
        rowHeight: HEIGHT_CONTAINER / 4 - 4,
        images: cloneImages,
      }

    case 2:
      cloneImages[0].rows = cloneImages[0].cols = 2
      cloneImages[1].rows = cloneImages[1].cols = 2

      return {
        height: HEIGHT_CONTAINER / 2,
        maxCols: 4,
        rowHeight: HEIGHT_CONTAINER / 4 - 4,
        images: cloneImages,
      }

    case 3:
      cloneImages[0].rows = 6
      cloneImages[0].cols = 4
      cloneImages[1].rows = cloneImages[2].rows = 3
      cloneImages[1].cols = cloneImages[2].cols = 2

      return {
        height: HEIGHT_CONTAINER,
        maxCols: 6,
        rowHeight: HEIGHT_CONTAINER / 6 - 4,
        images: cloneImages,
      }

    case 4:
      cloneImages[0].rows = 6
      cloneImages[0].cols = 4
      cloneImages[1].rows = cloneImages[2].rows = cloneImages[3].rows = 2
      cloneImages[1].cols = cloneImages[2].cols = cloneImages[3].cols = 2

      return {
        height: HEIGHT_CONTAINER,
        maxCols: 6,
        rowHeight: HEIGHT_CONTAINER / 6 - 4,
        images: cloneImages,
      }

    case 5:
      cloneImages[0].rows = cloneImages[1].rows = 6
      cloneImages[0].cols = cloneImages[1].cols = 6
      cloneImages[2].rows = cloneImages[3].rows = cloneImages[4].rows = 4
      cloneImages[2].cols = cloneImages[3].cols = cloneImages[4].cols = 4

      return {
        height: (HEIGHT_CONTAINER * 10) / 12,
        maxCols: 12,
        rowHeight: HEIGHT_CONTAINER / 12 - 4,
        images: cloneImages,
      }

    default:
      cloneImages[0].rows = cloneImages[1].rows = 6
      cloneImages[0].cols = cloneImages[1].cols = 6
      cloneImages[2].rows = cloneImages[3].rows = cloneImages[4].rows = 4
      cloneImages[2].cols = cloneImages[3].cols = cloneImages[4].cols = 4

      return {
        height: (HEIGHT_CONTAINER * 10) / 12,
        maxCols: 12,
        rowHeight: HEIGHT_CONTAINER / 12 - 4,
        images: cloneImages,
      }
  }
}

type ProgressProps = {
  value: number
}

export function CircularProgressWithLabel(props: ProgressProps) {
  return (
    <>
      <CircularProgress
        variant="determinate"
        {...props}
        sx={{
          borderRadius: '100%',
          boxShadow: 'inset 0 0 0px 4px #EDFDEF',
          backgroundColor: 'transparent',
        }}
        thickness={4}
      />
      <AbsoluteFillObject>
        <MuiTypography color="primary" fontSize="0.75rem" fontWeight="600">
          {`${Math.round(props.value)}%`}
        </MuiTypography>
      </AbsoluteFillObject>
    </>
  )
}

export interface IImageListViewProps {
  progressInfos?: { val: FileInfoProgress[] } // 0: preview upload, 1: preview data
  medias?: IMediaOverall[]
  oldMedias?: IMediaOverall[]
  onClickMedia?: (position?: number) => void
}

export function ImageListView({
  progressInfos,
  medias,
  oldMedias,
  onClickMedia,
}: IImageListViewProps) {
  const targetRef = React.useRef(null)
  const dimensions = useDimensions(targetRef)
  const imgSize = React.useMemo(
    () => ({ ...transformData(medias, dimensions) }),
    [dimensions, medias],
  )

  return (
    <Box ref={targetRef}>
      <ImageList
        sx={{
          width: dimensions.width,
          height: imgSize.height,
        }}
        variant="quilted"
        cols={imgSize.maxCols}
        rowHeight={imgSize.rowHeight}
      >
        {imgSize.images.slice(0, 5).map(
          (
            item: IMediaOverall & {
              rows?: number
              cols?: number
              title?: string
            },
            index: number,
          ) => (
            <ImageListItem
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                overflow: 'hidden',
              }}
              key={index}
              cols={item.cols || 1}
              rows={item.rows || 1}
            >
              <img
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  onClickMedia && onClickMedia(index)
                }}
                {...srcset(
                  item.url // && regex.test(item.url)
                    ? item.url
                    : 'https://batdongsantoanquoc.net/no-image.png',
                  121,
                  item.rows,
                  item.cols,
                )}
                alt={item.title}
                loading="lazy"
                onLoad={() => {
                  // URL.revokeObjectURL(
                  //   item.url
                  //     ? item.url
                  //     : 'https://batdongsantoanquoc.net/no-image.png',
                  // )
                }}
              />
              {imgSize.images.length > 5 && index === 4 && (
                <AbsoluteFillObject
                  bgcolor="rgba(0, 0, 0, 0.7)"
                  onMouseDown={() => console.log('show modal last pos:', index)}
                >
                  <MuiTypography color={'primary'} variant="h4">
                    +{imgSize.images.length - 5}
                  </MuiTypography>
                </AbsoluteFillObject>
              )}

              {progressInfos?.val &&
                progressInfos.val[index - (oldMedias?.length ?? 0)] &&
                (progressInfos.val[index - (oldMedias?.length ?? 0)]
                  .percentage ?? 0) < 100 && (
                  <AbsoluteFillObject bgcolor="rgba(0, 0, 0, 0.7)">
                    <CircularProgressWithLabel
                      value={
                        progressInfos.val[index - (oldMedias?.length ?? 0)]
                          .percentage ?? 0
                      }
                    />
                  </AbsoluteFillObject>
                )}
            </ImageListItem>
          ),
        )}
      </ImageList>
    </Box>
  )
}
