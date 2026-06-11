/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import Axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'

export const axiosInstance = Axios.create({
  baseURL: 'http://localhost:5244',
  withCredentials: true, // ← Tương đương credentials: "include"
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (error: any) => void
}> = []

const processQueue = (error?: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
  isRefreshing = false
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => axiosInstance(originalRequest))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axiosInstance.post('/api/auth/refresh-token', null, {
          _retry: true, // Đánh dấu true ngay từ đầu để interceptor bỏ qua nếu lỗi 401
        } as any)
        processQueue()
        return axiosInstance(originalRequest)
      } catch (err) {
        processQueue(err)
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  },
)

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
  axiosInstance<T>(config).then((res) => res.data)
