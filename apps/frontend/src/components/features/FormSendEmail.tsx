import { Button, TextInput } from '@mantine/core'
import { CheckCircleIcon } from '@phosphor-icons/react'
import { type FormEvent, useState } from 'react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FormSendEmail = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!EMAIL_REGEX.test(trimmed)) {
      setError('Please enter a valid email address')
      return
    }
    setError(null)
    // No newsletter backend exists yet — this only confirms the address locally.
    setSubscribed(true)
    setEmail('')
  }

  if (subscribed) {
    return (
      <div className="flex items-center justify-center gap-2 max-w-md mx-auto text-primary font-medium">
        <CheckCircleIcon weight="fill" size={20} />
        Thanks for subscribing! Watch your inbox for updates.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-start flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <div className="flex-1 w-full">
        <TextInput
          type="email"
          placeholder="Enter your email"
          size="md"
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value)
            if (error) setError(null)
          }}
          error={error}
        />
      </div>
      <Button type="submit" size="md">
        Subscribe
      </Button>
    </form>
  )
}

export default FormSendEmail
