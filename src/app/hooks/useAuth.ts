import { useContext } from 'react'
import AuthContext from 'app/contexts/JWTAuthContext'
import { useMutation } from '@tanstack/react-query'
import { changePassword } from 'app/apis/auth/auth.service'

const useAuth = () => useContext(AuthContext)

export default useAuth

export const useChangePassword = (onSuccess?: any, onError?: any) => {
  return useMutation(
    (payload: { currentPassword?: string; newPassword?: string }) =>
      changePassword(payload),
    {
      onSuccess,
    },
  )
}
