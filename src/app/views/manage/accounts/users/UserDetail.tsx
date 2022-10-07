import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useUpdateUserData } from 'app/hooks/queries/useUsersData'
import React from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import useFormUserModal from './useFormUserModal'

type Props = {
  title: string
}

type FormData = {
  email?: string
  role?: number
  status?: number
}

export default function UserDetail({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const data = location.state?.data ?? {}
  const [getContent, methods] = useFormUserModal(data)

  const onSuccess = (data: any) => {
    toastSuccess({ message: 'Cập nhật tài khoản thành công' })
    navigate(-1)
  }
  const { mutate: editUser, isLoading } = useUpdateUserData(onSuccess)

  const onSubmitHandler: SubmitHandler<FormData> = (values: FormData) => {
    editUser({
      ...data,
      ...values,
    })
  }

  const handleClose = () => {
    navigate(-1)
  }

  return (
    <React.Fragment>
      <MuiStyledModal
        title={title}
        open={isModal}
        isLoading={isLoading}
        submitText="Lưu thay đổi"
        onCloseModal={handleClose}
        onSubmit={methods.handleSubmit(onSubmitHandler)}
      >
        {getContent(isLoading)}
      </MuiStyledModal>
    </React.Fragment>
  )
}
