import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Stack,
} from '@mui/material'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { ICampground } from 'app/models/order'
import * as React from 'react'

export interface ICampgroundInfoProps {
  campground?: ICampground
}

export function CampgroundInfo({ campground = {} }: ICampgroundInfoProps) {
  return (
    <Accordion defaultExpanded={true} sx={{ height: '100%' }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <MuiTypography>Thông tin điểm camp</MuiTypography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack gap={2}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">Tên điểm camp</MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <MuiTypography color="primary" variant="body2">
                {campground.name}
              </MuiTypography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">Địa chỉ</MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <MuiTypography color="primary" variant="body2">
                {campground.address}
              </MuiTypography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">Chủ camp</MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <MuiTypography color="primary" variant="body2">
                nghiepbv2 - 090000000 - Bui Nghiep
              </MuiTypography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">Địa danh</MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <MuiTypography color="primary" variant="body2">
                Hà Nội
              </MuiTypography>
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
