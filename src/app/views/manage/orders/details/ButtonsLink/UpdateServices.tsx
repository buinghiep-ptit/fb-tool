import { yupResolver } from '@hookform/resolvers/yup'
import { FormHelperText, Icon, IconButton, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
import MuiRHFNumericFormatInput from 'app/components/common/MuiRHFWithNumericFormat'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useOrderDetailData,
  useRecalculatePriceOrder,
  useUpdateServicesOrder,
} from 'app/hooks/queries/useOrdersData'
import useDebounce from 'app/hooks/useDebounce.'
import { IService } from 'app/models/order'
import { BoxImage, TooltipText } from 'app/utils/columns/columnsEvents'
import { convertDateToUTC, getDifferenceInDays } from 'app/utils/common'
import { CurrencyFormatter } from 'app/utils/formatters/currencyFormatter'
import { messages } from 'app/utils/messages'
import dayjs from 'dayjs'
import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { convertToNumber } from '../OrderServices'
import { DiagLogConfirm } from './DialogConfirm'

type Props = {
  title: string
}

type SchemaType = {
  dateStart?: string
  dateEnd?: string
  services?: IService[]
}

export default function UpdateServices({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const { orderId } = useParams()
  const { data: order } = useOrderDetailData(Number(orderId ?? 0))

  const [services, setServices] = useState<IService[]>([])
  const [lengthServices, setLengthServices] = useState<number[]>([])

  const [openDialog, setOpenDialog] = useState(false)

  const [defaultValues] = useState<SchemaType>({})

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    navigate(-1)
  }

  const validationSchema = Yup.object().shape(
    {
      dateStart: Yup.date()
        .when('dateEnd', (dateEnd, yup) => {
          if (dateEnd && dateEnd != 'Invalid Date') {
            const dayAfter = new Date(dateEnd.getTime() - 86400000)
            const dayAfterMin = new Date(dateEnd.getTime() - 86400000 * 31)

            return yup
              .min(dayAfterMin, 'Tối đa 31 ngày so với ngày kết thúc')
              .max(dayAfter, 'Ngày đắt đầu không lớn hơn ngày kết thúc')
          }
          return yup
        })
        .typeError('Sai định dạng.')
        .nullable()
        .required(messages.MSG1),
      dateEnd: Yup.date()
        .when('dateStart', (dateStart, yup) => {
          if (dateStart && dateStart != 'Invalid Date') {
            const dayBefore = new Date(dateStart.getTime() + 86400000)
            const dayBeforeMax = new Date(dateStart.getTime() + 86400000 * 31)
            return yup
              .min(dayBefore, 'Ngày kết thúc phải lớn hơn ngày bắt đầu')
              .max(dayBeforeMax, 'Tối đa 31 ngày so với ngày bắt đầu')
          }
          return yup
        })
        .typeError('Sai định dạng.')
        .nullable()
        .required(messages.MSG1),
      services: Yup.lazy(() =>
        Yup.array().of(
          Yup.object().shape({
            quantity: Yup.number()
              .typeError('Giá trị phải là một chữ số')
              // .positive() // Sso nguyen duong
              .max(999999999, 'Tối đa 9 chữ số'),
            // .nullable(), // neu k can nhap so 0
            // .required(messages.MSG1),
          }),
        ),
      ),
    },
    [['dateStart', 'dateEnd']], // throw error cyclic dependence if have not this params
  )

  const methods = useForm<SchemaType>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { fields, append, remove } = useFieldArray<SchemaType>({
    name: 'services',
    control: methods.control,
  })

  const { mutate: recalculate, isLoading: recalculateLoading } =
    useRecalculatePriceOrder((data: any) => {
      const lengthList: number[] = []
      let serviceList: IService[] = []
      Object.keys(data).forEach(function (item) {
        serviceList = serviceList.concat(data[item])
        lengthList.push(data[item].length)
      })

      if (servicesW && servicesW.length) {
        serviceList.map((item: IService, index: number) =>
          Object.assign(item, {
            quantity: servicesW[index]
              ? servicesW[index].quantity
              : item.quantity,
          }),
        )
      }

      let sum = 0
      const array: number[] = lengthList
        .map(elem => (sum = sum + elem))
        .map((elem, index) => elem - lengthList[index])

      setLengthServices(array)
      setServices(serviceList)
    })

  const dateStart = methods.watch('dateStart')
  const dateEnd = methods.watch('dateEnd')
  const servicesW = methods.watch('services')

  useEffect(() => {
    if (!dateStart || !dateEnd) return

    if (moment(new Date(dateStart)).unix() < moment(new Date(dateEnd)).unix()) {
      methods.clearErrors('dateStart')
      methods.clearErrors('dateEnd')
    }
  }, [dateStart, dateEnd])

  const debouncedDateStart = useDebounce(dateStart ?? '', 100)
  const debouncedDateEnd = useDebounce(dateEnd ?? '', 100)

  useEffect(() => {
    if (!order || !debouncedDateStart || !debouncedDateEnd) return

    if (
      moment(new Date(debouncedDateStart)).unix() <
        moment(new Date(debouncedDateEnd)).unix() &&
      Math.abs(
        moment(new Date(debouncedDateEnd)).unix() -
          moment(new Date(debouncedDateStart)).unix(),
      ) <=
        31 * 86400
    ) {
      const d1 = dayjs(new Date(debouncedDateStart ?? '')).format('DD/MM/YYYY')
      const d2 = dayjs(new Date(debouncedDateEnd ?? '')).format('DD/MM/YYYY')
      recalculate({
        orderId: Number(orderId ?? 0),
        payload: {
          dateStart: convertDateToUTC(d1),
          dateEnd: convertDateToUTC(d2),
        },
      })
    }
  }, [debouncedDateStart, debouncedDateEnd, order])

  useEffect(() => {
    if (order) {
      defaultValues.dateStart = order.dateStart
      defaultValues.dateEnd = order.dateEnd

      methods.reset({ ...defaultValues })
    }
  }, [order])

  useEffect(() => {
    if (services && !!services.length) {
      methods.setValue('services', services)
    }
  }, [services])

  useEffect(() => {
    const currentProp = (services && services.length) || 0
    const previousProp = fields.length
    if (currentProp > previousProp) {
      for (let i = previousProp; i < currentProp; i++) {
        append({ quantity: 0 })
      }
    } else {
      for (let i = previousProp; i > currentProp; i--) {
        remove(i - 1)
      }
    }
  }, [services, fields])

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

  const getTotalQuantity = (
    services?: {
      quantity?: number
      amount?: number
    }[],
  ) => {
    const total = services?.reduce(
      (acc, service) => acc + Number(service?.quantity ?? 0),
      0,
    )

    return total
  }

  // console.log('date:', dayjs(dateStart ?? new Date()).toISOString(), dateStart)

  const { mutate: updateServices, isLoading: isLoading } =
    useUpdateServicesOrder(() => onSuccess(null, 'Cập nhật  thành công'))

  const convertTypeToString = (type?: number) => {
    switch (type) {
      case 1:
        return 'Gói trải nghiệm'
      case 2:
        return 'Lưu trú'
      case 3:
        return 'Khác'
      default:
        return ''
    }
  }

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    const d2 = dayjs(new Date(values.dateEnd ?? '')).format('DD/MM/YYYY')
    const d1 = dayjs(new Date(values.dateStart ?? '')).format('DD/MM/YYYY')

    values = {
      ...values,
      dateStart: convertDateToUTC(d1),
      dateEnd: convertDateToUTC(d2),
    }

    const payload: any = {
      dateStart: values.dateStart,
      dateEnd: values.dateEnd,
      services: values?.services?.filter(service => !!service.quantity),
    }
    updateServices({ payload, orderId: Number(orderId ?? 0) })
  }

  const handleClose = () => {
    navigate(-1)
  }

  const getContent = () => {
    return (
      <Box px={3}>
        <FormProvider {...methods}>
          <Stack
            p={1}
            flexDirection={'row'}
            justifyContent="space-between"
            alignItems={'center'}
            sx={{
              position: 'sticky',
              top: -16,
              zIndex: 9999,
              backgroundColor: '#ffffff',
              borderRadius: 1,
              boxShadow:
                '0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack flexDirection={'row'} gap={2}>
                <MuiRHFDatePicker name="dateStart" label="Từ" required={true} />
                <MuiRHFDatePicker name="dateEnd" label="Đến" required={true} />
                <MuiTypography
                  variant="subtitle2"
                  color={'primary'}
                  fontWeight={500}
                  minWidth={80}
                  mt={2.5}
                >
                  (
                  {getDifferenceInDays(
                    moment(new Date(debouncedDateStart ?? new Date())).format(
                      'MM/DD/YYYY',
                    ),
                    moment(new Date(debouncedDateEnd ?? new Date())).format(
                      'MM/DD/YYYY',
                    ),
                  )}{' '}
                  đêm)
                </MuiTypography>
              </Stack>
            </LocalizationProvider>

            <Stack flexDirection="row" gap={1}>
              <MuiTypography variant="subtitle2">Tổng thực tế:</MuiTypography>
              <MuiTypography variant="body2" color={'primary'} fontWeight={500}>
                {CurrencyFormatter(
                  getTotalAmount(servicesW) ?? order?.amount ?? 0,
                  2,
                )}{' '}
                VNĐ
              </MuiTypography>
            </Stack>
          </Stack>

          <Stack gap={2} mt={1.5}>
            {fields.map(
              (
                { idService, quantity, capacity, name, type, amount, imgUrl },
                index,
              ) => (
                <Stack key={index ?? idService}>
                  {lengthServices.includes(index) && (
                    <MuiTypography variant="subtitle1" fontWeight={500} m={1}>
                      {convertTypeToString(type)}
                    </MuiTypography>
                  )}

                  <Stack
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
                            Áp dụng:
                          </MuiTypography>

                          <MuiTypography variant="body2">
                            <span style={{ fontWeight: 500 }}>{capacity}</span>{' '}
                            {type === 3 ? 'sản phẩm' : 'người'}
                          </MuiTypography>
                        </Stack>
                      </Stack>
                      <Box minWidth={120}>
                        <Stack direction={'row'} alignItems="center" gap={1}>
                          <MuiRHFNumericFormatInput
                            label={'Số lượng'}
                            name={`services.${index}.quantity`}
                            fullWidth
                            required
                            isAllowZeroFirst
                          />
                          <Stack gap={1}>
                            <IconButton
                              disabled={
                                convertToNumber(
                                  methods.watch(`services.${index}.quantity`) ??
                                    0,
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
                                !methods.watch(`services.${index}.quantity`) ||
                                methods.watch(`services.${index}.quantity`) == 0
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
                                methods.formState.errors.services[index]
                                  ?.quantity?.message
                              }
                            </FormHelperText>
                          )}
                      </Box>
                    </Stack>

                    <Stack
                      flexDirection="row"
                      gap={1}
                      justifyContent={'flex-end'}
                      minWidth={180}
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
                </Stack>
              ),
            )}
          </Stack>
        </FormProvider>
      </Box>
    )
  }

  return (
    <React.Fragment>
      <MuiStyledModal
        title={title}
        open={isModal}
        onCloseModal={handleClose}
        isLoading={recalculateLoading || isLoading}
        maxWidth="md"
        // onSubmit={methods.handleSubmit(onSubmitHandler)}
        onSubmit={() => setOpenDialog(true)}
        submitText="Lưu"
        cancelText="Quay lại"
        disabled={
          getTotalQuantity(servicesW) == 0 ||
          !_.isEmpty(methods.formState.errors)
        }
      >
        {getContent()}
      </MuiStyledModal>

      <DiagLogConfirm
        title={'Xác nhận'}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        isLoading={isLoading}
        submitText="Có"
        cancelText="Không"
      >
        <Stack py={5} justifyContent={'center'} alignItems="center">
          <MuiTypography variant="subtitle1">
            Bạn có chắc muốn cập nhật thông tin đơn hàng?
          </MuiTypography>
        </Stack>
      </DiagLogConfirm>
    </React.Fragment>
  )
}