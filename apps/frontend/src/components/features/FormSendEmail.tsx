import { Button } from '@mantine/core'

const FormSendEmail = () => {
  return (
    <div className="flex items-center flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 px-4 py-3 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <Button radius="xl" color="green.9" className="px-8">
        Subscribe
      </Button>
    </div>
  )
}

export default FormSendEmail
