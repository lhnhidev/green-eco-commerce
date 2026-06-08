import type { UserProfileResponse } from '../api/schemas'

export type AuthState = {
  active: 'login' | 'register'
  user: UserProfileResponse | null
}
