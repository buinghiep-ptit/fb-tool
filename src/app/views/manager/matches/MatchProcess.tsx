import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export default function MatchProcess(props: any) {
  const { matchProcess } = props
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState(0)

  const schema = yup.object({
    type: yup.number(),
    time: yup
      .string()
      .required('Giá trị bắt buộc')
      .trim()
      .max(255, 'Tối đa 255 ký tự'),
    idTeam: yup.number().when('type', (type, schema) => {
      // vào
      if ([7].includes(type)) return schema.required('Giá trị bắt buộc')
      else return schema
    }),
    player: yup
      .string()
      .trim()
      .max(255, 'Tối đa 255 ký tự')
      .when('type', (type, schema) => {
        // thẻ đỏ, vàng, vào
        if ([3, 4, 7].includes(type)) return schema.required('Giá trị bắt buộc')
        else return schema
      }),
    description: yup.string(),
    team1Goal: yup
      .number()
      .min(0, 'Số dương')
      .integer('Số nguyên')
      .when('type', (type, schema) => {
        // kết thúc hiệp 1/ kết thúc trận đấu
        if ([5, 11].includes(type)) return schema.required('Giá trị bắt buộc')
        else return schema
      })
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr)),
    team2Goal: yup
      .number()
      .min(0, 'Số dương')
      .integer('Số nguyên')
      .when('type', (type, schema) => {
        // bắt buộc nếu cập nhật tỷ số hiệp 1/ kết thúc trận đấu
        if ([5, 11].includes(type)) return schema.required('Giá trị bắt buộc')
        else return schema
      })
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr)),
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 1,
      time: '',
      idTeam: null,
      player: '',
      description: '',
    },
  })

  const initDefaultValues = (matchProcess: any) => {
    const defaultValues: any = {}
    defaultValues.type = matchProcess.type
    defaultValues.time = matchProcess.time
    defaultValues.idTeam = matchProcess.idTeam
    defaultValues.player = matchProcess.player
    defaultValues.description = matchProcess.description
    methods.reset({ ...defaultValues })
  }

  React.useEffect(() => {
    // TODO pending api
    if (matchProcess) {
      initDefaultValues(matchProcess)
      setMode(1)
    }
  }, [])

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    const payload: any = {}
    // TODO consume api
    setIsLoading(false)
  }

  return <Box>noi dung</Box>
}
