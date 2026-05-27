import { TextInput } from '@mantine/core'
import { FaRegEnvelope } from 'react-icons/fa'
import { MdLockOutline } from 'react-icons/md'

const LoginForm = () => {
  return (
    <div className="text-sm space-y-3 mt-6">
      <TextInput
        label="Email"
        placeholder="Enter your email"
        radius="md"
        size="xs"
        leftSection={<FaRegEnvelope className="text-gray-600" />}
        classNames={{
          label: '!font-medium !text-[13px] !mb-[5px]',
          input: '!bg-[var(--color-input-muted)] !border-none !py-[18px] !pl-[42px]',
          section: '!pl-[15px]',
        }}
      />

      <TextInput
        label="Password"
        placeholder="Enter your password"
        radius="md"
        size="xs"
        leftSection={<MdLockOutline className="text-gray-600" />}
        classNames={{
          label: '!font-medium !text-[13px] !mb-[5px]',
          input: '!bg-[var(--color-input-muted)] !border-none !py-[18px] !pl-[42px]',
          section: '!pl-[15px]',
        }}
      />
    </div>
  )
}

export default LoginForm
