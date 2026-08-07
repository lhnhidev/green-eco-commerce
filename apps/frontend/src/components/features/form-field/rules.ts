import type { FieldValues, Path, RegisterOptions } from 'react-hook-form'

export const getDefaultRules: <T extends FieldValues>(name: Path<T>) => RegisterOptions<T> = (name) => {
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
        minLength: {
          value: 2,
          message: 'First name must be at least 2 characters long',
        },
        maxLength: {
          value: 80,
          message: 'First name must be at most 80 characters long',
        },
      }
    case 'lastName':
      return {
        required: 'Last name is required',
        minLength: {
          value: 2,
          message: 'Last name must be at least 2 characters long',
        },
        maxLength: {
          value: 80,
          message: 'Last name must be at most 80 characters long',
        },
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
        minLength: {
          value: 5,
          message: 'Address must be at least 5 characters long',
        },
        maxLength: {
          value: 500,
          message: 'Address must be at most 500 characters long',
        },
      }
    default:
      return undefined
  }
}
