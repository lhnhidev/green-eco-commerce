import { createTheme, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/router'
import { store } from '@/store'
import '@fontsource-variable/inter/wght.css'
// Data/measurement role only (stat values, chart ticks) — reinforces that these numbers
// were measured, not just headlined. See theme.other.adminMonoFont below.
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/600.css'
import 'animate.css'

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
  cursorType: 'pointer',

  // Every scale value below is a var(--ds-*) string defined in index.css — Mantine writes them
  // into --mantine-font-size-md etc., so Tailwind and Mantine read the same variables at paint time.
  fontSizes: {
    xs: 'var(--ds-text-2xs)',
    sm: 'var(--ds-text-sm)',
    md: 'var(--ds-text-base)',
    lg: 'var(--ds-text-lg)',
    xl: 'var(--ds-text-xl)',
  },
  lineHeights: {
    xs: '1.45',
    sm: '1.5',
    md: '1.55',
    lg: '1.5',
    xl: '1.4',
  },
  spacing: {
    xs: 'var(--ds-space-xs)',
    sm: 'var(--ds-space-sm)',
    md: 'var(--ds-space-md)',
    lg: 'var(--ds-space-lg)',
    xl: 'var(--ds-space-xl)',
  },
  radius: {
    xs: 'var(--ds-radius-xs)',
    sm: 'var(--ds-radius-sm)',
    md: 'var(--ds-radius-md)',
    lg: 'var(--ds-radius-lg)',
    xl: 'var(--ds-radius-xl)',
  },
  shadows: {
    xs: 'var(--ds-shadow-xs)',
    sm: 'var(--ds-shadow-sm)',
    md: 'var(--ds-shadow-md)',
    lg: 'var(--ds-shadow-lg)',
    xl: 'var(--ds-shadow-xl)',
  },
  headings: {
    fontFamily: 'Inter Variable, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: 'var(--ds-text-4xl)', lineHeight: '1.2', fontWeight: '700' },
      h2: { fontSize: 'var(--ds-text-2xl)', lineHeight: '1.3', fontWeight: '600' },
      h3: { fontSize: 'var(--ds-text-xl)', lineHeight: '1.4', fontWeight: '600' },
      h4: { fontSize: 'var(--ds-text-lg)', lineHeight: '1.45', fontWeight: '600' },
      h5: { fontSize: 'var(--ds-text-base)', lineHeight: '1.5', fontWeight: '600' },
      h6: { fontSize: 'var(--ds-text-sm)', lineHeight: '1.5', fontWeight: '600' },
    },
  },
  other: {
    headerHeight: 56,
    adminNavbarWidth: 224,
    container: 1280,
    containerWide: 1440,
    stickyTop: 72,

    // Admin dashboard redesign palette — additive on top of the primary/secondary scale
    // above, not a replacement (avoids rippling into every button/badge app-wide). Mirrored
    // as Tailwind utilities (bg-admin-moss, text-admin-canopy, ...) via the matching
    // --color-admin-* vars in index.css's @theme inline block — kept in sync manually,
    // same pattern as the primaryShade/--color-primary comment above.
    adminMoss: '#4b5d52',
    adminCompost: '#b3763f',
    adminCanopy: '#132318',
    adminMist: '#f3f6f2',
    // Data/measurement typography role — stat values, chart ticks, the CO2 signature number.
    adminMonoFont: "'IBM Plex Mono', monospace",
  },

  components: {
    Button: {
      defaultProps: { size: 'sm', radius: 'md', fw: 600 },
    },
    ActionIcon: {
      defaultProps: { size: 'md', radius: 'md' },
    },
    Paper: {
      defaultProps: { radius: 'md', shadow: 'xs', withBorder: true },
    },
    Card: {
      defaultProps: { radius: 'md', shadow: 'xs', withBorder: true, padding: 'lg' },
    },
    Modal: {
      defaultProps: {
        centered: true,
        radius: 'lg',
        size: 'md',
        overlayProps: { backgroundOpacity: 0.45, blur: 2 },
      },
      styles: { title: { fontSize: 'var(--ds-text-lg)', fontWeight: 600 } },
    },
    Drawer: {
      defaultProps: { radius: 0, size: 380 },
    },
    // One input ramp everywhere — pages no longer set size/radius individually.
    TextInput: { defaultProps: { size: 'sm', radius: 'md' } },
    Textarea: { defaultProps: { size: 'sm', radius: 'md' } },
    PasswordInput: { defaultProps: { size: 'sm', radius: 'md' } },
    NumberInput: { defaultProps: { size: 'sm', radius: 'md' } },
    Select: {
      defaultProps: { size: 'sm', radius: 'md', comboboxProps: { shadow: 'md', radius: 'md' } },
    },
    MultiSelect: { defaultProps: { size: 'sm', radius: 'md' } },
    TagsInput: { defaultProps: { size: 'sm', radius: 'md' } },
    Autocomplete: { defaultProps: { size: 'sm', radius: 'md' } },
    DatePickerInput: { defaultProps: { size: 'sm', radius: 'md' } },
    TreeSelect: { defaultProps: { size: 'sm', radius: 'md' } },
    Checkbox: { defaultProps: { size: 'sm', radius: 'sm' } },
    Switch: { defaultProps: { size: 'sm' } },
    Radio: { defaultProps: { size: 'sm' } },
    Badge: {
      defaultProps: { size: 'sm', radius: 'sm', variant: 'light' },
      styles: { root: { textTransform: 'none', fontWeight: 600 } },
    },
    Pagination: { defaultProps: { size: 'sm', radius: 'md' } },
    Menu: { defaultProps: { radius: 'md', shadow: 'md', width: 200 } },
    Tooltip: { defaultProps: { radius: 'sm', fz: 'xs', withArrow: true } },
    Tabs: { defaultProps: { radius: 'md' } },
    Rating: { defaultProps: { size: 'xs' } },
    // Admin table density set once — pages stop repeating verticalSpacing/th/td classNames.
    Table: {
      defaultProps: { verticalSpacing: 6, horizontalSpacing: 8, highlightOnHover: true },
      styles: {
        th: {
          fontSize: 'var(--ds-text-2xs)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: 'var(--color-muted-foreground)',
          background: 'var(--ds-color-surface-subtle)',
        },
        td: { fontSize: 'var(--ds-text-xs)' },
      },
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
