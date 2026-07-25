import type { UserProfileDto } from '@api/schemas'

export type AuthState = {
  active: 'login' | 'register'
  user: UserProfileDto | null
}
