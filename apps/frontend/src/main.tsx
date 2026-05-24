import { createTheme, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

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

// biome-ignore lint/style/noNonNullAssertion: idk
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications position="bottom-right" />
      <App />
    </MantineProvider>
  </StrictMode>,
)
