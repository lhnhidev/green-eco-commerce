import { Button } from '@mantine/core'
import { ArrowClockwiseIcon, HouseIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import NotFoundPage from './NotFoundPage'

const ErrorPage = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-3">
        <WarningCircleIcon weight="fill" size={28} className="text-red-500" />
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Something went wrong</h1>
      <p className="text-gray-500 max-w-sm mb-6">
        An unexpected error occurred while loading this page. Please try again or head back home.
      </p>
      <div className="flex gap-3">
        <Button
          onClick={() => window.location.reload()}
          color="primary"
          radius="xl"
          leftSection={<ArrowClockwiseIcon size={16} />}
        >
          Reload Page
        </Button>
        <Button
          component={Link}
          to="/"
          variant="light"
          color="primary"
          radius="xl"
          leftSection={<HouseIcon size={16} />}
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}

export default ErrorPage
