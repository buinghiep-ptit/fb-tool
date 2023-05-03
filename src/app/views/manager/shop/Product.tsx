import { Box } from '@mui/system'
import { Breadcrumb, Container, SimpleCard } from 'app/components'
import * as React from 'react'

import { Grid, LinearProgress } from '@mui/material'
import { getInformationProduct } from 'app/apis/shop/shop.service'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useLocation, useParams } from 'react-router-dom'
import { Mousewheel, Navigation, Thumbs } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import './shop.css'

export interface Props {}

export default function Product(props: Props) {
  const [products, setProducts] = useState<any>()
  const [isLoading, setIsloading] = useState(false)
  const { state } = useLocation()
  const [slides, setSlides] = useState<any>([])
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
    setSlides(res.listImgUrlNew)
  }

  React.useEffect(() => {
    fetchProducts()
  }, [])

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
          routeSegments={[
            { name: 'Quản lý cửa hàng', path: '/shop' },
            {
              name: state?.category,
              path: state?.path || '#',
            },
            {
              name: state.name,
            },
          ]}
        />
      </Box>
      <SimpleCard title="">
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
                          {(product.listImgUrlNew || []).map(
                            (slide: any, index: number) => {
                              return (
                                <SwiperSlide key={index}>
                                  <div className="slider__image">
                                    <img src={slide} alt="" />
                                  </div>
                                </SwiperSlide>
                              )
                            },
                          )}
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
                        {(product.listImgUrlNew || []).map(
                          (slide: any, index: number) => {
                            return (
                              <SwiperSlide>
                                <div className="slider__image">
                                  <img src={slide} alt="" />
                                </div>
                              </SwiperSlide>
                            )
                          },
                        )}
                      </Swiper>
                    </div>
                  </div>
                </section>
              </Grid>
              <Grid item xs={6} style={{ paddingTop: '32px' }}>
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
