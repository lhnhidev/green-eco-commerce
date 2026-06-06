import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'
import type { IconType } from 'react-icons/lib'

export type InputProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>
  label?: string
  placeholder?: string
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  errorMessage?: string
  Icon?: IconType
}
