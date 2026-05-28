import type { LoginCommand } from '../api/schemas'

export type LocalLoginFormValues = LoginCommand & {
  remember: boolean
}
