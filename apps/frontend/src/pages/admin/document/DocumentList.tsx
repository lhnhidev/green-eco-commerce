import { invalidateGetDocuments, useDeleteDocument, useGetDocuments, useUploadDocument } from '@api'
import type { DocumentDto } from '@api/schemas'
import { DocumentFileTypeEnum } from '@api/schemas'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import ConfirmModal from '@components/ui/primitives/ConfirmModal'
import DataTable, { type DataTableColumn } from '@components/ui/primitives/DataTable'
import Panel from '@components/ui/primitives/Panel'
import RowActions from '@components/ui/primitives/RowActions'
import Toolbar from '@components/ui/primitives/Toolbar'
import { Badge, Button, FileInput, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { CloudArrowUpIcon, FilesIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'

const DocumentList = () => {
  const [search, setSearch] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DocumentDto | null>(null)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
  const queryClient = useQueryClient()

  const { data: documents, isLoading } = useGetDocuments()

  const { mutate: upload, isPending: uploading } = useUploadDocument({
    mutation: {
      onSuccess: async () => {
        await invalidateGetDocuments(queryClient)
        notifications.show({ title: 'Success', message: 'Document uploaded and vectorized!', color: 'green' })
        setFile(null)
      },
      onError: () => notifications.show({ title: 'Error', message: 'Failed to upload document', color: 'red' }),
    },
  })

  const { mutate: deleteDoc, isPending: deleting } = useDeleteDocument({
    mutation: {
      onSuccess: async () => {
        await invalidateGetDocuments(queryClient)
        notifications.show({ title: 'Deleted', message: 'Document removed', color: 'green' })
        closeDelete()
      },
    },
  })

  const handleUpload = () => {
    if (file) upload({ data: { file } })
  }

  const filteredDocs = (documents ?? []).filter((d) => d.fileName.toLowerCase().includes(search.toLowerCase()))

  const columns: DataTableColumn<DocumentDto>[] = [
    { key: 'name', header: 'Document Name', render: (doc) => <span className="font-medium">{doc.fileName}</span> },
    {
      key: 'type',
      header: 'Type',
      width: 90,
      render: (doc) => (
        <Badge
          size="xs"
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
      ),
    },
    {
      key: 'chunks',
      header: 'Chunks',
      width: 90,
      render: (doc) => <span className="text-muted-foreground">{doc.embeddingCount}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: 100,
      render: () => (
        <Badge size="xs" variant="dot" color="green">
          Vectorized
        </Badge>
      ),
    },
    {
      key: 'uploaded',
      header: 'Uploaded At',
      width: 140,
      render: (doc) => <span className="text-muted-foreground">{dayjs(doc.createdAt).format('DD/MM/YYYY HH:mm')}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 70,
      align: 'right',
      render: (doc) => (
        <RowActions
          onDelete={() => {
            setDeleteTarget(doc)
            openDelete()
          }}
        />
      ),
    },
  ]

  return (
    <AdminPageShell title="Knowledge Base" description="Upload and manage documents to train the AI Chatbot">
      <Panel variant="admin" padding="md" className="mb-3">
        <h2 className="font-semibold text-sm text-gray-800 mb-3">Upload New Document</h2>
        <div className="flex gap-3 items-end">
          <FileInput
            label="Select file (.pdf, .docx, .txt)"
            placeholder="Click to choose a file"
            value={file}
            onChange={setFile}
            accept=".pdf,.docx,.txt"
            className="flex-1"
          />
          <Button
            size="sm"
            leftSection={<CloudArrowUpIcon size={15} />}
            disabled={!file}
            loading={uploading}
            onClick={handleUpload}
          >
            Upload to Vector DB
          </Button>
        </div>
      </Panel>

      <Toolbar
        left={
          <TextInput
            placeholder="Search documents..."
            size="xs"
            leftSection={<MagnifyingGlassIcon size={13} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={240}
          />
        }
      />

      <DataTable
        columns={columns}
        rows={filteredDocs}
        getRowKey={(doc) => doc.id}
        isLoading={isLoading}
        emptyIcon={FilesIcon}
        emptyTitle="No documents found"
        emptyDescription="Upload a document above to add it to the Knowledge Base."
      />

      <ConfirmModal
        opened={deleteOpened}
        onClose={closeDelete}
        onConfirm={() => deleteTarget && deleteDoc({ id: deleteTarget.id })}
        title="Delete document"
        message={
          <>
            Delete <strong className="text-gray-700">{deleteTarget?.fileName}</strong>? This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminPageShell>
  )
}

export default DocumentList
