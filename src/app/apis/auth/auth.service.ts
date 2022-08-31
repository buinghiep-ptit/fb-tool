import { http } from 'app/helpers/http-config'
import { ILoginPayload, IUserProfile } from 'app/models'

export const loginUser = async (payload: ILoginPayload): Promise<any> => {
  const { data } = await http.post<any>(
    '/auth/api/customer/authenticate',
    payload,
  )
  return data
}
export const getProfile = async (): Promise<IUserProfile> => {
  const { data } = await http.get<IUserProfile>('/auth/api/customer/info')
  return data
}
