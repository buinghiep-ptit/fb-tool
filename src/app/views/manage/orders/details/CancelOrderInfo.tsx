import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Stack,
} from '@mui/material'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { IOrderDetail } from 'app/models/order'

export interface ICustomerInfoProps {
  order?: IOrderDetail
}

export function CancelOrderInfo({ order }: ICustomerInfoProps) {
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <MuiTypography>Yêu cầu huỷ</MuiTypography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack gap={2}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">
                Đối tượng yêu cầu
              </MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <MuiTypography color="primary" variant="body2">
                {`${
                  order?.cancelRequest?.requester.fullName
                    ? order?.cancelRequest?.requester.fullName + '-'
                    : ''
                }`}
                {`${
                  order?.cancelRequest?.requester.mobilePhone
                    ? order?.cancelRequest?.requester.mobilePhone + '-'
                    : ''
                }`}
                {order?.cancelRequest?.requester.email}
              </MuiTypography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">Lý do</MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <FormTextArea
                name="reason"
                defaultValue={order?.cancelRequest?.reason ?? ''}
                placeholder="Lý do"
              />
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
