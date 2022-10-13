import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useUpdateUserData } from 'app/hooks/queries/useUsersData'
import useAuth from 'app/hooks/useAuth'
import React, { useEffect, useRef } from 'react'
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
  const { user, updateUser } = useAuth() as any
  const navigate = useNavigate()

  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const data = location.state?.data ?? {}

  const [getContent, methods] = useFormUserModal(data)

  const unmounted = useRef(false)
  useEffect(() => {
    return () => {
      unmounted.current = true
    }
  }, [])

  const onSuccess = async (u: any) => {
    toastSuccess({ message: 'Cập nhật tài khoản thành công' })
    navigate(-1)
    if (user && user.id && u && u.id && user.id === u.id) {
      await updateUser()
    }
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
        submitText="Lưu"
        cancelText="Huỷ"
        onCloseModal={handleClose}
        onSubmit={methods.handleSubmit(onSubmitHandler)}
      >
        {getContent(isLoading)}
      </MuiStyledModal>
    </React.Fragment>
  )
}
