import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createUser,
  fetchUsers,
  updateUser,
} from 'app/apis/accounts/user.service'
import { IUser, IUserResponse } from 'app/models/account'

export function extractFromObject<T, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  return keys.reduce((newObj, curr) => {
    if (!!obj[curr]) newObj[curr] = obj[curr]

    return newObj
  }, {} as Pick<T, K>)
}

export const useUsersData = (filters: any, onSuccess?: any, onError?: any) => {
  return useQuery<IUserResponse, Error>(
    ['users', filters],
    () => fetchUsers(filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!filters,
    },
  )
}

export const useUpdateUserData = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  const cache = queryClient.getQueryCache()
  const queryKey =
    cache.findAll(['users']).length &&
    cache.findAll(['users'])[cache.findAll(['users']).length - 1].queryKey

  return useMutation(
    (user: IUser) =>
      updateUser(
        user.userId as number,
        extractFromObject(user, ['email', 'role', 'status']),
      ),
    {
      // When mutate is called:
      onMutate: async newUser => {
        await queryClient.cancelQueries(queryKey as QueryKey)
        const previousUserData = queryClient.getQueryData(queryKey as QueryKey)
        queryClient.setQueryData(
          queryKey as QueryKey,
          (oldQueryUsersData: any) => {
            const index = oldQueryUsersData.content.findIndex(
              (item: IUser) => item.userId === newUser.userId,
            )
            oldQueryUsersData.content[index] = newUser

            return {
              ...oldQueryUsersData,
              content: [...(oldQueryUsersData as any)?.content],
            }
          },
        )

        return { previousUserData }
      },
      onError: (_err, _newTodo, context) => {
        queryClient.setQueryData(
          queryKey as QueryKey,
          context?.previousUserData,
        )
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey as QueryKey)
      },
      onSuccess,
    },
  )
}

export const useCreateUserData = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (user: IUser) =>
      createUser(extractFromObject(user, ['email', 'role', 'status'])),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['users'])
      },
      onSuccess,
    },
  )
}
