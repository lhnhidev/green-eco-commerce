import { createTheme, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from '@/router'
import { store } from '@/store'
import '@fontsource-variable/inter/wght.css'
import 'animate.css'
import '@mantine/dates/styles.css'

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const theme = createTheme({
  fontFamily: 'Inter Variable, sans-serif',
  primaryColor: 'primary',
  // Mantine defaults to shade index 6 for unshaded `color="primary"` — index 7 is the one that
  // matches --color-primary (#10b157) in index.css, so pin it explicitly to keep them in sync.
  primaryShade: 7,
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
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''}>
      <Provider store={store}>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Notifications position="bottom-right" />
            <RouterProvider router={router} />
          </ModalsProvider>
        </MantineProvider>
      </Provider>
    </GoogleOAuthProvider>
    {/* <ReactQueryDevtools initialIsOpen={false} position="bottom" /> */}
  </QueryClientProvider>,
  // </StrictMode>,
)
