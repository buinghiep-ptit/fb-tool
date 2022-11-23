import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Stack,
} from '@mui/material'
import FormInputText from 'app/components/common/MuiRHFInputText'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { IOrderDetail } from 'app/models/order'
import { ISODateTimeFormatter } from 'app/utils/formatters/dateTimeFormatters'
import { NavLink } from 'react-router-dom'

export interface ICustomerInfoProps {
  order?: IOrderDetail
  isViewer?: boolean
}

export function CustomerInfo({ order, isViewer }: ICustomerInfoProps) {
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
              <NavLink
                to={
                  // order?.customer?.userType === 1
                  //   ? `/quan-ly-tai-khoan-admin/${order?.customer?.id}/chi-tiet`
                  //   : `/quan-ly-tai-khoan-khach-hang/${order?.customer?.id}/thong-tin`

                  `/quan-ly-tai-khoan-khach-hang/${order?.customer?.id}/thong-tin`
                }
                // state={{
                //   modal: order?.customer?.userType === 1 ? true : false,
                // }}
                target="_blank"
                rel="noreferrer noopener"
              >
                <MuiTypography
                  color="primary"
                  variant="body2"
                  sx={{ textDecorationLine: 'underline' }}
                >
                  {`${
                    order?.customer?.fullName ? order?.customer?.fullName : ''
                  }`}
                  {`${
                    order?.customer?.mobilePhone
                      ? ' - ' + order?.customer?.mobilePhone
                      : ''
                  }`}
                  {`${
                    order?.customer?.email ? ' - ' + order?.customer?.email : ''
                  }`}
                </MuiTypography>
              </NavLink>
            </Grid>
          </Grid>

          {/* <Grid container spacing={1}>
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
                      disabled={isViewer}
                      name="dateStart"
                      label="Từ"
                      required={true}
                    />
                  </Stack>
                  <Stack flexDirection={'row'} gap={1}>
                    <MuiRHFDatePicker
                      disabled={isViewer}
                      name="dateEnd"
                      label="Đến"
                      required={true}
                    />
                  </Stack>
                </LocalizationProvider>
              </Stack>
            </Grid>
          </Grid> */}

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
                  disabled={isViewer}
                  clearIcon={!isViewer}
                />
                <FormInputText
                  label={'Số điện thoại'}
                  required
                  type="text"
                  name="mobilePhone"
                  defaultValue=""
                  fullWidth
                  disabled={isViewer}
                  clearIcon={!isViewer}
                />
                <FormInputText
                  label={'Email'}
                  type="email"
                  name="email"
                  defaultValue=""
                  fullWidth
                  disabled={isViewer}
                  clearIcon={!isViewer}
                />
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MuiTypography variant="subtitle2">
                Ghi chú của khách hàng
              </MuiTypography>
            </Grid>
            <Grid item xs={12} md={8}>
              <FormTextArea
                name="note"
                defaultValue={''}
                placeholder="Nội dung"
                disabled={isViewer}
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
