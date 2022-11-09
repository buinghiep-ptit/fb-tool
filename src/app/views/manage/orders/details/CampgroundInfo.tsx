import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  Stack,
} from '@mui/material'
import { Box } from '@mui/system'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { ICampArea } from 'app/models/camp'
import { ICampground } from 'app/models/order'
import { NavLink } from 'react-router-dom'

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
              <NavLink
                to={`/chi-tiet-diem-camp/${campground?.id}`}
                target="_blank"
                rel="noreferrer noopener"
                style={{ cursor: 'pointer' }}
              >
                <MuiTypography
                  color="primary"
                  variant="body2"
                  sx={{ textDecorationLine: 'underline' }}
                >
                  {campground.name}
                </MuiTypography>
              </NavLink>
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
                  campground?.merchant?.email ? campground?.merchant?.email : ''
                }`}
                {`${
                  campground?.merchant?.mobilePhone
                    ? ' - ' + campground?.merchant?.mobilePhone
                    : ''
                }`}
                {`${
                  campground?.merchant?.fullName
                    ? ' - ' + campground?.merchant?.fullName
                    : ''
                }`}
              </MuiTypography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">Địa danh</MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack flexDirection={'row'} flexWrap="wrap">
                {/* <MuiTypography color="primary" variant="body2">
                  {concatCampAreasName(campground.campAreas)}
                </MuiTypography> */}
                {campground.campAreas?.map((camp, index) => (
                  <span
                    key={camp.id}
                    style={{ whiteSpace: 'nowrap', color: '#2f9b42' }}
                  >
                    <NavLink
                      key={camp.id}
                      to={`/chi-tiet-dia-danh/${camp.id}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{
                        cursor: 'pointer',
                        textDecorationLine: 'underline',
                      }}
                    >
                      {camp.name}
                    </NavLink>
                    {campground?.campAreas &&
                    index < campground?.campAreas?.length - 1 ? (
                      <span>,&nbsp;</span>
                    ) : (
                      ''
                    )}
                  </span>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export const concatCampAreasName = (campAreas?: ICampArea[]) => {
  if (!campAreas || !campAreas.length) return ''
  let strName = ''
  campAreas.forEach((area, index) => {
    strName += area.name + (index === campAreas?.length - 1 ? '' : ', ')
  })
  return strName
}
