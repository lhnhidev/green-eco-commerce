import type { RegisterCommand } from '../api/schemas'

export type LocalRegisterFormValues = RegisterCommand & {
  repeatPassword: string
}
