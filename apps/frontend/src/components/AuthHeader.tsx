import { SegmentedControl } from '@mantine/core'
import { useState } from 'react'

type AuthHeaderType = {
  title: string
  description: string
}

const AuthHeader = ({ title, description }: AuthHeaderType) => {
  const [active, setActive] = useState<'login' | 'register'>('login')

  return (
    <div className="px-2">
      <div className="space-y-1 mb-5 text-center">
        <h4 className="text-sm text-primary">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>

      <div>
        <SegmentedControl
          value={active}
          onChange={setActive}
          classNames={{
            root: '!rounded-4xl !w-full !bg-[var(--color-muted)]',
            indicator: '!rounded-4xl',
            innerLabel: '!font-medium !text-xs',
          }}
          data={[
            { label: 'Login', value: 'login' },
            { label: 'Register', value: 'register' },
          ]}
        />
      </div>
    </div>
  )
}

export default AuthHeader
