import { Chip, Grid, Typography } from '@mui/material'
import { getMember } from 'app/apis/customer/customer.service'
import { SimpleCard } from 'app/components'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
export interface Props {}

export default function PurchaseHistory(props: Props) {
  const [member, setMenber] = useState<any>(null)
  const params = useParams()
  const fetchMember = async () => {
    const res = await getMember(params.idCustomer)
    setMenber(res)
  }

  useEffect(() => {
    fetchMember()
  }, [])

  return (
    <>
      {member ? (
        <SimpleCard>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Typography style={{ margin: '20px' }}>
                Họ và tên: {member?.name}
              </Typography>
              <Typography style={{ margin: '20px' }}>
                Số điện thoại: {member?.mobilePhone}
              </Typography>
              <Typography style={{ margin: '20px' }}>
                Chiều cao: {member?.height} cm
              </Typography>
              <Typography style={{ margin: '20px' }}>
                Thời gian đăng ký hội viên:{' '}
                {moment(member?.dateCreated).format('DD-MM-YYYY') || ''}
              </Typography>
              <Typography style={{ margin: '20px' }}>
                Mùa giải tham gia: {member?.joinedYears}
              </Typography>
              <Typography style={{ margin: '20px' }}>
                Trang thái hoạt động của hội viên:{'  '}
                {member.status === 1 ? (
                  <Chip label="Hoạt động" color="success" />
                ) : (
                  <Chip label="Không hoạt động" color="warning" />
                )}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography style={{ margin: '20px' }}>
                Ngày sinh: {moment(member?.birthday).format('DD-MM-YYYY') || ''}
              </Typography>
              <Typography style={{ margin: '20px' }}>
                Số zalo( nếu có ): {member?.zalo}
              </Typography>
              <Typography style={{ margin: '20px' }}>
                Cân nặng: {member?.weight} kg
              </Typography>
              <Typography style={{ margin: '20px' }}>
                Xếp hạng cổ động viên: {member.joinedYearNum >= 10 && 'A'}
                {5 <= member.joinedYearNum && member.joinedYearNum < 10 && 'B'}
                {3 <= member.joinedYearNum && member.joinedYearNum < 5 && 'C'}
                {1 <= member.joinedYearNum && member.joinedYearNum < 3 && 'D'}
              </Typography>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </SimpleCard>
      ) : (
        'Tài khoản chưa là hội viên'
      )}
    </>
  )
}
