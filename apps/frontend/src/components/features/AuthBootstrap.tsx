import { useEffect } from 'react'
import { useGetApiAuthMe } from '../../api'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { clearAuthUser, setAuthUser } from './auth/auth.slice'

export function AuthBootstrap() {
  const dispatch = useAppDispatch()

  const { data, isError } = useGetApiAuthMe({
    query: {
      retry: false,
    },
  })

  useEffect(() => {
    if (data) {
      dispatch(setAuthUser(data))
    }
  }, [data, dispatch])

  useEffect(() => {
    if (isError) {
      dispatch(clearAuthUser())
    }
  }, [isError, dispatch])

  return null
}
