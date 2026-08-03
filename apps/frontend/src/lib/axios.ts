/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import Axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { getGetMeQueryKey } from '@api'
import { queryClient } from '@/lib/queryClient'

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

        // Skip when the failing request IS /api/auth/me itself: that query already
        // transitions to its own error state (retry is disabled on it, see useAuth.ts),
        // so removing it from the cache here while it's still an actively-observed,
        // in-flight query would orphan its observer — TanStack Query rebuilds a fresh,
        // never-fetched Query for the same key, which immediately refetches, which 401s
        // again, which removes again — an unbounded refetch loop that can also land in
        // TanStack's "paused" fetchStatus and hang forever. Other endpoints (cart, orders,
        // ...) still need this so their stale cached data doesn't linger after logout.
        if (originalRequest.url !== '/api/auth/me') {
          queryClient.removeQueries({ queryKey: getGetMeQueryKey() })
        }

        try {
          await axiosAuthInstance.post('/api/auth/logout')
        } catch {
          // Ignore logout failure — the original 401 below is what matters.
        }

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
