import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Stack,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
import FormInputText from 'app/components/common/MuiRHFInputText'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { IOrderDetail } from 'app/models/order'
import { ISODateTimeFormatter } from 'app/utils/formatters/dateTimeFormatters'

export interface ICustomerInfoProps {
  order?: IOrderDetail
}

export function CustomerInfo({ order }: ICustomerInfoProps) {
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <MuiTypography>Thông tin người đặt</MuiTypography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack gap={2}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">Người đặt</MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <MuiTypography color="primary" variant="body2">
                [{order?.customer?.fullName}] - [{order?.customer?.mobilePhone}]
                - [{order?.customer?.email}]
              </MuiTypography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">
                Thời gian sử dụng
              </MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack flexDirection={'row'} gap={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack flexDirection={'row'} gap={1}>
                    <MuiRHFDatePicker
                      name="dateStart"
                      label="Từ"
                      required={true}
                    />
                  </Stack>
                  <Stack flexDirection={'row'} gap={1}>
                    <MuiRHFDatePicker
                      name="dateEnd"
                      label="Đến"
                      required={true}
                    />
                  </Stack>
                </LocalizationProvider>
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">Thời gian đặt</MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <MuiTypography color="primary" variant="body2">
                {ISODateTimeFormatter(order?.dateCreated ?? '')}
              </MuiTypography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">
                Thông tin liên hệ
              </MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack gap={2}>
                <FormInputText
                  label={'Người sử dụng'}
                  required
                  type="text"
                  name="fullName"
                  defaultValue=""
                  fullWidth
                />
                <FormInputText
                  label={'Số điện thoại'}
                  required
                  type="text"
                  name="mobilePhone"
                  defaultValue=""
                  fullWidth
                />
                <FormInputText
                  label={'Email'}
                  type="email"
                  name="email"
                  defaultValue=""
                  fullWidth
                />
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">Ghi chú</MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <FormTextArea
                name="note"
                defaultValue={''}
                placeholder="Ghi chú"
              />
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">Mã đơn hàng</MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <MuiTypography color="primary" variant="body2">
                {order?.orderCode}
              </MuiTypography>
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
