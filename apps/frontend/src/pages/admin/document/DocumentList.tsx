import { getGetDocumentsQueryKey, useDeleteDocument, useGetDocuments, useUploadDocument } from '@api'
import { DocumentFileTypeEnum } from '@api/schemas'
import { ActionIcon, Badge, Button, FileInput, Table, Text, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { CloudArrowUpIcon, MagnifyingGlassIcon, TrashIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'

const DocumentList = () => {
  const [search, setSearch] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  const { data: documents, isLoading } = useGetDocuments()

  const { mutate: upload, isPending: uploading } = useUploadDocument({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetDocumentsQueryKey() })
        notifications.show({ title: 'Success', message: 'Document uploaded and vectorized!', color: 'green' })
        setFile(null)
      },
      onError: () => notifications.show({ title: 'Error', message: 'Failed to upload document', color: 'red' }),
    },
  })

  const { mutate: deleteDoc, isPending: deleting } = useDeleteDocument({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetDocumentsQueryKey() })
        notifications.show({ title: 'Deleted', message: 'Document removed', color: 'green' })
      },
    },
  })

  const handleUpload = () => {
    if (file) upload({ file })
  }

  const filteredDocs = (documents ?? []).filter((d) => d.fileName.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Knowledge Base</h1>
          <p className="text-gray-500 mt-1">Upload and manage documents to train the AI Chatbot.</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Upload New Document</h2>
        <div className="flex gap-4 items-end">
          <FileInput
            label="Select file (.pdf, .docx, .txt)"
            placeholder="Click to choose a file"
            value={file}
            onChange={setFile}
            accept=".pdf,.docx,.txt"
            radius="md"
            className="flex-1"
          />
          <Button
            color="primary"
            leftSection={<CloudArrowUpIcon />}
            disabled={!file}
            loading={uploading}
            onClick={handleUpload}
          >
            Upload to Vector DB
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-primary/10 mb-6">
        <TextInput
          placeholder="Search documents..."
          leftSection={<MagnifyingGlassIcon className="text-muted-foreground" />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          radius="xl"
        />
      </div>

      {/* Table Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
        <div className="overflow-x-auto">
          <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Document Name</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Size</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Uploaded At</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <div className="text-center py-12 text-muted-foreground">Loading documents...</div>
                  </Table.Td>
                </Table.Tr>
              ) : filteredDocs.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <div className="text-center py-12 text-muted-foreground">
                      No documents found in the Knowledge Base.
                    </div>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredDocs.map((doc) => (
                  <Table.Tr key={doc.id}>
                    <Table.Td className="font-medium text-gray-700">{doc.fileName}</Table.Td>
                    <Table.Td>
                      <Badge
                        size="sm"
                        variant="light"
                        color={
                          doc.fileType === DocumentFileTypeEnum.Pdf
                            ? 'red'
                            : doc.fileType === DocumentFileTypeEnum.Docx
                              ? 'blue'
                              : 'gray'
                        }
                      >
                        {doc.fileType.toUpperCase()}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {doc.embeddingCount} chunks
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" variant="dot" color="green">
                        Vectorized
                      </Badge>
                    </Table.Td>
                    <Table.Td className="text-muted-foreground">
                      {dayjs(doc.createdAt).format('DD/MM/YYYY HH:mm')}
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        loading={deleting}
                        onClick={() => {
                          if (confirm('Are you sure?')) deleteDoc({ id: doc.id })
                        }}
                      >
                        <TrashIcon />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default DocumentList
