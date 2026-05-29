import type { FieldValues, Path } from 'react-hook-form'

export const getDefaultRules = <T extends FieldValues>(name: Path<T>) => {
  switch (name) {
    case 'email':
      return {
        required: 'Email is required',
        pattern: {
          value: /^\S+@\S+\.\S+$/,
          message: 'Invalid email address',
        },
      }
    case 'password':
      return {
        required: 'Password is required',
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
          message: 'Passwords must be at least 6 characters, include letters (upper, lower) and numbers',
        },
      }
    default:
      return undefined
  }
}
