import { http } from 'app/helpers/http-config'
import { IPolicyResponse } from 'app/models/policy'

export const fetchPolicies = async (params: any): Promise<IPolicyResponse> => {
  const { data } = await http.get<IPolicyResponse>('/api/policies', {
    params,
  })
  return data
}
