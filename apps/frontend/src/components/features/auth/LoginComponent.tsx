import { Button } from '@mantine/core'
import { UserIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'

const LoginComponent = () => {
  return (
    <Link to="/auth">
      <Button variant="subtle" color="gray" size="sm" radius="xl" leftSection={<UserIcon className="h-4 w-4" />}>
        <span className="hidden sm:inline">Login</span>
      </Button>
    </Link>
  )
}

export default LoginComponent
