import { createTheme, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import { AuthBootstrap } from './components/features/AuthBootstrap.tsx'
import { router } from './router/index.tsx'
import { store } from './store/index.ts'
import '@fontsource-variable/inter/wght.css'
import 'animate.css'
import '@mantine/dates/styles.css'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const theme = createTheme({
  fontFamily: 'Inter Variable, sans-serif',
  primaryColor: 'primary',
  colors: {
    primary: [
      '#eefcf1',
      '#d7f7de',
      '#a8ecc2',
      '#74dfa1',
      '#4bd486',
      '#30cc74',
      '#1fc969',
      '#10b157',
      '#059d4c',
      '#00883f',
    ],
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        fw: 600,
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
      },
    },
  },
})

// Cấu hình URL gốc cho tất cả các lượt gọi API thông qua Axios
axios.defaults.baseURL = import.meta.env.VITE_API_ROOT
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
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <AuthBootstrap />
      <MantineProvider theme={theme}>
        <Notifications position="bottom-right" />
        <RouterProvider router={router} />
      </MantineProvider>
    </Provider>
    {/* <ReactQueryDevtools initialIsOpen={false} position="bottom" /> */}
  </QueryClientProvider>,
  // </StrictMode>,
)
