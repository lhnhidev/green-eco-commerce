import { API_BASE_URL } from '@/lib/axios'

/**
 * Uploaded images/avatars come back from the backend as relative paths (`/uploads/...`);
 * pre-existing pasted URLs are absolute. Only the relative ones need the backend origin prefixed.
 */
export const resolveImageUrl = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined
  return url.startsWith('/') ? `${API_BASE_URL}${url}` : url
}
