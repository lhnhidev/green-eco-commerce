import { Button, FileInput, Table, TextInput } from '@mantine/core'
import { useState } from 'react'
import { FiSearch, FiUploadCloud } from 'react-icons/fi'

const DocumentList = () => {
  const [search, setSearch] = useState('')
  const [file, setFile] = useState<File | null>(null)

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
          <Button color="primary" leftSection={<FiUploadCloud />} disabled={!file}>
            Upload to Vector DB
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-primary/10 mb-6">
        <TextInput
          placeholder="Search documents..."
          leftSection={<FiSearch className="text-muted-foreground" />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          radius="xl"
        />
      </div>

      {/* Table Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
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
            <Table.Tr>
              <Table.Td colSpan={6}>
                <div className="text-center py-12 text-muted-foreground">No documents found in the Knowledge Base.</div>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    </div>
  )
}

export default DocumentList
