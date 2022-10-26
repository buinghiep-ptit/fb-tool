import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  Stack,
} from '@mui/material'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { ICampground } from 'app/models/order'

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
                {`${
                  campground?.merchant?.email
                    ? campground?.merchant?.email + '-'
                    : ''
                }`}
                {`${
                  campground?.merchant?.mobilePhone
                    ? campground?.merchant?.mobilePhone + '-'
                    : ''
                }`}
                {campground?.merchant?.fullName}
              </MuiTypography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">Địa danh</MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack flexDirection={'row'} gap={1}>
                {campground.campAreas?.map((camp, index) => (
                  <Stack key={camp.id} flexDirection={'row'}>
                    <MuiTypography color="primary" variant="body2">
                      {camp.name}
                    </MuiTypography>
                    {campground.campAreas &&
                      campground.campAreas?.length &&
                      index !== campground.campAreas?.length - 1 && (
                        <Divider
                          orientation="vertical"
                          sx={{ backgroundColor: '#D9D9D9', mx: 1, my: 0.5 }}
                          flexItem
                        />
                      )}
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
