import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Divider,
  FormControlLabel,
  Icon,
  Radio,
  Stack,
} from '@mui/material'
import { Box } from '@mui/system'
import { MuiButton } from 'app/components/common/MuiButton'
import { MuiRHFRadioGroup } from 'app/components/common/MuiRHFRadioGroup'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { IOrderDetail } from 'app/models/order'
import { BoxImage, TooltipText } from 'app/utils/columns/columnsEvents'
import { getServiceNameByType } from 'app/utils/enums/order'
import { CurrencyFormatter } from 'app/utils/formatters/currencyFormatter'
import moment from 'moment'
import { NavLink, useNavigate } from 'react-router-dom'

export interface IOrderServicesProps {
  order?: IOrderDetail
  isViewer?: boolean
}

export function OrderServices({ order, isViewer }: IOrderServicesProps) {
  const navigate = useNavigate()
  // const getTotalAmount = (
  //   services?: {
  //     quantity?: number
  //     amount?: number
  //   }[],
  // ) => {
  //   const total = services?.reduce(
  //     (acc, service) =>
  //       acc + Number(service?.quantity ?? 0) * Number(service?.amount ?? 0),
  //     0,
  //   )

  //   return total
  // }

  const getColorServiceType = (type?: number) => {
    switch (type) {
      case 1:
        return 'primary'
      case 2:
      case 1:
        return 'secondary'
      case 3:
        return 'default'

      default:
        return 'default'
    }
  }

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <MuiTypography>Dịch vụ đặt</MuiTypography>
      </AccordionSummary>

      <AccordionDetails>
        <MuiTypography variant="subtitle2" px={1} mb={1.5}>
          {moment(order?.dateStart).format('DD/MM/YYYY')}
          {' - '}
          {moment(order?.dateEnd).format('DD/MM/YYYY')}
        </MuiTypography>

        <Stack gap={3}>
          {order?.services &&
            order?.services.map(
              ({ idService, quantity, name, type, amount, imgUrl }, index) => (
                <Stack
                  key={index ?? idService}
                  direction={{
                    sm: 'column',
                    md: 'row',
                  }}
                  alignItems="center"
                  justifyContent={'space-between'}
                >
                  <Stack
                    direction={{
                      sm: 'column',
                      md: 'row',
                    }}
                    gap={3}
                    alignItems="center"
                    justifyContent={'space-between'}
                    flex={1}
                  >
                    <BoxImage maxWidth={100} url={imgUrl} />

                    <Stack width="100%" gap={1}>
                      <NavLink
                        to={`/quan-ly-dich-vu/${idService}/chi-tiet`}
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{ cursor: 'pointer' }}
                      >
                        <TooltipText
                          text={name}
                          underline={true}
                          color="primary"
                          variant="subtitle2"
                        />
                      </NavLink>

                      <Stack direction={'row'} gap={1}>
                        <MuiTypography variant="body2">
                          Loại dịch vụ:
                        </MuiTypography>

                        <Chip
                          label={getServiceNameByType(type ?? 0)}
                          size="small"
                          color={getColorServiceType(type)}
                        />
                      </Stack>
                    </Stack>
                    <Box minWidth={140}>
                      <Stack
                        direction={'row'}
                        alignItems="center"
                        gap={1}
                        px={1}
                      >
                        <MuiTypography variant="subtitle2">
                          Số lượng:
                        </MuiTypography>
                        <MuiTypography
                          variant="body2"
                          color={'primary'}
                          fontWeight={500}
                        >
                          {CurrencyFormatter(quantity ?? 0, 2)}{' '}
                          {type === 3 ? 'sản phẩm' : 'người'}
                        </MuiTypography>
                      </Stack>
                    </Box>
                  </Stack>

                  <Stack
                    flexDirection="row"
                    gap={1}
                    justifyContent={'flex-end'}
                    minWidth={200}
                  >
                    <MuiTypography variant="subtitle2">Giá:</MuiTypography>
                    <MuiTypography
                      variant="body2"
                      color={'primary'}
                      fontWeight={500}
                    >
                      {CurrencyFormatter(amount ?? 0, 2)} VNĐ
                    </MuiTypography>
                  </Stack>
                </Stack>
              ),
            )}
          {!isViewer && (
            <Box p={1}>
              <MuiButton
                title="Cập nhật dịch vụ"
                variant="contained"
                color="primary"
                onClick={() =>
                  navigate(`update-service`, {
                    state: { modal: true },
                  })
                }
                startIcon={<Icon>cached</Icon>}
              />
            </Box>
          )}
          <Stack alignItems={'flex-end'} gap={1}>
            <Stack flexDirection="row" gap={2}>
              <MuiTypography variant="subtitle2">Cọc:</MuiTypography>
              <MuiTypography variant="body2" color={'primary'} fontWeight={500}>
                {CurrencyFormatter(order?.deposit ?? 0, 2)} VNĐ
              </MuiTypography>
            </Stack>
            <Box>
              <Stack flexDirection="row" gap={2}>
                <MuiTypography variant="subtitle2">Tổng thực tế:</MuiTypography>
                <MuiTypography
                  variant="body2"
                  color={'primary'}
                  fontWeight={500}
                >
                  {CurrencyFormatter(order?.amount ?? 0, 2)} VNĐ
                </MuiTypography>
              </Stack>
              {order?.status !== 0 &&
                order?.status !== 1 &&
                order?.status !== 2 &&
                order?.status !== -1 && (
                  <>
                    <MuiRHFRadioGroup name="paymentType" defaultValue={1}>
                      <Stack flexDirection={'row'} gap={1.5}>
                        <FormControlLabel
                          value={1}
                          disabled
                          control={<Radio />}
                          label="Thanh toán toàn bộ"
                        />
                        <FormControlLabel
                          value={2}
                          disabled
                          control={<Radio />}
                          label="Đặt cọc"
                        />
                      </Stack>
                    </MuiRHFRadioGroup>
                    <Divider
                      orientation="horizontal"
                      sx={{ backgroundColor: '#D9D9D9', my: 1 }}
                      flexItem
                    />
                    <Stack flexDirection="row" gap={2}>
                      <MuiTypography variant="subtitle2">
                        Đã thanh toán:
                      </MuiTypography>
                      <MuiTypography
                        variant="body2"
                        color={'primary'}
                        fontWeight={500}
                      >
                        {CurrencyFormatter(order?.paymentTrans?.amount ?? 0, 2)}
                        VNĐ
                      </MuiTypography>
                    </Stack>
                  </>
                )}
            </Box>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export const convertToNumber = (val: string | number) => {
  const numVal = Number(val?.toString().replace(/,(?=\d{3})/g, '') ?? 0)
  return numVal
}
