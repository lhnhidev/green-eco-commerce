/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import Axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_ROOT ?? 'http://localhost:5244'

const baseConfig = {
  baseURL: API_BASE_URL,
  withCredentials: true, // ← Tương đương credentials: "include"
  paramsSerializer: {
    indexes: null, // Removes the [] brackets
  },
}

export const axiosInstance = Axios.create(baseConfig)

export const axiosAuthInstance = Axios.create(baseConfig)

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
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err)) // Catch errors from queued requests
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axiosAuthInstance.post('/api/auth/refresh-token')

        processQueue()
        return axiosInstance(originalRequest)
      } catch (err) {
        processQueue(err)

        await axiosAuthInstance.post('/api/auth/logout')

        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
  axiosInstance<T>(config).then((res) => res.data)
