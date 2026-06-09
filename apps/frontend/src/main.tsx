import { createTheme, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import { AuthBootstrap } from './components/features/AuthBootstrap.tsx'
import { router } from './router/index.tsx'
import { store } from './store/index.ts'

const theme = createTheme({
  fontFamily: 'Poppins, sans-serif',
  primaryColor: 'green',
  colors: {
    green: [
      '#f0fdf4',
      '#dcfce7',
      '#bbf7d0',
      '#86efac',
      '#4ade80',
      '#22c55e',
      '#16a34a',
      '#15803d',
      '#166534',
      '#2d5016',
    ],
  },
  defaultRadius: 'md',
})

// Cấu hình URL gốc cho tất cả các lượt gọi API thông qua Axios
axios.defaults.baseURL = 'http://localhost:5244'
axios.defaults.withCredentials = true

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dữ liệu được coi là mới trong 5 phút
      retry: 1, // Thử lại 1 lần nếu API lỗi
      refetchOnWindowFocus: false, // Không fetch lại khi click chuyển tab trình duyệt
    },
  },
})

// biome-ignore lint/style/noNonNullAssertion: idk
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthBootstrap />
        <MantineProvider theme={theme}>
          <Notifications position="bottom-right" />
          <RouterProvider router={router} />
        </MantineProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
