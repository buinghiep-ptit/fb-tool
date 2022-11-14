import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Divider,
  FormControlLabel,
  FormHelperText,
  Icon,
  IconButton,
  Radio,
  Stack,
} from '@mui/material'
import { Box } from '@mui/system'
import { MuiRHFRadioGroup } from 'app/components/common/MuiRHFRadioGroup'
import MuiRHFNumericFormatInput from 'app/components/common/MuiRHFWithNumericFormat'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { IOrderDetail, IService } from 'app/models/order'
import { BoxImage, TooltipText } from 'app/utils/columns/columnsEvents'
import { getServiceNameByType } from 'app/utils/enums/order'
import { CurrencyFormatter } from 'app/utils/formatters/currencyFormatter'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

export interface IOrderServicesProps {
  methods?: any
  order?: IOrderDetail
  fields?: IService[]
  isViewer?: boolean
}

export function OrderServices({
  methods,
  order,
  fields = [],
  isViewer,
}: IOrderServicesProps) {
  const services = methods.watch('services')

  const getTotalAmount = (
    services?: {
      quantity?: number
      amount?: number
    }[],
  ) => {
    const total = services?.reduce(
      (acc, service) =>
        acc + Number(service?.quantity ?? 0) * Number(service?.amount ?? 0),
      0,
    )

    return total
  }

  useEffect(() => {
    if (services && services.length) {
      services.forEach((item: any, index: number) => {
        if (
          convertToNumber(methods.watch(`services.${index}.quantity`)) > 0 &&
          convertToNumber(methods.watch(`services.${index}.quantity`)) <=
            999999999
        ) {
          methods.clearErrors(`services.${index}.quantity`)
        }
      })
    }
  }, [getTotalAmount(services)])

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
        <Stack gap={3}>
          {fields.map(
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

                  <Stack width="100%" gap={0.5}>
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
                  <Box minWidth={240}>
                    <Stack direction={'row'} alignItems="center" gap={1}>
                      <MuiRHFNumericFormatInput
                        disabled={isViewer}
                        label={'Số lượng'}
                        name={`services.${index}.quantity`}
                        fullWidth
                        required
                        isAllowZeroFirst={false}
                      />
                      <Stack>
                        <IconButton
                          disabled={
                            isViewer ||
                            convertToNumber(
                              methods.watch(`services.${index}.quantity`),
                            ) >= 999999999
                          }
                          onClick={() =>
                            methods.setValue(
                              `services.${index}.quantity`,
                              convertToNumber(
                                methods.getValues(
                                  `services.${index}.quantity`,
                                ) ?? '',
                              ) + 1,
                            )
                          }
                          size="small"
                          sx={{ p: 0, width: '24px', height: '24px' }}
                        >
                          <Icon
                            sx={{
                              fontSize: '40px!important',
                            }}
                          >
                            arrow_drop_up
                          </Icon>
                        </IconButton>
                        <IconButton
                          disabled={
                            isViewer ||
                            methods.watch(`services.${index}.quantity`) == 1
                          }
                          onClick={() =>
                            methods.setValue(
                              `services.${index}.quantity`,
                              convertToNumber(
                                methods.getValues(
                                  `services.${index}.quantity`,
                                ) ?? '',
                              ) - 1,
                            )
                          }
                          size="small"
                          sx={{ p: 0, width: '24px', height: '24px' }}
                        >
                          <Icon
                            sx={{
                              fontSize: '40px!important',
                            }}
                          >
                            arrow_drop_down
                          </Icon>
                        </IconButton>
                      </Stack>
                    </Stack>

                    {methods.formState.errors.services &&
                      methods.formState.errors.services.length &&
                      methods.formState.errors.services[index]?.quantity
                        ?.message && (
                        <FormHelperText error>
                          {
                            methods.formState.errors.services[index]?.quantity
                              ?.message
                          }
                        </FormHelperText>
                      )}
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
                  {CurrencyFormatter(
                    getTotalAmount(services) ?? order?.amount ?? 0,
                    2,
                  )}{' '}
                  VNĐ
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
