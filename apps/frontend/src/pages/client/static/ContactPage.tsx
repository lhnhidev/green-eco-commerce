import StaticPageLayout from '@layouts/StaticPageLayout'
import { Button, Textarea, TextInput } from '@mantine/core'
import { ClockIcon, EnvelopeSimpleIcon, PhoneIcon } from '@phosphor-icons/react'
import { type FormEvent, useState } from 'react'

const SUPPORT_EMAIL = 'support@greencart.com'

const ContactPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const nextErrors: typeof errors = {}
    if (!name.trim()) nextErrors.name = 'Please enter your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Please enter a valid email'
    if (!message.trim()) nextErrors.message = 'Please enter a message'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    // No contact-form backend exists yet — hand off to the visitor's own email client instead.
    const subject = encodeURIComponent(`Message from ${name}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <StaticPageLayout title="Contact Us" path="/contact">
      <p>Have a question about an order, a product, or your account? We'd love to help.</p>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <EnvelopeSimpleIcon size={20} className="text-primary shrink-0" />
          <span className="text-sm text-gray-700">{SUPPORT_EMAIL}</span>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <PhoneIcon size={20} className="text-primary shrink-0" />
          <span className="text-sm text-gray-700">1-800-GREEN-CART</span>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <ClockIcon size={20} className="text-primary shrink-0" />
          <span className="text-sm text-gray-700">Mon–Fri, 9AM–6PM EST</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="not-prose flex flex-col gap-4 max-w-lg">
        <TextInput
          label="Your name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          error={errors.name}
          withAsterisk
        />
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          error={errors.email}
          withAsterisk
        />
        <Textarea
          label="Message"
          minRows={4}
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          error={errors.message}
          withAsterisk
        />
        <div>
          <Button type="submit" color="primary">
            Send Message
          </Button>
        </div>
      </form>
    </StaticPageLayout>
  )
}

export default ContactPage
