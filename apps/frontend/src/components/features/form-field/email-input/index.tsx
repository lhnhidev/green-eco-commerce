import { TextInput } from '@mantine/core'
import type { FieldValues } from 'react-hook-form'
import type { InputProps } from '../input.types'

function EmailInput<T extends FieldValues>({
  field,
  label,
  placeholder,
  radius,
  size,
  errorMessage,
  Icon,
}: InputProps<T>) {
  return (
    <TextInput
      {...field}
      label={label ?? ''}
      placeholder={placeholder ?? ''}
      radius={radius ?? 'md'}
      size={size ?? 'xs'}
      leftSection={Icon ? <Icon className="text-gray-600" /> : undefined}
      classNames={{
        label: '!font-medium !text-[13px] !mb-[5px]',
        input: '!bg-[var(--color-input-muted)] !border-none',
      }}
      error={errorMessage ?? ''}
    />
  )
}

export default EmailInput
