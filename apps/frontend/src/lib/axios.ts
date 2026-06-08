import Axios, { type AxiosRequestConfig } from 'axios'

export const axiosInstance = Axios.create({
  baseURL: 'http://localhost:5244',
  withCredentials: true, // ← Tương đương credentials: "include"
})

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
  axiosInstance<T>(config).then((res) => res.data)
