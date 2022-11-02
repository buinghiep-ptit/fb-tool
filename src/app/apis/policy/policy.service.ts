import { http } from 'app/helpers/http-config'
import { IPolicyOverall, IPolicyResponse } from 'app/models/policy'

export const fetchPolicies = async (params: any): Promise<IPolicyResponse> => {
  const { data } = await http.get<IPolicyResponse>('/api/policies', {
    params,
  })
  return data
}

export const getPolicyDetail = async (
  policyId: number,
): Promise<IPolicyOverall> => {
  const { data } = await http.get<IPolicyOverall>(`/api/policies/${policyId}`)
  return data
}

export const createPolicy = async (payload: any): Promise<IPolicyOverall> => {
  const { data } = await http.post<IPolicyOverall>('/api/policies', payload)
  return data
}

export const updatePolicy = async (
  policyId: number,
  payload: any,
): Promise<IPolicyOverall> => {
  const { data } = await http.put<IPolicyOverall>(
    `/api/policies/${policyId}`,
    payload,
  )
  return data
}
