import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { IMediaOverall } from 'app/models'
import { Box } from '@mui/system'
import { Icon, IconButton, Stack } from '@mui/material'
import { MuiTypography } from './MuiTypography'
import { Close } from '@mui/icons-material'

type Props = {
  initialIndexSlider?: number
  items?: IMediaOverall[]
  onRemoveItem?: (index?: number) => void
}

export default function SliderShow({
  initialIndexSlider = 0,
  items = [],
  onRemoveItem,
}: Props) {
  const [state, setState] = useState<{
    slideIndex?: number
    updateCount?: number
  }>({
    slideIndex: 0,
    updateCount: 0,
  })
  const sliderRef = useRef(null)

  useEffect(() => {
    if (!sliderRef || !sliderRef.current) return
    ;(sliderRef.current as any).slickGoTo(initialIndexSlider)
  }, [])

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: () =>
      setState(prev => ({
        ...prev,
        updateCount: (state.updateCount ?? 0) + 1,
      })),
    beforeChange: (current: number, next: number) =>
      setState(prev => ({ ...prev, slideIndex: next })),
  }

  return (
    <div
      style={{
        backgroundColor: 'darkslategrey',
        // backgroundImage: `url(${
        //   (!!items.length && items[state.slideIndex ?? 0].url) ??
        //   items[initialIndexSlider].url ??
        //   items[0].url ??
        //   'https://hinhgaixinh.com/wp-content/uploads/2021/07/20210618-mai-linh-5-835x1113.jpg'
        // })`,
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
        // backgroundAttachment: 'fixed',
        // color: 'whitesmoke',
        // backdropFilter: 'blur(8px)',
      }}
    >
      <Slider ref={sliderRef} {...settings}>
        {[...(items ?? [])].map((item, index) => {
          return (
            <div key={index}>
              <div>
                <img src={item.url} alt={''} />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    bgcolor: '#303030',
                    borderRadius: 1,
                  }}
                  onClick={() => onRemoveItem && onRemoveItem(index)}
                >
                  <Icon sx={{ color: 'white' }}>delete</Icon>
                  <MuiTypography sx={{ fontWeight: 500, color: 'white' }}>
                    Xoá ảnh
                  </MuiTypography>
                </IconButton>
              </div>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}
