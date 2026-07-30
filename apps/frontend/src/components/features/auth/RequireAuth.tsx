import Loading from '@components/ui/status/Loading'
import { useAuth } from '@hooks/useAuth'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user, isPending } = useAuth()
  const location = useLocation()

  if (isPending) {
    return <Loading text="Verifying access..." />
  }

  if (!user) {
    const returnTo = `${location.pathname}${location.search}`
    return <Navigate to={`/auth?returnTo=${encodeURIComponent(returnTo)}`} replace />
  }

  return children
}
