import PageBreadcrumbs from '@components/ui/PageBreadcrumbs'
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
    <div className="container mx-auto px-4 py-6 lg:py-8 max-w-5xl">
      <Seo title="Contact Us - Green Cart" />
      <PageBreadcrumbs items={breadcrumbItems} mb="lg" />

      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center justify-center p-2.5 bg-green-50 rounded-full mb-3">
          <Leaf size={28} weight="duotone" className="text-green-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Let's Start a{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-green-500 to-emerald-600">
            Conversation
          </span>
        </h1>
        <p className="text-base text-gray-500">
          Have a question about an order, a product, or our sustainability practices? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Contact Information Cards */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-linear-to-br from-green-500 to-emerald-600 p-6 md:p-8 rounded-3xl text-white shadow-xl shadow-green-900/10 h-full flex flex-col justify-center relative overflow-hidden group">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700"></div>

            <h3 className="text-xl font-bold mb-5 relative z-10">Get in Touch</h3>

            <div className="flex flex-col gap-5 relative z-10">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl shrink-0 backdrop-blur-sm">
                  <EnvelopeSimple size={20} weight="duotone" />
                </div>
                <div>
                  <p className="text-green-100 text-xs font-medium mb-0.5">Email Support</p>
                  <p className="font-semibold text-sm md:text-base">{SUPPORT_EMAIL}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl shrink-0 backdrop-blur-sm">
                  <Phone size={20} weight="duotone" />
                </div>
                <div>
                  <p className="text-green-100 text-xs font-medium mb-0.5">Call Us</p>
                  <p className="font-semibold text-sm md:text-base">1-800-GREEN-CART</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl shrink-0 backdrop-blur-sm">
                  <MapPin size={20} weight="duotone" />
                </div>
                <div>
                  <p className="text-green-100 text-xs font-medium mb-0.5">Headquarters</p>
                  <p className="font-semibold text-sm leading-snug">
                    123 Eco Valley Road
                    <br />
                    Portland, OR 97204
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl shrink-0 backdrop-blur-sm">
                  <Clock size={20} weight="duotone" />
                </div>
                <div>
                  <p className="text-green-100 text-xs font-medium mb-0.5">Working Hours</p>
                  <p className="font-semibold text-sm">Mon–Fri, 9AM–6PM EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-1.5">Send us a Message</h3>
            <p className="text-sm text-gray-500 mb-6">Fill out the form below and we'll get back to you soon.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Your Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  error={errors.name}
                  withAsterisk
                  classNames={{
                    input:
                      'focus:border-green-500 focus:ring-green-500/20 bg-gray-50/50 border-gray-200 rounded-xl transition-colors',
                    label: 'text-gray-700 text-sm font-semibold mb-1',
                  }}
                />
                <TextInput
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  error={errors.email}
                  withAsterisk
                  classNames={{
                    input:
                      'focus:border-green-500 focus:ring-green-500/20 bg-gray-50/50 border-gray-200 rounded-xl transition-colors',
                    label: 'text-gray-700 text-sm font-semibold mb-1',
                  }}
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
                classNames={{
                  input:
                    'focus:border-green-500 focus:ring-green-500/20 bg-gray-50/50 border-gray-200 rounded-xl transition-colors',
                  label: 'text-gray-700 text-sm font-semibold mb-1',
                }}
              />
              <div className="mt-2">
                <Button
                  type="submit"
                  size="md"
                  radius="xl"
                  loading={isSubmitting}
                  rightSection={<PaperPlaneRight weight="fill" />}
                  className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md shadow-green-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto px-6"
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
