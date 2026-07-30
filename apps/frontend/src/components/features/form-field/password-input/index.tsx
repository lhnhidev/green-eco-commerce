import { PasswordInput } from '@mantine/core'
import type { FieldValues } from 'react-hook-form'
import type { InputProps } from '../input.types'

function PasswordInputV2<T extends FieldValues>({
  field,
  label,
  placeholder,
  radius,
  size,
  errorMessage,
  Icon,
}: InputProps<T>) {
  return (
    <PasswordInput
      {...field}
      label={label ?? ''}
      placeholder={placeholder ?? ''}
      radius={radius ?? 'md'}
      size={size ?? 'sm'}
      leftSection={Icon ? <Icon className="text-gray-600" /> : undefined}
      classNames={{
        label: 'font-medium text-sm mb-1',
        input: 'bg-input-muted border-none',
      }}
      error={errorMessage ?? ''}
    />
  )
}

export default PasswordInputV2
