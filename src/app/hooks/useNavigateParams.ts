import { createSearchParams, useNavigate } from 'react-router-dom'

export const useNavigateParams = () => {
  const navigate = useNavigate()
  return (pathname: string, params: object) =>
    navigate({
      pathname: `${pathname}`,
      search: `?${createSearchParams(params as any)}`,
    })
}
