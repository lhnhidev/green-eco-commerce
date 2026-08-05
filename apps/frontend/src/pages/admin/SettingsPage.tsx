import { invalidateGetApplicationSettings, useGetApplicationSettings, useUpdateApplicationSettings } from '@api'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import FormPanel from '@components/ui/primitives/FormPanel'
import { NumberInput, Skeleton } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

const SettingsPage = () => {
  const queryClient = useQueryClient()
  const { data: settings, isLoading } = useGetApplicationSettings()
  const { mutate: updateSettings, isPending } = useUpdateApplicationSettings()

  const form = useForm({
    initialValues: { greenPointsPerCarbonIndexRatio: 0 },
    validate: {
      greenPointsPerCarbonIndexRatio: (v) => (v <= 0 ? 'Must be greater than 0' : null),
    },
  })

  useEffect(() => {
    if (settings) {
      form.setValues({ greenPointsPerCarbonIndexRatio: settings.greenPointsPerCarbonIndexRatio })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  const handleSubmit = (values: typeof form.values) => {
    updateSettings(
      { data: values },
      {
        onSuccess: async () => {
          await invalidateGetApplicationSettings(queryClient)
          notifications.show({
            title: 'Settings saved',
            message: 'Application settings have been updated.',
            color: 'green',
          })
        },
        onError: () => notifications.show({ title: 'Error', message: 'Could not update settings.', color: 'red' }),
      },
    )
  }

  if (isLoading) {
    return (
      <AdminPageShell title="Settings" description="Store-wide configuration">
        <Skeleton height={200} radius="md" />
      </AdminPageShell>
    )
  }

  return (
    <AdminPageShell title="Settings" description="Store-wide configuration">
      <FormPanel
        title="Green Wallet"
        description="Controls how customer purchases convert into green points."
        onSubmit={form.onSubmit(handleSubmit)}
        submitLabel="Save changes"
        isSubmitting={isPending}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 py-1">
          <div className="sm:max-w-[60%]">
            <label className="block text-sm font-medium text-gray-800" htmlFor="greenPointsPerCarbonIndexRatio">
              Green points per carbon index ratio
            </label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Green points earned = order's carbon index saved × this ratio.
            </p>
          </div>
          <NumberInput
            id="greenPointsPerCarbonIndexRatio"
            withAsterisk
            min={0}
            decimalScale={2}
            className="sm:w-40 shrink-0"
            {...form.getInputProps('greenPointsPerCarbonIndexRatio')}
          />
        </div>
      </FormPanel>
    </AdminPageShell>
  )
}

export default SettingsPage
