import { Checkbox } from '@mantine/core'
import type { FieldValues } from 'react-hook-form'
import type { InputProps } from '../input.types'

function CheckboxInput<T extends FieldValues>({ field, label, size }: InputProps<T>) {
  return <Checkbox {...field} label={label ?? ''} size={size ?? 'xs'} />
}

export default CheckboxInput
