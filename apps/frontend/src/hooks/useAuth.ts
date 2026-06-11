// import { useQueryClient } from '@tanstack/react-query'
// import { useEffect, useState } from 'react'
// import { getGetApiAuthMeQueryKey, useGetApiAuthMe } from '../api'
// import type { UserProfileResponse } from '../api/schemas'

import { useGetApiAuthMe } from '../api'

export const useAuth = () => {
  const { data: user, isPending } = useGetApiAuthMe({
    query: {
      enabled: false, // Không tự động fetch (AuthBootstrap đã fetch rồi)
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    },
  })

  return { user, isPending }
}
