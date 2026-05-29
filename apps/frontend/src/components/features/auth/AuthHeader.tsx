import { SegmentedControl } from '@mantine/core'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { changeActive } from './auth.slice'

type AuthHeaderType = {
  title: string
  description: string
}

const AuthHeader = ({ title, description }: AuthHeaderType) => {
  const active = useAppSelector((state) => state.auth.active)
  const dispatch = useAppDispatch()

  return (
    <div className="px-2">
      <div className="space-y-1 mb-5 text-center">
        <h4 className="text-sm text-primary">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>

      <div>
        <SegmentedControl
          value={active}
          onChange={() => dispatch(changeActive(active === 'register' ? 'login' : 'register'))}
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
