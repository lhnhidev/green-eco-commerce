import PageBreadcrumbs from '@components/ui/PageBreadcrumbs'
import Container from '@components/ui/primitives/Container'
import Panel from '@components/ui/primitives/Panel'
import Seo from '@components/ui/Seo'
import { Button, Textarea, TextInput } from '@mantine/core'
import { Clock, EnvelopeSimple, Leaf, MapPin, PaperPlaneRight, Phone } from '@phosphor-icons/react'
import { type FormEvent, useState } from 'react'

const SUPPORT_EMAIL = 'support@greencart.com'

const ContactPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const nextErrors: typeof errors = {}
    if (!name.trim()) nextErrors.name = 'Please enter your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Please enter a valid email'
    if (!message.trim()) nextErrors.message = 'Please enter a message'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setTimeout(() => {
      // No contact-form backend exists yet — hand off to the visitor's own email client instead.
      const subject = encodeURIComponent(`Message from ${name}`)
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
      setIsSubmitting(false)
    }, 500)
  }

  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: 'Contact Us', href: '/contact' },
  ]

  return (
    <Container width="narrow" className="py-6">
      <Seo title="Contact Us - Green Cart" />
      <PageBreadcrumbs items={breadcrumbItems} mb="sm" />

      <div className="mb-6">
        <div className="inline-flex items-center justify-center p-2 bg-green-50 rounded-full mb-2">
          <Leaf size={20} weight="duotone" className="text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Let's start a conversation</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-lg">
          Have a question about an order, a product, or our sustainability practices? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Contact information */}
        <div className="lg:col-span-2">
          <Panel padding="md" className="bg-primary text-white flex flex-col gap-4">
            <h3 className="font-semibold">Get in touch</h3>

            <div className="flex items-start gap-3">
              <EnvelopeSimple size={18} weight="duotone" className="shrink-0 mt-0.5" />
              <div>
                <p className="text-white/70 text-xs">Email Support</p>
                <p className="font-medium text-sm">{SUPPORT_EMAIL}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} weight="duotone" className="shrink-0 mt-0.5" />
              <div>
                <p className="text-white/70 text-xs">Call Us</p>
                <p className="font-medium text-sm">1-800-GREEN-CART</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} weight="duotone" className="shrink-0 mt-0.5" />
              <div>
                <p className="text-white/70 text-xs">Headquarters</p>
                <p className="font-medium text-sm leading-snug">
                  123 Eco Valley Road
                  <br />
                  Portland, OR 97204
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={18} weight="duotone" className="shrink-0 mt-0.5" />
              <div>
                <p className="text-white/70 text-xs">Working Hours</p>
                <p className="font-medium text-sm">Mon–Fri, 9AM–6PM EST</p>
              </div>
            </div>
          </Panel>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-3">
          <Panel padding="md">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Send us a message</h3>
            <p className="text-sm text-gray-500 mb-4">Fill out the form below and we'll get back to you soon.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextInput
                  label="Your Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  error={errors.name}
                  withAsterisk
                />
                <TextInput
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  error={errors.email}
                  withAsterisk
                />
              </div>
              <Textarea
                label="How can we help?"
                placeholder="Tell us about your inquiry..."
                minRows={4}
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
                error={errors.message}
                withAsterisk
              />
              <div className="mt-1">
                <Button
                  type="submit"
                  size="md"
                  loading={isSubmitting}
                  rightSection={<PaperPlaneRight weight="fill" size={15} />}
                >
                  Send Message
                </Button>
              </div>
            </form>
          </Panel>
        </div>
      </div>
    </Container>
  )
}

export default ContactPage
