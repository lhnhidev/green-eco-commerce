# Eco Assistant Full-Page Chat Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-page "Eco Assistant" chat tab (next to Contact in the main nav) and a maximize button on the floating chat widget that jumps to it, sharing one ongoing conversation.

**Architecture:** Extract the floating chat widget's state/logic into a reusable hook (`useChatConversation`) and two small presentational components (`ChatMessagesList`, `ChatInputBar`). Both the existing floating widget and the new full-page route render the same hook + components, so they always show the same conversation (same `chatbotSessionId` in localStorage, same backend `ChatSession`). `HeaderChatbot` gains a `variant` prop to hide widget-only controls (Hide, Maximize) when rendered on the full page.

**Tech Stack:** React 19 + TypeScript, React Router 7, Redux Toolkit, TanStack Query, Mantine UI, Tailwind, Phosphor Icons. Frontend has no test runner configured (no vitest/jest in `package.json`) — verification is `bun run build` (type-check) plus manual browser testing via `bun run dev`.

## Global Constraints

- No semicolons, single quotes — match existing file style exactly (this codebase's existing files have neither Prettier nor semicolons; follow the files you're editing).
- Icon imports use the `XxxIcon` named export from `@phosphor-icons/react` (e.g. `ArrowsOutSimpleIcon`, `ArrowsInSimpleIcon`) — this is the current, non-deprecated export form already used in `HeaderChatbot.tsx`.
- No backend changes. No changes to `MobileTabBar.tsx`.
- No automated tests exist for the chatbot; do not add a test framework. Verify with `bun run build` (from `apps/frontend`) for type-correctness and manual testing via `bun run dev`.
- Cross-folder imports use the `@components/...` / `@pages/...` / `@api` / `@hooks/...` aliases (see any existing file, e.g. `RootLayout.tsx`); same-folder imports stay relative (`./File`).

---

### Task 1: Extract shared chat hook and presentational components; refactor the floating widget to use them

**Files:**
- Create: `frontend/src/components/features/chatbot/useChatConversation.ts`
- Create: `frontend/src/components/features/chatbot/ChatMessagesList.tsx`
- Create: `frontend/src/components/features/chatbot/ChatInputBar.tsx`
- Modify: `frontend/src/components/features/chatbot/ChatComunication.tsx` (full rewrite, currently 194 lines)

**Interfaces:**
- Produces: `useChatConversation(): { messages: Message[]; sessionId: string | null; inputValue: string; setInputValue: (v: string) => void; isPending: boolean; bottomRef: RefObject<HTMLDivElement | null>; handleNewChat: () => void; handleSelectSession: (id: string) => void; handleSend: () => void; handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void }`
- Produces: `export type Message = { id: number; message: string; time: string; isBot: boolean }` (from `useChatConversation.ts`)
- Produces: `<ChatMessagesList messages={Message[]} isPending={boolean} bottomRef={RefObject<HTMLDivElement | null>} />`
- Produces: `<ChatInputBar inputValue={string} onChange={(v: string) => void} onSend={() => void} onKeyDown={(e) => void} isPending={boolean} />`
- Consumes: existing `HeaderChatbot` unchanged in this task (`activeSessionId`, `onNewChat`, `onSelectSession` props only — `variant` prop doesn't exist yet, added in Task 2).

This task is a **pure behavior-preserving refactor** — the floating widget must look and behave identically after it.

- [ ] **Step 1: Create the shared conversation hook**

Create `frontend/src/components/features/chatbot/useChatConversation.ts`:

```ts
import { invalidateGetAllChatSessions, useAskChatbot, useGetChatSessionMessages } from '@api'
import { ChatRole } from '@api/schemas'
import { useQueryClient } from '@tanstack/react-query'
import type * as React from 'react'
import { useEffect, useRef, useState } from 'react'

export type Message = {
  id: number
  message: string
  time: string
  isBot: boolean
}

const SESSION_STORAGE_KEY = 'chatbotSessionId'

const formatTime = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

export const useChatConversation = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(() =>
    typeof localStorage === 'undefined' ? null : localStorage.getItem(SESSION_STORAGE_KEY),
  )

  const [inputValue, setInputValue] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { mutate: askChatbot, isPending } = useAskChatbot()

  const { data: history, isError: historyError } = useGetChatSessionMessages(sessionId ?? '', {
    query: { enabled: !!sessionId },
  })

  // Hydrate a previously-started conversation once its history loads.
  useEffect(() => {
    if (history) {
      setMessages(
        history.map((m, i) => ({
          id: i,
          message: m.content,
          time: '',
          isBot: m.role === ChatRole.Bot,
        })),
      )
    }
  }, [history])

  // Session was deleted or belongs to someone else (e.g. after logging in as a different user) — start fresh.
  useEffect(() => {
    if (historyError) {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      setSessionId(null)
      setMessages([])
    }
  }, [historyError])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isPending])

  const handleNewChat = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setSessionId(null)
    setMessages([])
  }

  const handleSelectSession = (id: string) => {
    if (id === sessionId) return
    setMessages([])
    setSessionId(id)
    localStorage.setItem(SESSION_STORAGE_KEY, id)
  }

  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isPending) return

    const userMessage: Message = {
      id: Date.now(),
      message: trimmed,
      time: formatTime(),
      isBot: false,
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    askChatbot(
      {
        data: { idSectionMessage: sessionId, prompt: trimmed },
      },
      {
        onSuccess: (response) => {
          if (response.sessionId !== sessionId) {
            setSessionId(response.sessionId)
            localStorage.setItem(SESSION_STORAGE_KEY, response.sessionId)
            invalidateGetAllChatSessions(queryClient)
          }
          const botMessage: Message = {
            id: Date.now() + 1,
            message: response.message,
            time: formatTime(),
            isBot: true,
          }
          setMessages((prev) => [...prev, botMessage])
        },
        onError: () => {
          const errorMessage: Message = {
            id: Date.now() + 1,
            message: 'Please try again!',
            time: formatTime(),
            isBot: true,
          }
          setMessages((prev) => [...prev, errorMessage])
        },
      },
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  return {
    messages,
    sessionId,
    inputValue,
    setInputValue,
    isPending,
    bottomRef,
    handleNewChat,
    handleSelectSession,
    handleSend,
    handleKeyDown,
  }
}
```

This is a line-for-line move of the state/effects/handlers currently in `ChatComunication.tsx` (lines 19–127) — no logic changes.

- [ ] **Step 2: Create the shared messages-list component**

Create `frontend/src/components/features/chatbot/ChatMessagesList.tsx`:

```tsx
import { Loader } from '@mantine/core'
import { Leaf } from '@phosphor-icons/react'
import type { RefObject } from 'react'
import ChatBanner from './ChatBanner'
import MessageBox from './MessageBox'
import type { Message } from './useChatConversation'

interface ChatMessagesListProps {
  messages: Message[]
  isPending: boolean
  bottomRef: RefObject<HTMLDivElement | null>
}

const ChatMessagesList = ({ messages, isPending, bottomRef }: ChatMessagesListProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 opacity-90">
        <ChatBanner />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <MessageBox key={msg.id} message={msg.message} time={msg.time} isBot={msg.isBot} />
      ))}

      {/* Typing indicator */}
      {isPending && (
        <div className="flex items-end gap-3 mt-2 animate-pulse">
          <div className="mb-1 shrink-0 bg-linear-to-br from-green-100 to-emerald-200 border-2 border-white shadow-sm rounded-full w-8 h-8 flex items-center justify-center">
            <Leaf weight="fill" color="#059669" size={16} />
          </div>
          <div className="px-3 py-2 rounded-lg rounded-bl-sm bg-white border border-green-100 text-gray-500 shadow-xs flex gap-1 items-center">
            <Loader size="xs" color="teal" type="dots" />
          </div>
        </div>
      )}
      <div ref={bottomRef} className="h-1" />
    </div>
  )
}

export default ChatMessagesList
```

- [ ] **Step 3: Create the shared input bar component**

Create `frontend/src/components/features/chatbot/ChatInputBar.tsx`:

```tsx
import { TextInput, Tooltip } from '@mantine/core'
import { PaperPlaneRight } from '@phosphor-icons/react'
import type * as React from 'react'

interface ChatInputBarProps {
  inputValue: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isPending: boolean
}

const ChatInputBar = ({ inputValue, onChange, onSend, onKeyDown, isPending }: ChatInputBarProps) => (
  <TextInput
    classNames={{
      input: 'bg-gray-50 border-gray-200 focus:border-green-400 rounded-md',
    }}
    placeholder="Ask me about eco-friendly living..."
    value={inputValue}
    onChange={(e) => onChange(e.currentTarget.value)}
    onKeyDown={onKeyDown}
    disabled={isPending}
    rightSection={
      <Tooltip label="Send" withArrow>
        {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
        {/** biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
        <div
          className={`flex items-center justify-center w-10 h-10 mr-2 rounded-lg transition-all duration-200 ${
            isPending || !inputValue.trim()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 text-white cursor-pointer hover:bg-green-600 hover:scale-105 hover:shadow-md'
          }`}
          onClick={onSend}
        >
          <PaperPlaneRight weight="fill" size={18} />
        </div>
      </Tooltip>
    }
    rightSectionWidth={56}
  />
)

export default ChatInputBar
```

- [ ] **Step 4: Refactor `ChatComunication.tsx` to use the hook and shared components**

Replace the full contents of `frontend/src/components/features/chatbot/ChatComunication.tsx`:

```tsx
import HeaderChatbot from './HeaderChatbot'
import ChatInputBar from './ChatInputBar'
import ChatMessagesList from './ChatMessagesList'
import { useChatConversation } from './useChatConversation'

const ChatComunication = () => {
  const {
    messages,
    sessionId,
    inputValue,
    setInputValue,
    isPending,
    bottomRef,
    handleNewChat,
    handleSelectSession,
    handleSend,
    handleKeyDown,
  } = useChatConversation()

  return (
    <div className="fixed flex flex-col justify-between bottom-24 right-6 lg:bottom-10 lg:right-10 text-sm rounded-lg bg-white shadow-lg z-50 border border-border w-[380px] max-w-[calc(100vw-48px)] h-[560px] max-h-[calc(100vh-120px)] overflow-hidden">
      <HeaderChatbot activeSessionId={sessionId} onNewChat={handleNewChat} onSelectSession={handleSelectSession} />

      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50/50 custom-scrollbar scroll-smooth">
        <ChatMessagesList messages={messages} isPending={isPending} bottomRef={bottomRef} />
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <ChatInputBar
          inputValue={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          isPending={isPending}
        />
      </div>
    </div>
  )
}

export default ChatComunication
```

- [ ] **Step 5: Type-check**

Run (from `apps/frontend`): `bun run build`
Expected: exits 0, no TypeScript errors. If `MessageBox`/`ChatBanner` prop mismatches appear, fix the props passed in `ChatMessagesList.tsx` to match `MessageBox.tsx`'s existing `MessageBoxProps` (`message: string; time: string; isBot: boolean; avatar?: string`) — do not change `MessageBox.tsx` itself.

- [ ] **Step 6: Manual regression check**

Run: `bun run dev` (from `apps/frontend`), open the storefront in a browser.
1. Click the chat bubble (bottom-right) to open the floating widget — it must look pixel-identical to before.
2. Send a message, confirm the bot reply appears and the typing indicator shows while pending.
3. Refresh the page — history must still load (same session persisted via `chatbotSessionId` in localStorage).
4. Click "New chat" (`ChatCircleTextIcon`) — messages clear, a new session starts on next send.
5. Open the chat-history menu (`ClockCounterClockwiseIcon`) — past sessions still list and are selectable.

Expected: all behavior identical to pre-refactor. Any deviation means the refactor introduced a regression — fix before continuing.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/features/chatbot/useChatConversation.ts frontend/src/components/features/chatbot/ChatMessagesList.tsx frontend/src/components/features/chatbot/ChatInputBar.tsx frontend/src/components/features/chatbot/ChatComunication.tsx
git commit -m "refactor(chatbot): extract useChatConversation hook and shared chat UI pieces"
```

---

### Task 2: Add the `/eco-assistant` full-page route, nav tab, and `HeaderChatbot` page variant

**Files:**
- Modify: `frontend/src/components/features/chatbot/HeaderChatbot.tsx:18-126`
- Create: `frontend/src/pages/client/static/EcoAssistantPage.tsx`
- Modify: `frontend/src/router/index.tsx:18-19` (import) and `:125-126` (route)
- Modify: `frontend/src/components/features/Navigation.tsx:21-26`

**Interfaces:**
- Consumes: `useChatConversation()`, `<ChatMessagesList />`, `<ChatInputBar />` from Task 1 (unchanged signatures).
- Produces: `<HeaderChatbot variant?: 'floating' | 'page' = 'floating' ... />` — new optional prop; existing call sites (`ChatComunication.tsx`) keep compiling unchanged since it defaults to `'floating'`.
- Produces: route `/eco-assistant` rendering `EcoAssistantPage`.

- [ ] **Step 1: Add the `variant` prop to `HeaderChatbot`**

Replace the full contents of `frontend/src/components/features/chatbot/HeaderChatbot.tsx`:

```tsx
/** biome-ignore-all lint/a11y/useButtonType: <> */

import { invalidateGetAllChatSessions, useDeleteChatSession, useGetAllChatSessions } from '@api'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { ActionIcon, Menu, ScrollArea, Text, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  ArrowsInSimpleIcon,
  ChatCircleTextIcon,
  ClockCounterClockwiseIcon,
  Leaf,
  TrashIcon,
} from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { setIsShow } from './chatbot.slice'

interface HeaderChatbotProps {
  activeSessionId: string | null
  onNewChat: () => void
  onSelectSession: (id: string) => void
  variant?: 'floating' | 'page'
}

const HeaderChatbot = ({ activeSessionId, onNewChat, onSelectSession, variant = 'floating' }: HeaderChatbotProps) => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { data: sessions = [] } = useGetAllChatSessions()

  const { mutate: deleteSession } = useDeleteChatSession({
    mutation: {
      onSuccess: (_data, variables) => {
        invalidateGetAllChatSessions(queryClient)
        if (variables.id === activeSessionId) onNewChat()
      },
      onError: () => notifications.show({ title: 'Error', message: 'Could not delete conversation.', color: 'red' }),
    },
  })

  return (
    <header className="flex justify-between items-center px-4 py-3 bg-linear-to-r from-green-50 to-emerald-100 rounded-t-lg border-b border-green-200/50">
      <div className="flex items-center gap-2">
        <div className="bg-linear-to-br from-green-500 to-emerald-600 p-1.5 rounded-full text-white shadow-sm">
          <Leaf weight="fill" size={16} />
        </div>
        <span className="font-bold text-gray-800 tracking-tight">Eco Assistant</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Menu shadow="lg" width={280} position="bottom-end" radius="md" withArrow>
          <Menu.Target>
            <Tooltip label="Chat history" withArrow>
              <button className="cursor-pointer text-gray-600 hover:text-green-700 hover:bg-green-200/50 transition-all rounded-full p-1.5">
                <ClockCounterClockwiseIcon size={18} weight="bold" />
              </button>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <ScrollArea.Autosize mah={260}>
              {sessions.length === 0 ? (
                <Menu.Item disabled className="text-center py-4 text-gray-500">
                  No previous conversations
                </Menu.Item>
              ) : (
                sessions.map((session) => (
                  <Menu.Item
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className={`transition-colors ${session.id === activeSessionId ? 'bg-green-50/50 border-l-2 border-green-500' : 'hover:bg-gray-50'}`}
                    rightSection={
                      <ActionIcon
                        component="span"
                        size="sm"
                        variant="subtle"
                        color="red"
                        className="hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession({ id: session.id })
                        }}
                      >
                        <TrashIcon size={14} weight="bold" />
                      </ActionIcon>
                    }
                  >
                    <Text
                      size="sm"
                      fw={session.id === activeSessionId ? 600 : 500}
                      c={session.id === activeSessionId ? 'green.8' : 'dark.7'}
                      truncate
                    >
                      {session.title}
                    </Text>
                    <Text size="10px" c="dimmed" mt={2}>
                      {dayjs(session.createdAt).format('DD MMM, HH:mm')}
                    </Text>
                  </Menu.Item>
                ))
              )}
            </ScrollArea.Autosize>
          </Menu.Dropdown>
        </Menu>

        <Tooltip label="New chat" withArrow>
          <button
            onClick={onNewChat}
            className="cursor-pointer text-gray-600 hover:text-green-700 hover:bg-green-200/50 transition-all rounded-full p-1.5"
          >
            <ChatCircleTextIcon size={18} />
          </button>
        </Tooltip>

        {variant === 'floating' && (
          <Tooltip label="Hide chatbot" withArrow>
            <button
              onClick={(e) => {
                e.stopPropagation()
                dispatch(setIsShow(false))
              }}
              className="cursor-pointer text-gray-600 hover:text-green-700 hover:bg-green-200/50 transition-all rounded-full p-1.5"
            >
              <ArrowsInSimpleIcon size={18} weight="bold" />
            </button>
          </Tooltip>
        )}
      </div>
    </header>
  )
}

export default HeaderChatbot
```

(Only change from the current file: the new `variant` prop, and the "Hide chatbot" button now wrapped in `{variant === 'floating' && (...)}`. The Maximize button is added in Task 3, not here.)

- [ ] **Step 2: Create `EcoAssistantPage.tsx`**

Create `frontend/src/pages/client/static/EcoAssistantPage.tsx`:

```tsx
import ChatInputBar from '@components/features/chatbot/ChatInputBar'
import ChatMessagesList from '@components/features/chatbot/ChatMessagesList'
import HeaderChatbot from '@components/features/chatbot/HeaderChatbot'
import { useChatConversation } from '@components/features/chatbot/useChatConversation'
import PageBreadcrumbs from '@components/ui/PageBreadcrumbs'
import Container from '@components/ui/primitives/Container'
import Seo from '@components/ui/Seo'

const EcoAssistantPage = () => {
  const {
    messages,
    sessionId,
    inputValue,
    setInputValue,
    isPending,
    bottomRef,
    handleNewChat,
    handleSelectSession,
    handleSend,
    handleKeyDown,
  } = useChatConversation()

  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: 'Eco Assistant', href: '/eco-assistant' },
  ]

  return (
    <Container width="page" className="py-6">
      <Seo title="Eco Assistant - Green Cart" />
      <PageBreadcrumbs items={breadcrumbItems} mb="sm" />

      <div className="flex flex-col rounded-lg bg-white shadow-lg border border-border overflow-hidden h-[calc(100vh-220px)] min-h-[480px]">
        <HeaderChatbot
          variant="page"
          activeSessionId={sessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
        />

        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50/50 custom-scrollbar scroll-smooth">
          <ChatMessagesList messages={messages} isPending={isPending} bottomRef={bottomRef} />
        </div>

        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
          <ChatInputBar
            inputValue={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            onKeyDown={handleKeyDown}
            isPending={isPending}
          />
        </div>
      </div>
    </Container>
  )
}

export default EcoAssistantPage
```

- [ ] **Step 3: Wire the route**

In `frontend/src/router/index.tsx`, add the import after line 18 (`import ContactPage from '@pages/client/static/ContactPage'`), keeping the existing alphabetical order of the static-page imports:

```ts
import EcoAssistantPage from '@pages/client/static/EcoAssistantPage'
```

Then add the route entry right after the `/contact` route (currently line 125, `{ path: '/contact', element: <ContactPage /> },`):

```ts
{ path: '/eco-assistant', element: <EcoAssistantPage /> },
```

The surrounding block should read:

```ts
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/eco-assistant', element: <EcoAssistantPage /> },
      { path: '/faq', element: <FaqPage /> },
```

- [ ] **Step 4: Add the nav tab**

In `frontend/src/components/features/Navigation.tsx`, replace the `navigationItems` array (lines 21–26):

```ts
const navigationItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/faq', label: 'FAQ' },
  { path: '/contact', label: 'Contact' },
  { path: '/eco-assistant', label: 'Eco Assistant' },
]
```

This array drives both the desktop nav (`Navigation.tsx:151-166`) and the mobile drawer menu (`Navigation.tsx:284-297`) — no further changes needed for the tab to appear on mobile too.

- [ ] **Step 5: Type-check**

Run (from `apps/frontend`): `bun run build`
Expected: exits 0, no TypeScript errors.

- [ ] **Step 6: Manual verification**

Run: `bun run dev`, open the storefront.
1. Confirm "Eco Assistant" appears in the desktop nav bar right after "Contact".
2. Shrink the window / open on mobile width, open the hamburger menu — confirm "Eco Assistant" appears in the drawer, also right after "Contact".
3. Click the "Eco Assistant" tab — lands on `/eco-assistant`, page renders a large chat panel (header, empty-state banner, input bar).
4. Send a message on the page — bot responds, message persists on refresh.
5. Open the floating chat bubble on a *different* page (e.g. Home) — confirm it shows the **same conversation** you just had on `/eco-assistant` (same messages, same session).
6. On `/eco-assistant`, confirm the header shows only the history and new-chat icons — no "Hide chatbot" icon (since `variant="page"` hides it).

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/features/chatbot/HeaderChatbot.tsx frontend/src/pages/client/static/EcoAssistantPage.tsx frontend/src/router/index.tsx frontend/src/components/features/Navigation.tsx
git commit -m "feat(chatbot): add full-page Eco Assistant tab next to Contact"
```

---

### Task 3: Add the Maximize button to the floating chat widget

**Files:**
- Modify: `frontend/src/components/features/chatbot/HeaderChatbot.tsx` (from Task 2's version)

**Interfaces:**
- Consumes: `variant` prop from Task 2 (`'floating' | 'page'`), `setIsShow` action from `./chatbot.slice` (already imported), `useNavigate` from `react-router`.
- No new exports — this is additive UI inside the existing component.

- [ ] **Step 1: Add the Maximize button**

In `frontend/src/components/features/chatbot/HeaderChatbot.tsx`:

Add `ArrowsOutSimpleIcon` to the `@phosphor-icons/react` import block and add a `useNavigate` import:

```ts
import {
  ArrowsInSimpleIcon,
  ArrowsOutSimpleIcon,
  ChatCircleTextIcon,
  ClockCounterClockwiseIcon,
  Leaf,
  TrashIcon,
} from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'
import { setIsShow } from './chatbot.slice'
```

Inside the component, add the navigate hook alongside the existing `dispatch`/`queryClient` declarations:

```ts
const HeaderChatbot = ({ activeSessionId, onNewChat, onSelectSession, variant = 'floating' }: HeaderChatbotProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: sessions = [] } = useGetAllChatSessions()
```

Insert a new Maximize button between the existing "New chat" button and the `variant === 'floating'` "Hide chatbot" block:

```tsx
        {variant === 'floating' && (
          <Tooltip label="Full screen" withArrow>
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate('/eco-assistant')
                dispatch(setIsShow(false))
              }}
              className="cursor-pointer text-gray-600 hover:text-green-700 hover:bg-green-200/50 transition-all rounded-full p-1.5"
            >
              <ArrowsOutSimpleIcon size={18} weight="bold" />
            </button>
          </Tooltip>
        )}

        {variant === 'floating' && (
          <Tooltip label="Hide chatbot" withArrow>
            <button
              onClick={(e) => {
                e.stopPropagation()
                dispatch(setIsShow(false))
              }}
              className="cursor-pointer text-gray-600 hover:text-green-700 hover:bg-green-200/50 transition-all rounded-full p-1.5"
            >
              <ArrowsInSimpleIcon size={18} weight="bold" />
            </button>
          </Tooltip>
        )}
```

- [ ] **Step 2: Type-check**

Run (from `apps/frontend`): `bun run build`
Expected: exits 0, no TypeScript errors.

- [ ] **Step 3: Manual verification**

Run: `bun run dev`, open the storefront.
1. Open the floating chat widget, send a message.
2. Click the new "Full screen" icon (between "New chat" and "Hide chatbot").
3. Expected: browser navigates to `/eco-assistant`, the floating widget is gone (no longer rendered — only the launcher bubble would show if you were to leave this page), and the full page shows the message you just sent.
4. Navigate to another page (e.g. Home) — the floating launcher bubble reappears normally and can be reopened.
5. Confirm the "Full screen" icon does **not** appear in the header when on `/eco-assistant` itself (that header uses `variant="page"`, added in Task 2).

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/features/chatbot/HeaderChatbot.tsx
git commit -m "feat(chatbot): add maximize button to floating widget, links to Eco Assistant page"
```
