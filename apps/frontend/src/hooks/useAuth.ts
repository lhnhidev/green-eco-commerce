import { useGetApiAuthMe } from '../api'

export const useAuth = () => {
  const { data: user, isPending } = useGetApiAuthMe({
    query: {
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    },
  })

  return { user, isPending }
}
