import type { BannerDto } from '@api/schemas'
import { ImageDropzone } from '@components/features/upload/ImageDropzone'
import { Button, NumberInput, Switch, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'

export type BannerFormValues = {
  title: string
  subtitle: string
  imageUrl: string
  linkUrl: string
  sortOrder: number
  isActive: boolean
}

const emptyValues: BannerFormValues = {
  title: '',
  subtitle: '',
  imageUrl: '',
  linkUrl: '',
  sortOrder: 1,
  isActive: true,
}

const toFormValues = (banner: BannerDto): BannerFormValues => ({
  title: banner.title,
  subtitle: banner.subtitle ?? '',
  imageUrl: banner.imageUrl,
  linkUrl: banner.linkUrl ?? '',
  sortOrder: banner.sortOrder,
  isActive: banner.isActive,
})

type BannerFormProps = {
  editingBanner: BannerDto | null
  onSubmit: (values: BannerFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
}

const BannerForm = ({ editingBanner, onSubmit, onCancel, isSubmitting }: BannerFormProps) => {
  const isEditing = !!editingBanner

  const form = useForm<BannerFormValues>({
    initialValues: editingBanner ? toFormValues(editingBanner) : emptyValues,
    validate: {
      title: (v) => (!v.trim() ? 'Title is required' : null),
      imageUrl: (v) => (!v.trim() ? 'Image URL is required' : null),
      sortOrder: (v) => (v < 1 ? 'Must be ≥ 1' : null),
    },
  })

  useEffect(() => {
    form.setValues(editingBanner ? toFormValues(editingBanner) : emptyValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingBanner])

  return (
    <form onSubmit={form.onSubmit(onSubmit)} className="flex flex-col gap-3">
      <ImageDropzone
        label="Banner Image"
        value={form.values.imageUrl}
        onChange={(url) => form.setFieldValue('imageUrl', url)}
        previewAspect="aspect-[3/1]"
      />
      {form.errors.imageUrl && <p className="text-xs text-red-500">{form.errors.imageUrl}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextInput
          label="Title"
          withAsterisk
          placeholder="e.g. Live Greener Every Day"
          {...form.getInputProps('title')}
        />
        <TextInput label="Link URL" placeholder="/products (optional)" {...form.getInputProps('linkUrl')} />
      </div>
      <Textarea
        label="Subtitle"
        placeholder="Short description shown under the title..."
        minRows={2}
        {...form.getInputProps('subtitle')}
      />
      <div className="flex items-center gap-4">
        <NumberInput label="Sort Order" min={1} w={120} {...form.getInputProps('sortOrder')} />
        <Switch
          label="Active"
          className="mt-6"
          checked={form.values.isActive}
          onChange={(e) => form.setFieldValue('isActive', e.currentTarget.checked)}
        />
      </div>
      <div className="flex gap-2 justify-end mt-1">
        <Button variant="subtle" color="gray" size="xs" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="xs" loading={isSubmitting}>
          {isEditing ? 'Save Changes' : 'Create'}
        </Button>
      </div>
    </form>
  )
}

export default BannerForm
