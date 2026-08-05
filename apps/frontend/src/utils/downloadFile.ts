import { API_BASE_URL } from '@/lib/axios'

/**
 * Downloads a binary file (Excel/PDF/CSV) served by an authenticated backend endpoint.
 * Plain `fetch` doesn't go through axios' baseURL, so the backend origin is prefixed explicitly.
 */
export const downloadFile = async (path: string, filename: string) => {
  const res = await fetch(`${API_BASE_URL}${path}`, { credentials: 'include' })
  if (!res.ok) throw new Error('Download failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
