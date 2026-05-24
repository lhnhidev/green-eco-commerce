import { Button, Card, Checkbox, PasswordInput, Tabs, TextInput } from '@mantine/core'
import { EnvelopeSimpleIcon, LeafIcon, LockIcon, PhoneIcon, UserIcon } from '@phosphor-icons/react'
import { useLocation } from 'wouter'

export function AuthPage() {
  const [, navigate] = useLocation()

  return (
    <div className="min-h-screen plant-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <LeafIcon className="h-6 w-6 text-white" weight="fill" />
          </div>
          <span className="text-2xl font-bold text-primary">GreenCart</span>
        </div>

        <Card shadow="md" padding="xl" radius="md" className="plant-shadow">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-primary">Welcome</h2>
            <p className="text-gray-500 text-sm">Join our community of plant lovers</p>
          </div>

          <Tabs defaultValue="login" color="green.9">
            <Tabs.List grow>
              <Tabs.Tab value="login">Login</Tabs.Tab>
              <Tabs.Tab value="register">Register</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="login" className="space-y-4 mt-6">
              <div className="space-y-4">
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  leftSection={<EnvelopeSimpleIcon className="h-4 w-4" />}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  leftSection={<LockIcon className="h-4 w-4" />}
                />
                <div className="flex items-center justify-between">
                  <Checkbox label="Remember me" color="green.9" size="sm" />
                  <Button variant="transparent" size="sm" color="green.9" className="p-0 h-auto">
                    Forgot password?
                  </Button>
                </div>
                <Button fullWidth radius="xl" color="green.9" onClick={() => navigate('/')}>
                  Sign In
                </Button>
                <div className="text-center text-sm text-gray-500">Or continue with</div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" radius="xl" color="gray">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" radius="xl" color="gray">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="register" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <TextInput label="First Name" placeholder="John" leftSection={<UserIcon className="h-4 w-4" />} />
                  <TextInput label="Last Name" placeholder="Doe" />
                </div>
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="john.doe@example.com"
                  leftSection={<EnvelopeSimpleIcon className="h-4 w-4" />}
                />
                <TextInput
                  label="Phone (Optional)"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  leftSection={<PhoneIcon className="h-4 w-4" />}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Create a password"
                  leftSection={<LockIcon className="h-4 w-4" />}
                />
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  leftSection={<LockIcon className="h-4 w-4" />}
                />
                <Checkbox
                  color="green.9"
                  size="sm"
                  label={
                    <span className="text-sm">
                      I agree to the{' '}
                      <Button variant="transparent" size="sm" color="green.9" className="p-0 h-auto text-sm">
                        Terms of Service
                      </Button>{' '}
                      and{' '}
                      <Button variant="transparent" size="sm" color="green.9" className="p-0 h-auto text-sm">
                        Privacy Policy
                      </Button>
                    </span>
                  }
                />
                <Checkbox
                  color="green.9"
                  size="sm"
                  label="Subscribe to our newsletter for plant care tips and offers"
                />
                <Button fullWidth radius="xl" color="green.9" onClick={() => navigate('/')}>
                  Create Account
                </Button>
              </div>
            </Tabs.Panel>
          </Tabs>
        </Card>

        <div className="text-center mt-6">
          <Button variant="subtle" color="gray" onClick={() => navigate('/')}>
            Continue as guest
          </Button>
        </div>
      </div>
    </div>
  )
}
