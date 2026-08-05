import type { RegisterPayload } from '@api/schemas'

export type LocalRegisterFormValues = RegisterPayload & {
  repeatPassword: string
}
