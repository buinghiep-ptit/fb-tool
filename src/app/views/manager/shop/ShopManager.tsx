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
} from '@mui/material'
import CachedIcon from '@mui/icons-material/Cached'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SettingsIcon from '@mui/icons-material/Settings'
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart'
import { useEffect, useState } from 'react'
import { getProductCategories, syncStatus } from 'app/apis/shop/shop.service'
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

  const fetchProductCategories = async () => {
    const res = await getProductCategories()
    setProductCategories(res)
  }

  const syncCategory = async () => {
    const res = await syncCategory()

    watchRequest()
  }

  useEffect(() => {
    fetchProductCategories()
    const watchRequest = setInterval(() => {
      const resStatus = await syncStatus({ isProduct: 1 })
      if (resStatus) {
        clearInterval(watchRequest)
      }
    }, 20000)
  }, [])

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý cửa hàng' }]} />
      </Box>
      <div style={{ textAlign: 'end' }}>
        <Button
          variant="contained"
          startIcon={<CachedIcon />}
          style={{ width: '200px', margin: '15px 0', height: '52px' }}
        >
          Đồng bộ dữ liệu
        </Button>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <Button
          variant="contained"
          startIcon={<SettingsIcon />}
          onClick={() => {
            console.log('data')
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
      <DialogSettingImage ref={dialogSettingImageRef}></DialogSettingImage>
    </Container>
  )
}
