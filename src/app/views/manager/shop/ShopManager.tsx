import { Box } from '@mui/system'
import * as React from 'react'
import { Breadcrumb, Container } from 'app/components'
import { Link, useNavigate } from 'react-router-dom'
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material'
import CachedIcon from '@mui/icons-material/Cached'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SettingsIcon from '@mui/icons-material/Settings'
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart'
import { useEffect, useState } from 'react'
import {
  getProductCategories,
  syncCategory,
  syncStatus,
} from 'app/apis/shop/shop.service'
import DialogSettingImage from './DialogSettingImage'

export interface Props {}

interface item {
  id: number
  name: string
  children: Array<any>
}
interface category {
  id: number
  name: string
  children: Array<item>
}

const style = {
  width: '100%',
  bgcolor: 'background.paper',
}

export default function ShopManager(props: Props) {
  const [productCategories, setProductCategories] = useState<category[]>()
  const navigate = useNavigate()
  const dialogSettingImageRef = React.useRef<any>(null)
  const [intervalCheck, setIntervalCheck] = useState(0)
  const [isLoading, setIsloading] = useState(false)

  const fetchProductCategories = async () => {
    const res = await getProductCategories()
    setProductCategories(res)
  }

  // eslint-disable-next-line prefer-const
  // const handleInterval = setInterval(() => {
  //   console.log('x')
  // }, 2000)

  // const tmp = handleInterval()

  const handleSyncCategory = async () => {
    const res = await syncCategory()
    if (res) {
      // eslint-disable-next-line prefer-const
      let status = 0
      while (status === 0) {
        console.log('a')
        await new Promise<void>(resolve =>
          setTimeout(async () => {
            const statusRes = await watchStatusSync()
            console.log(statusRes)
            if (statusRes === 0) {
              status = 1
            }
            resolve()
          }, 20000),
        )
      }
    }
  }

  const watchStatusSync = async () => {
    const res = await syncStatus({ isProduct: 0 })
    return res.status
  }

  // useEffect(() => {
  //   if (intervalCheck === 0) return
  //   watchStatusSync()
  // }, [intervalCheck])

  useEffect(() => {
    fetchProductCategories()
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
        <Breadcrumb routeSegments={[{ name: 'Quản lý cửa hàng' }]} />
      </Box>
      <div style={{ textAlign: 'end' }}>
        <Button
          variant="contained"
          startIcon={<CachedIcon />}
          style={{ width: '200px', margin: '15px 0', height: '52px' }}
          onClick={() => handleSyncCategory()}
        >
          Đồng bộ dữ liệu
        </Button>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <Button
          variant="contained"
          startIcon={<SettingsIcon />}
          onClick={() => {
            dialogSettingImageRef?.current.handleClickOpen()
          }}
        >
          Cài đặt hình ảnh
        </Button>
        <Button
          variant="contained"
          startIcon={<StackedBarChartIcon />}
          style={{ marginLeft: '15px', background: 'black' }}
          onClick={() => navigate('/shop/sort')}
        >
          Sắp xếp
        </Button>
      </div>

      <div>
        {(productCategories || []).map((category: category) => {
          return (
            <Accordion key={category.name}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Link to={`/shop/category/${category.id}`} key={category.name}>
                  <Typography variant="h5">{category?.name}</Typography>
                </Link>
              </AccordionSummary>
              <AccordionDetails>
                <List sx={style} component="nav" aria-label="mailbox folders">
                  {category.children.map((item: item) => (
                    <Link to={`/shop/category/${item.id}`} key={item.name}>
                      <ListItem button>
                        <ListItemText primary={item.name} />
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </div>
      <DialogSettingImage
        ref={dialogSettingImageRef}
        isLoading={isLoading}
        setIsLoading={setIsloading}
      ></DialogSettingImage>
    </Container>
  )
}
