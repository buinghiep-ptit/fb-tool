import { getProfile, loginUser } from 'app/apis/auth/auth.service'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { http } from 'app/helpers/http-config'
import { isValidToken } from 'app/utils/validToken'
import { createContext, useEffect, useReducer } from 'react'

const initialState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
}

const setSession = accessToken => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken)
  } else {
    localStorage.removeItem('accessToken')
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      const { isAuthenticated, user } = action.payload

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user,
      }
    }
    case 'LOGIN': {
      const { user } = action.payload

      return {
        ...state,
        isAuthenticated: true,
        user,
      }
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      }
    }
    case 'REGISTER': {
      const { user } = action.payload

      return {
        ...state,
        isAuthenticated: true,
        user,
      }
    }
    default: {
      return { ...state }
    }
  }
}

const AuthContext = createContext({
  ...initialState,
  method: 'JWT',
  login: () => Promise.resolve(),
  updateUser: () => Promise.resolve(),
  logout: () => {},
  register: () => Promise.resolve(),
})

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const login = async payload => {
    const response = await loginUser(payload)
    const { accessToken } = response
    setSession(accessToken)
    let user = null
    if (accessToken) {
      user = await getProfile()
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      })
    }
  }

  const updateUser = async () => {
    const user = await getProfile()
    if (user.status === -1) {
      logout()
    } else
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      })
  }

  const register = async (email, username, password) => {
    const response = await http.post('/api/auth/register', {
      email,
      username,
      password,
    })

    const { accessToken, user } = response.data

    setSession(accessToken)

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    })
  }

  const logout = () => {
    setSession(null)
    dispatch({ type: 'LOGOUT' })
  }

  useEffect(() => {
    ;(async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken')

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken)
          const response = await getProfile()
          const user = response

          dispatch({
            type: 'INIT',
            payload: {
              isAuthenticated: true,
              user,
            },
          })
        } else {
          dispatch({
            type: 'INIT',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          })
        }
      } catch (err) {
        dispatch({
          type: 'INIT',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        })
      }
    })()
  }, [])

  if (!state.isInitialised) {
    return <MuiLoading />
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        updateUser,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
