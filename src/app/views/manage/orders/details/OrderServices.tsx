import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
} from '@mui/material'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { IOrderDetail, IService } from 'app/models/order'
import { CurrencyFormatter } from 'app/utils/formatters/currencyFormatter'
import * as React from 'react'

export interface IOrderServicesProps {
  order?: IOrderDetail
  fields?: IService[]
}

export function OrderServices({ order, fields = [] }: IOrderServicesProps) {
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
                <FormInputText
                  label={'Số lượng'}
                  type="number"
                  name={`services.${index}.quantity`}
                  defaultValue={(quantity ?? 0).toString()}
                />
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
                {CurrencyFormatter(order?.amount ?? 0, 2)} VNĐ
              </MuiTypography>
            </Stack>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
