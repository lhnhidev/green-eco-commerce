import { useUploadImage } from '@api'
import { ActionIcon, Loader, SimpleGrid, Text } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { notifications } from '@mantine/notifications'
import { ImageIcon, TrashIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import { useState } from 'react'

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
}

export const ImageDropzone = ({ value, onChange, label = 'Image' }: ImageDropzoneProps) => {
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
          <div className="relative flex justify-center py-2">
            <img src={resolveImageUrl(value)} alt="" className="h-32 rounded-md object-cover" />
            <ActionIcon
              color="red"
              variant="filled"
              radius="xl"
              size="sm"
              className="absolute top-0 right-0"
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
  const [dragActive, setDragActive] = useState(false)

  const handleDrop = async (files: File[]) => {
    setDragActive(false)
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
      <Dropzone
        onDrop={handleDrop}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        accept={IMAGE_MIME_TYPE}
        loading={isPending}
        radius="md"
      >
        <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
          {isPending ? <Loader size="sm" /> : <ImageIcon size={28} />}
          <Text size="sm">{dragActive ? 'Drop images here' : 'Click or drag images to upload'}</Text>
        </div>
      </Dropzone>

      {value.length > 0 && (
        <SimpleGrid cols={4} mt="sm">
          {value.map((url, index) => (
            <div key={url} className="relative">
              <img src={resolveImageUrl(url)} alt="" className="h-20 w-full rounded-md object-cover" />
              <ActionIcon
                color="red"
                variant="filled"
                radius="xl"
                size="sm"
                className="absolute top-1 right-1"
                onClick={() => handleRemove(index)}
              >
                <TrashIcon size={12} />
              </ActionIcon>
            </div>
          ))}
        </SimpleGrid>
      )}
    </div>
  )
}
