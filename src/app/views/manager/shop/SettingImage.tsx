import { Box } from '@mui/system'
import * as React from 'react'
import { Breadcrumb, Container } from 'app/components'
import { Link } from 'react-router-dom'
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import CachedIcon from '@mui/icons-material/Cached'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SettingsIcon from '@mui/icons-material/Settings'
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart'
import { useEffect, useState } from 'react'
import { getProductCategories } from 'app/apis/shop/shop.service'
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
  const fetchProductCategories = async () => {
    const res = await getProductCategories()
    setProductCategories(res)
  }
  useEffect(() => {
    fetchProductCategories()
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
        <Button variant="contained" startIcon={<SettingsIcon />}>
          Cài đặt hình ảnh
        </Button>
        <Button
          variant="contained"
          startIcon={<StackedBarChartIcon />}
          style={{ marginLeft: '15px', background: 'black' }}
        >
          Sắp xếp
        </Button>
      </div>

      <div>
        {(productCategories || []).map((category: category) => {
          return (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h5">{category?.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List sx={style} component="nav" aria-label="mailbox folders">
                  <ListItem button>
                    <ListItemText primary="Inbox" />
                  </ListItem>
                  <Divider />
                  <ListItem button divider>
                    <ListItemText primary="Drafts" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Trash" />
                  </ListItem>
                  <Divider light />
                  <ListItem button>
                    <ListItemText primary="Spam" />
                  </ListItem>
                </List>
                {category.children.map((item: item) => (
                  <Typography>
                    <Link to={'#'}>{item.name}</Link>
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          )
        })}
      </div>
    </Container>
  )
}
