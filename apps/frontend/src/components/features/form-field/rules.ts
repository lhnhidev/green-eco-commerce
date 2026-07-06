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
    case 'repeatPassword':
      return {
        required: 'Repeat password is required',
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
          message: 'Repeat password must be at least 6 characters, include letters (upper, lower) and numbers',
        },
      }
    case 'firstName':
      return {
        required: 'First name is required',
      }
    case 'lastName':
      return {
        required: 'Last name is required',
      }
    case 'phone':
      return {
        required: 'Phone number is required',
        pattern: {
          value: /^(0|\+84)(3[2-9]|5[235689]|7[06-9]|8[1-9]|9[0-9])([0-9]{7})$/,
          message: 'Invalid phone number',
        },
      }
    case 'address':
      return {
        required: 'Address is required',
      }
    default:
      return undefined
  }
}
