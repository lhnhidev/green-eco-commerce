import { useGetMe } from '@api'

export const useAuth = () => {
  const { data: user, isPending } = useGetMe({
    query: {
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
      retryOnMount: false,
      // A 401 here is a definitive "not logged in" answer, and axios.ts already owns
      // refresh-and-retry at the HTTP layer. Letting react-query retry on top of that
      // schedules a redundant retry that can get stuck in TanStack Query's "paused"
      // fetchStatus (waiting on a browser online event that may never arrive),
      // permanently blocking isPending and hanging the auth guard on "Verifying access...".
      retry: false,
    },
  })

  return { user, isPending }
}
