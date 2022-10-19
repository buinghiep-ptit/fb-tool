import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormHelperText,
  Stack,
} from '@mui/material'
import { Box } from '@mui/system'
import MuiRHFNumericFormatInput from 'app/components/common/MuiRHFWithNumericFormat'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { IOrderDetail, IService } from 'app/models/order'
import { CurrencyFormatter } from 'app/utils/formatters/currencyFormatter'

export interface IOrderServicesProps {
  methods?: any
  order?: IOrderDetail
  fields?: IService[]
}

export function OrderServices({
  methods,
  order,
  fields = [],
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
          {fields.map(({ serviceId, quantity, name, type, amount }, index) => (
            <Stack
              key={serviceId}
              flexDirection="row"
              alignItems="center"
              justifyContent={'space-between'}
            >
              <Stack
                flexDirection={'row'}
                gap={3}
                alignItems="center"
                justifyContent={'space-between'}
                flex={1}
              >
                <Stack>
                  <MuiTypography>{name}</MuiTypography>
                  <MuiTypography>[{type}]</MuiTypography>
                </Stack>
                <Box>
                  <MuiRHFNumericFormatInput
                    label={'Số lượng'}
                    name={`services.${index}.quantity`}
                    fullWidth
                    required
                  />
                  {methods.formState.errors?.services &&
                    methods.formState.errors?.services[index].quantity
                      .message && (
                      <FormHelperText error>
                        {
                          methods.formState.errors?.services[index].quantity
                            .message
                        }
                      </FormHelperText>
                    )}
                </Box>
              </Stack>

              <Stack
                flexDirection="row"
                gap={1}
                flex={2}
                justifyContent={'flex-end'}
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
          ))}
          <Stack alignItems={'flex-end'}>
            <Stack flexDirection="row" gap={2}>
              <MuiTypography variant="subtitle2">Cọc:</MuiTypography>
              <MuiTypography variant="body2" color={'primary'} fontWeight={500}>
                {CurrencyFormatter(order?.deposit ?? 0, 2)} VNĐ
              </MuiTypography>
            </Stack>
            <Stack flexDirection="row" gap={2}>
              <MuiTypography variant="subtitle2">Tổng thực tế:</MuiTypography>
              <MuiTypography variant="body2" color={'primary'} fontWeight={500}>
                {CurrencyFormatter(
                  getTotalAmount(services) ?? order?.amount ?? 0,
                  2,
                )}
                VNĐ
              </MuiTypography>
            </Stack>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
