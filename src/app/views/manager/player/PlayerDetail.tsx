import { Box } from '@mui/system'
import * as React from 'react'
import { Breadcrumb, SimpleCard, Container } from 'app/components'

import {
  Chip,
  Grid,
  Button,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import { useState } from 'react'
import {
  getCategoriesSort,
  updateCategoriesSort,
} from 'app/apis/shop/shop.service'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import BackupIcon from '@mui/icons-material/Backup'

interface category {
  name: string
  priority: number
  id: number
  status: number
}
export interface Props {}

export default function PlayerDetail(props: Props) {
  const [categories, setCategories] = useState<category[]>()
  const [isLoading, setIsloading] = useState(false)
  const [file, setFile] = useState<any>()
  const [expanded, setExpanded] = React.useState<string | false>(false)

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  const fetchProductCategories = async () => {
    const res = await getCategoriesSort()
    setCategories(res)
  }

  React.useEffect(() => {
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
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý cầu thủ', path: '/players' },
            { name: 'Thông tin cầu thủ' },
          ]}
        />
      </Box>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Thông tin chung
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    id="outlined-basic"
                    label="Tên cầu thủ*"
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    margin="normal"
                    id="outlined-basic"
                    label="Quê quán*"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    id="outlined-basic"
                    label="Số điện thoại*"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    style={{ marginRight: '15px' }}
                    id="time"
                    label="Ngày sinh"
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Tình trạng hôn nhân
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Tình trạng hôn nhân"
                    >
                      <MenuItem value={0}>Độc thân</MenuItem>
                      <MenuItem value={1}>Đã kết hôn</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    id="outlined-basic"
                    label="Số CCCD*"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    style={{ marginRight: '15px' }}
                    margin="normal"
                    id="time"
                    label="Ngày cấp"
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    id="outlined-basic"
                    label="Số hộ chiếu"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    style={{ marginRight: '15px' }}
                    margin="normal"
                    id="time"
                    label="Ngày cấp"
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    style={{ marginRight: '15px' }}
                    margin="normal"
                    id="time"
                    label="Ngày hết hạn"
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} style={{ paddingLeft: '10%' }}>
              <Typography>Ảnh chân dung*:</Typography>
              <input
                type="file"
                id="uploadImage"
                style={{ display: 'none' }}
                onChange={(event: any) => {
                  console.log(event.target.files)
                  setFile(event.target.files[0])
                }}
              />
              <div
                onClick={() => {
                  const inputUploadImage = document.getElementById(
                    'uploadImage',
                  ) as HTMLInputElement | null
                  inputUploadImage?.click()
                }}
                style={{
                  width: 500,
                  height: 400,
                  border: '2px dashed black',
                  textAlign: 'center',
                  paddingTop: '100px',
                }}
              >
                {!file && (
                  <div>
                    <div>Chọn ảnh để tải lên</div>
                    <div>Hoặc kéo và thả tập tin</div>
                    <BackupIcon fontSize="large" />
                    <div>PNG/JPEG hoặc JPG</div>
                    <div>Dung lượng không quá 50mb</div>
                    <div>(Tỷ lệ ảnh phù hợp)</div>
                  </div>
                )}

                {file?.type.startsWith('image/') && (
                  <img
                    src={window.URL.createObjectURL(file)}
                    width="480px"
                    height="270px"
                  ></img>
                )}
              </div>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Thông tin cầu thủ
          </Typography>
        </AccordionSummary>
        <AccordionDetails></AccordionDetails>
      </Accordion>
    </Container>
  )
}
