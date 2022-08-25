import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import queryString from 'query-string'
// const camelize = require('camelize')

const isServer = typeof window === 'undefined'

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
}

let isRefreshing = false
let failedQueue = [] as any

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

class Http {
  private instance: AxiosInstance | null = null

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp()
  }

  initHttp() {
    const http = axios.create({
      baseURL: isServer ? `${process.env.NEXT_PUBLIC_API_URL}` : '',
      headers: headers as any,
      paramsSerializer: params => queryString.stringify(params),
      timeout: 15000,
      withCredentials: true,
    })
    const currentExecutingRequests: any = {}

    http.interceptors.request.use(
      async (req: AxiosRequestConfig) => {
        // const token = await AsyncStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        // return config;
        const originalRequest = req

        // const session = await getSession()
        const accessToken = window.localStorage.getItem('accessToken')

        if (accessToken) {
          ;(req.headers as any).Authorization = `Bearer ${accessToken}`
        }
        // const language = await AsyncStorage.getItem('currentLanguage')
        // req.headers.lang = language ?? 'vi'

        if (currentExecutingRequests[req.url as keyof object]) {
          const source = currentExecutingRequests[req.url ?? '']
          delete currentExecutingRequests[req.url ?? '']
          source.cancel()
        }

        const CancelToken = axios.CancelToken
        const source = CancelToken.source()
        originalRequest.cancelToken = source.token
        currentExecutingRequests[req.url ?? ''] = source

        return originalRequest
      },
      error => Promise.reject(error),
    )

    http.interceptors.response.use(
      response => {
        if (currentExecutingRequests[response.request.responseURL]) {
          // here you clean the request
          delete currentExecutingRequests[response.request.responseURL]
        }

        return response
      },
      async err => {
        const originalRequest = err.config

        if (axios.isCancel(err)) {
          // here you check if this is a cancelled request to drop it silently (without error)
          return new Promise(() => {})
        }

        if (currentExecutingRequests[originalRequest.url]) {
          // here you clean the request
          delete currentExecutingRequests[originalRequest.url]
        }

        if (
          err.response?.status &&
          err.response.status === 401 &&
          !originalRequest._retry
        ) {
          if (isRefreshing) {
            return new Promise(function (resolve, reject) {
              failedQueue.push({ resolve, reject })
            })
              .then(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                return http(originalRequest)
              })
              .catch((error: any) => {
                throw error
              })
          }

          originalRequest._retry = true
          isRefreshing = true

          const clientRefreshToken = 'clientRefreshToken'
          const deviceId = 'deviceId'

          return new Promise(function (resolve, reject) {
            axios
              .post(
                `${process.env.REACT_PUBLIC_API_URL}/auth/api/authenticate/refresh`,
                {
                  refresh_token: clientRefreshToken,
                  device_id: deviceId,
                },
              )
              .then(res => {
                if (res.data.access_token) {
                  http.defaults.headers.common.Authorization = `Bearer ${res.data.access_token}`
                  originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`
                  processQueue(null, res.data.access_token)
                  resolve(http(originalRequest))
                }
              })
              .catch((error: any) => {
                processQueue(error, null)
                reject(error)
              })
              .then(() => {
                isRefreshing = false
              })
          })
        }

        throw err
      },
    )

    this.instance = http
    return http
  }

  request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.request(config)
  }

  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.get<T, R>(url, config)
  }

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.post<T, R>(url, data, config)
  }

  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.put<T, R>(url, data, config)
  }

  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.delete<T, R>(url, config)
  }

  // Handle global app errors
  private handleError(error: { status: number }) {
    const { status } = error

    switch (status) {
      case StatusCode.InternalServerError: {
        // Handle InternalServerError
        break
      }
      case StatusCode.Forbidden: {
        // Handle Forbidden
        break
      }
      case StatusCode.Unauthorized: {
        // Handle Unauthorized
        break
      }
      case StatusCode.TooManyRequests: {
        // Handle TooManyRequests
        break
      }
    }

    return Promise.reject(error)
  }
}

export const http = new Http()
