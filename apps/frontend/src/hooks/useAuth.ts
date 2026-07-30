import { useGetMe } from '@api'

export const useAuth = () => {
  const { data: user, isPending } = useGetMe({
    query: {
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
      retryOnMount: false,
    },
  })

  return { user, isPending }
}
