import {
  Button,
  Chip,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material'
import { Box } from '@mui/system'
import { getMemberDetail } from 'app/apis/members/members.service'
import { Breadcrumb, Container, SimpleCard } from 'app/components'
import { MEMBER_STATUSES, findMemberStatus } from 'app/constants/memberStatus'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DialogApproveMember from './DialogApproveMember'
import DialogRejectMember from './DialogRejectMember'
import MemberActionHistory from './MemberActionHistory'

export interface Props {}

export default function MemberDetail(props: Props) {
  const params = useParams()
  const navigate = useNavigate()

  const dialogApproveMemberRef = useRef<any>(null)
  const dialogRejectMemberRef = useRef<any>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [member, setMember] = useState<any>()

  const fetchMember = async () => {
    setIsLoading(true)
    await getMemberDetail(params.id)
      .then(res => setMember(res))
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchMember()
  }, [])

  return (
    <Container>
      {isLoading && (
        <Box
          sx={{
            width: '100%',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '1000',
          }}
        >
          <LinearProgress />
        </Box>
      )}

      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý hội viên', path: '/members' },
            { name: 'Chi tiết hội viên' },
          ]}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 2,
        }}
      >
        <Box>
          <Button
            variant="outlined"
            disabled={isLoading}
            onClick={() => {
              navigate(-1)
            }}
            sx={{ mx: 1 }}
          >
            Quay lại
          </Button>
          {member?.status === 0 && (
            <Button
              color="error"
              variant="contained"
              disabled={isLoading}
              onClick={() => {
                dialogRejectMemberRef?.current.handleClickOpen()
              }}
              sx={{ mx: 1 }}
            >
              Hủy
            </Button>
          )}

          {member?.status === 0 && (
            <Button
              color="success"
              variant="contained"
              disabled={isLoading}
              onClick={() => {
                dialogApproveMemberRef?.current.handleClickOpen()
              }}
              sx={{ mx: 1 }}
            >
              Phê duyệt
            </Button>
          )}
        </Box>
        <Button
          variant="text"
          sx={{ color: findMemberStatus(member?.status)?.color ?? 'grey' }}
        >
          {findMemberStatus(member?.status)?.label ?? 'Trạng thái'}
        </Button>
      </Box>

      <DialogApproveMember
        ref={dialogApproveMemberRef}
        idRegistration={member?.id}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={fetchMember}
      />

      <DialogRejectMember
        ref={dialogRejectMemberRef}
        idRegistration={member?.id}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={fetchMember}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <SimpleCard>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell variant="body" colSpan={2}>
                    Thông tin tài khoản
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Tài khoản</TableCell>
                  <TableCell variant="body">
                    {[
                      member?.customer?.fullName,
                      member?.customer?.email,
                      member?.customer?.mobilePhone,
                    ]
                      .filter(Boolean)
                      .join(' - ')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Thời gian đăng ký</TableCell>
                  <TableCell variant="body">
                    {dayjs(member?.latestRegistration?.dateCreated).format(
                      'DD/MM/YYYY HH:mm',
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Loại hình đăng ký</TableCell>
                  <TableCell variant="body">
                    {member?.latestRegistration?.type === 1
                      ? 'Đăng ký'
                      : 'Gia hạn'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Số mùa đã tham gia</TableCell>
                  <TableCell variant="body">{member?.joinedYears}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </SimpleCard>
        </Grid>
        <Grid item xs={6}>
          <SimpleCard>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell variant="body" colSpan={2}>
                    Thông tin đăng ký
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Họ và tên</TableCell>
                  <TableCell variant="body">{member?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Ngày sinh</TableCell>
                  <TableCell variant="body">
                    {dayjs(member?.birthday).format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Số điện thoại</TableCell>
                  <TableCell variant="body">{member?.mobilePhone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Số Zalo</TableCell>
                  <TableCell variant="body">{member?.zalo}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Chiều cao</TableCell>
                  <TableCell variant="body">{member?.height + ' cm'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Cân nặng</TableCell>
                  <TableCell variant="body">{member?.weight + ' kg'}</TableCell>
                </TableRow>
                {member?.latestRegistration?.status ===
                  MEMBER_STATUSES.APPROVED.id && (
                  <TableRow>
                    <TableCell variant="head">Số mùa đăng ký</TableCell>
                    <TableCell variant="body">
                      {member?.latestRegistration?.years
                        .split(',')
                        .map((y: any, index: any) => {
                          return <Chip label={y} key={index} sx={{ mx: 1 }} />
                        })}
                    </TableCell>
                  </TableRow>
                )}
                {member?.latestRegistration?.status ===
                  MEMBER_STATUSES.APPROVED.id && (
                  <TableRow>
                    <TableCell variant="head">
                      Mức phí hội viên (tổng tiền)
                    </TableCell>
                    <TableCell variant="body">
                      {member?.latestRegistration?.amount}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SimpleCard>
        </Grid>
      </Grid>
      <MemberActionHistory idMember={member?.id} />
    </Container>
  )
}
