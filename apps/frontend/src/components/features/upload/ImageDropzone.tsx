import { useUploadImage } from '@api'
import { ActionIcon, Loader, Text } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { notifications } from '@mantine/notifications'
import { PlusIcon, TrashIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { resolveImageUrl } from '@utils/resolveImageUrl'

const useImageUpload = () => {
  const { mutateAsync, isPending } = useUploadImage()

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const urls: string[] = []
    for (const file of files) {
      try {
        const result = await mutateAsync({ data: { file } })
        urls.push(result.url)
      } catch {
        notifications.show({ title: 'Upload failed', message: `Could not upload ${file.name}.`, color: 'red' })
      }
    }
    return urls
  }

  return { uploadFiles, isPending }
}

interface ImageDropzoneProps {
  value: string
  onChange: (url: string) => void
  label?: string
  /** Tailwind `aspect-*` class for the uploaded preview — lets each consumer match its real
   *  display shape (e.g. a wide banner) instead of the default small centered thumbnail. */
  previewAspect?: string
}

export const ImageDropzone = ({ value, onChange, label = 'Image', previewAspect }: ImageDropzoneProps) => {
  const { uploadFiles, isPending } = useImageUpload()

  const handleDrop = async (files: File[]) => {
    const [file] = files
    if (!file) return
    const [url] = await uploadFiles([file])
    if (url) onChange(url)
  }

  return (
    <div>
      {label && (
        <Text size="sm" fw={500} mb={4}>
          {label}
        </Text>
      )}
      <Dropzone onDrop={handleDrop} accept={IMAGE_MIME_TYPE} maxFiles={1} loading={isPending} radius="md">
        {value ? (
          <div className={previewAspect ? 'relative' : 'relative flex justify-center py-2'}>
            <img
              src={resolveImageUrl(value)}
              alt=""
              className={previewAspect ? `w-full ${previewAspect} rounded-md object-cover` : 'h-32 rounded-md object-cover'}
            />
            <ActionIcon
              color="red"
              variant="filled"
              radius="xl"
              size="sm"
              style={{ position: 'absolute', top: previewAspect ? 8 : 0, right: previewAspect ? 8 : 0 }}
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
              }}
            >
              <TrashIcon size={12} />
            </ActionIcon>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
            {isPending ? <Loader size="sm" /> : <UploadSimpleIcon size={28} />}
            <Text size="sm">Click or drag an image to upload</Text>
          </div>
        )}
      </Dropzone>
    </div>
  )
}

interface MultiImageDropzoneProps {
  value: string[]
  onChange: (urls: string[]) => void
  label?: string
}

export const MultiImageDropzone = ({ value, onChange, label = 'Images' }: MultiImageDropzoneProps) => {
  const { uploadFiles, isPending } = useImageUpload()

  const handleDrop = async (files: File[]) => {
    if (files.length === 0) return
    const urls = await uploadFiles(files)
    if (urls.length > 0) onChange([...value, ...urls])
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      {label && (
        <Text size="sm" fw={500} mb={4}>
          {label}
        </Text>
      )}
      <div className="flex flex-wrap gap-2">
        {value.map((url, index) => (
          <div key={url} className="relative h-24 w-24 shrink-0">
            <img src={resolveImageUrl(url)} alt="" className="h-full w-full rounded-md object-cover" />
            <ActionIcon
              color="red"
              variant="filled"
              radius="xl"
              size="sm"
              style={{ position: 'absolute', top: 4, right: 4 }}
              onClick={() => handleRemove(index)}
            >
              <TrashIcon size={12} />
            </ActionIcon>
          </div>
        ))}
        <Dropzone
          onDrop={handleDrop}
          accept={IMAGE_MIME_TYPE}
          loading={isPending}
          radius="md"
          p={0}
          className="h-24 w-24 shrink-0 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-1 text-gray-400">
            {isPending ? <Loader size="sm" /> : <PlusIcon size={20} />}
            <Text size="2xs">Add</Text>
          </div>
        </Dropzone>
      </div>
    </div>
  )
}
