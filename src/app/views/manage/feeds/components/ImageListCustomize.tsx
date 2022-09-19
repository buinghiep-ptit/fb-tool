import { ImageList, ImageListItem } from '@mui/material'
import { Box } from '@mui/system'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { IMediaDetail, IMediaOverall } from 'app/models'
import * as React from 'react'

export interface IImageListViewProps {
  medias?: IMediaDetail[]
}

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
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
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

const regex = /^http[^ \!@\$\^&\(\)\+\=]+(\.png|\.jpeg|\.gif|\.jpg)$/

export function ImageListView({ medias }: IImageListViewProps) {
  const targetRef = React.useRef(null)
  const dimensions = useDimensions(targetRef)
  const imgSize = React.useMemo(
    () => ({ ...transformData(medias, dimensions) }),
    [dimensions],
  )

  console.log('imgSize:', imgSize.images)

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
              sx={{ cursor: 'pointer', borderRadius: 1, overflow: 'hidden' }}
              key={item.id}
              cols={item.cols || 1}
              rows={item.rows || 1}
            >
              <img
                onClick={() => console.log('show modal with pos:', index)}
                {...srcset(
                  item.url && regex.test(item.url)
                    ? item.url
                    : 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
                  121,
                  item.rows,
                  item.cols,
                )}
                alt={item.title}
                loading="lazy"
              />
              {imgSize.images.length > 5 && index === 4 && (
                <Box
                  onMouseDown={() => console.log('show modal last pos:', index)}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  }}
                >
                  <MuiTypography color={'primary'} variant="h4">
                    +{imgSize.images.length - 5}
                  </MuiTypography>
                </Box>
              )}
            </ImageListItem>
          ),
        )}
      </ImageList>
    </Box>
  )
}

const itemData1 = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    // title: 'Breakfast',
    // rows: 4, // len 1: row = 4 len 2: row = 2
    // cols: 4, // len 1: col = 4 len 2: col = 2
  },
]

const itemData2 = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    // title: 'Breakfast',
    // rows: 2, // len 1: row = 4 len 2: row = 2
    // cols: 2, // len 1: col = 4 len 2: col = 2
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    // title: 'Burger',
    // rows: 2, // len 2: row = 2
    // cols: 2, // len 2: col = 2
  },
]

const itemData3 = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    // title: 'Breakfast',
    // rows: 6,
    // cols: 4,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    // title: 'Burger',
    // rows: 3,
    // cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    // title: 'Camera',
    // rows: 3,
    // cols: 2,
  },
]

const itemData4 = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    // title: 'Breakfast',
    // rows: 6,
    // cols: 4,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    // title: 'Burger',
    // rows: 2,
    // cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    // title: 'Camera',
    // rows: 2,
    // cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    // title: 'Camera',
    // rows: 2,
    // cols: 2,
  },
]

const itemData5 = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    // title: 'Breakfast',
    // rows: 6,
    // cols: 6,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    // title: 'Burger',
    // rows: 6,
    // cols: 6,
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    // title: 'Camera',
    // rows: 4,
    // cols: 4,
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    // title: 'Coffee',
    // rows: 4,
    // cols: 4,
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    // title: 'Hats',
    // rows: 4,
    // cols: 4,
  },
]

const itemData6 = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    // title: 'Breakfast',
    // rows: 6,
    // cols: 6,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    // title: 'Burger',
    // rows: 6,
    // cols: 6,
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    // title: 'Camera',
    // rows: 4,
    // cols: 4,
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    // title: 'Coffee',
    // rows: 4,
    // cols: 4,
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    // title: 'Hats',
    // rows: 4,
    // cols: 4,
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    // title: 'Basketball',
  },
]
