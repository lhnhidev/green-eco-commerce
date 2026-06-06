import type { ComponentType } from 'react'
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  // type FieldErrors,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form'
import type { IconType } from 'react-icons/lib'
import { getDefaultRules } from './rules'

type InputProps = {
  label?: string
  placeholder?: string
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  Icon?: IconType
}

type FormFieldProps<T extends FieldValues = FieldValues> = {
  name: Path<T>
  control: Control<T>
  rules?: RegisterOptions<T, Path<T>>
  errorMessage?: string
  Component: ComponentType<
    {
      field: ControllerRenderProps<T, Path<T>>
      errorMessage?: string
    } & InputProps
  >
} & InputProps

const FormField = <T extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  errorMessage,
  Component,
  label,
  placeholder,
  radius,
  size,
  Icon,
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules ?? getDefaultRules<T>(name as Path<T>)}
      render={({ field }) => (
        <Component
          field={field}
          label={label}
          placeholder={placeholder}
          radius={radius}
          size={size}
          Icon={Icon}
          errorMessage={errorMessage ?? ''}
        />
      )}
    />
  )
}

export default FormField
