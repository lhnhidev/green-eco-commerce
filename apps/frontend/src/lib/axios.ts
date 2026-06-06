import Axios from 'axios'

export const axiosInstance = Axios.create({
  baseURL: 'http://localhost:5244',
  withCredentials: true, // ← Tương đương credentials: "include"
})

export const customInstance = <T>(config: Parameters<typeof axiosInstance>[0]) =>
  axiosInstance<T>(config).then((res) => res.data)
