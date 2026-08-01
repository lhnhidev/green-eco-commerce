import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dữ liệu được coi là mới trong 5 phút
      retry: 1, // Thử lại 1 lần nếu API lỗi
      refetchOnWindowFocus: false, // Không fetch lại khi click chuyển tab trình duyệt
    },
  },
})
