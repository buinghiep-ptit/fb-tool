import { Box } from '@mui/system'
import * as React from 'react'
import { Breadcrumb, SimpleCard, Container } from 'app/components'

import { Chip, Grid, Button, LinearProgress, Typography } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useState } from 'react'
import { getInformationProduct } from 'app/apis/shop/shop.service'

import './shop.css'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import { Mousewheel, Navigation, Thumbs } from 'swiper'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useParams } from 'react-router-dom'

export interface Props {}

export default function Product(props: Props) {
  const [products, setProducts] = useState<any>()
  const [isLoading, setIsloading] = useState(false)
  const [imagesNavSlider, setImagesNavSlider] = useState<any>([
    '',
    '',
    '',
    '',
    '',
  ])
  const [imagesNavSlider1, setImagesNavSlider1] = useState<any>()
  const params = useParams()
  const fetchProducts = async () => {
    const res = await getInformationProduct(params.id)
    setProducts(res)
  }

  React.useEffect(() => {
    fetchProducts()
  }, [])

  const slides = [
    'https://picsum.photos/1920/1080',
    'https://picsum.photos/1920/1081',
    'https://picsum.photos/1920/1082',
    'https://picsum.photos/1920/1083',
    'https://picsum.photos/1920/1084',
  ]

  return (
    <Container>
      {isLoading && (
        <Box
          sx={{
            width: '100%',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '1000',
          }}
        >
          <LinearProgress />
        </Box>
      )}
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: 'Quản lý cửa hàng', path: '/shop' }]}
        />
      </Box>
      <SimpleCard title="Tên sản phẩm">
        {(products || []).map((product: any, index: any) => {
          return (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <section className="slider">
                  <div className="slider__flex">
                    <div className="slider__col">
                      <div className={`slider__prev slider__prev${index}`}>
                        <KeyboardArrowUpIcon />
                      </div>

                      <div className="slider__thumbs">
                        <Swiper
                          // onSwiper={value => {
                          //   const arr = [...imagesNavSlider]
                          //   console.log(arr)
                          //   arr[index] = value
                          //   console.log(arr)
                          //   setImagesNavSlider(arr)
                          // }}
                          direction="vertical"
                          spaceBetween={24}
                          slidesPerView={3}
                          navigation={{
                            nextEl: `.slider__next${index}`,
                            prevEl: `.slider__prev${index}`,
                          }}
                          className={`swiper-container1 swiper-container-${index}`}
                          breakpoints={{
                            0: {
                              direction: 'horizontal',
                            },
                            768: {
                              direction: 'vertical',
                            },
                          }}
                          modules={[Navigation, Thumbs]}
                        >
                          {slides.map((slide, index) => {
                            return (
                              <SwiperSlide key={index}>
                                <div className="slider__image">
                                  <img src={slide} alt="" />
                                </div>
                              </SwiperSlide>
                            )
                          })}
                        </Swiper>
                      </div>

                      <div className={`slider__next slider__next${index}`}>
                        <KeyboardArrowDownIcon />
                      </div>
                    </div>

                    <div className="slider__images ">
                      <Swiper
                        thumbs={{ swiper: imagesNavSlider[index] }}
                        direction="horizontal"
                        slidesPerView={1}
                        spaceBetween={32}
                        mousewheel={true}
                        navigation={{
                          nextEl: `.slider__next${index}`,
                          prevEl: `.slider__prev${index}`,
                        }}
                        breakpoints={{
                          0: {
                            direction: 'horizontal',
                          },
                          768: {
                            direction: 'horizontal',
                          },
                        }}
                        className={`swiper-container2 swiper-container-${index}`}
                        modules={[Navigation, Thumbs, Mousewheel]}
                      >
                        {slides.map((slide, index) => {
                          return (
                            <SwiperSlide key={index}>
                              <div className="slider__image">
                                <img src={slide} alt="" />
                              </div>
                            </SwiperSlide>
                          )
                        })}
                      </Swiper>
                    </div>
                  </div>
                </section>
              </Grid>
              <Grid item xs={6} style={{ margin: 'auto 0' }}>
                <div>Mã hàng: {product.code}</div>
                <div>Tên sản phẩm: {product.name}</div>
                <div>Nhóm hàng: {product.category}</div>
                <div>Thương hiệu: {product.brand}</div>
                <div>Giá bán: {product.price}</div>
              </Grid>
            </Grid>
          )
        })}
      </SimpleCard>
    </Container>
  )
}
