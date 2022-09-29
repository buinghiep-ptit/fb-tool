import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useCreateUserData } from 'app/hooks/queries/useUsersData'
import { SubmitHandler } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import useFormUserModal from './useFormUserModal'

type Props = {
  title: string
}

export default function CreateUser({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const [getContent, methods] = useFormUserModal()

  const onSuccess = (data: any) => {
    toastSuccess({ message: 'Thêm mới tài khoản thành công' })
    navigate(-1)
  }
  const { mutate: createUser } = useCreateUserData(onSuccess)

  const onSubmitHandler: SubmitHandler<any> = (values: any) => {
    createUser({
      ...values,
    })
  }

  const handleClose = () => {
    navigate(-1)
  }

  return (
    <MuiStyledModal
      title={title}
      open={isModal}
      onCloseModal={handleClose}
      onSubmit={methods.handleSubmit(onSubmitHandler)}
    >
      {getContent()}
    </MuiStyledModal>
  )
}
