# Eco Assistant full-page chat tab — Design

**Date:** 2026-08-07
**Status:** Approved

## Problem

The client-facing chatbot only exists as a small floating widget (`ChatComunication.tsx`, 380×560px fixed card). Users find the chat window too small for a real conversation. There is no dedicated full-page place to chat with the Eco Assistant.

## Goals

1. Add a new nav tab **"Eco Assistant"**, positioned right after **Contact** in the main navigation, linking to a full-page chat experience.
2. Add a **maximize** button to the floating chat widget's header. Clicking it navigates to the Eco Assistant page.
3. The floating widget and the full-page chat share the **same ongoing conversation** (same session/messages) — switching between them is seamless.
4. When the user maximizes, the floating widget **auto-hides** (avoids two overlapping chat UIs on the same page). It reappears normally (as the launcher icon) when the user navigates away from the Eco Assistant page.

## Non-goals

- No backend/API changes. Reuses existing `useAskChatbot`, `useGetChatSessionMessages`, `useGetAllChatSessions`, `useDeleteChatSession` hooks as-is.
- No changes to `MobileTabBar.tsx` (the fixed 5-icon bottom bar on mobile) — out of scope, the user only asked for the tab next to Contact in the main nav (`Navigation.tsx`'s `navigationItems`, shown in both desktop nav and the mobile drawer menu).

## Design

### 1. Route & navigation

- New route `/eco-assistant` → `EcoAssistantPage.tsx`, colocated with the other static pages in `frontend/src/pages/client/static/`.
- `Navigation.tsx`'s `navigationItems` array gets a new entry right after Contact:
  ```ts
  { path: '/contact', label: 'Contact' },
  { path: '/eco-assistant', label: 'Eco Assistant' },
  ```
  This array already drives both the desktop nav bar and the mobile slide-down drawer, so no separate mobile wiring is needed.

### 2. Shared conversation state — `useChatConversation` hook

Currently all chat state (messages, sessionId, input value, send/select/new-chat handlers) is inlined in `ChatComunication.tsx`. To let the floating widget and the full page share one conversation without duplicating logic, this state is extracted into a hook: `frontend/src/components/features/chatbot/useChatConversation.ts`.

Responsibilities (moved verbatim from `ChatComunication.tsx`, behavior unchanged):
- Reads/writes `chatbotSessionId` in `localStorage` (existing key — this is what makes cross-surface sync work for free).
- Manages `messages`, `sessionId`, `inputValue`, `isPending`.
- Exposes `handleSend`, `handleNewChat`, `handleSelectSession`, `handleKeyDown`.
- Hydrates history via `useGetChatSessionMessages`; resets session on `historyError` (stale/foreign session).

`ChatComunication.tsx` and `EcoAssistantPage.tsx` both call this hook — since both read the same `chatbotSessionId` localStorage key and the same backend session, they naturally show the same conversation.

### 3. `HeaderChatbot` gets a `variant` prop

`HeaderChatbot.tsx` gains `variant: 'floating' | 'page'` (default `'floating'`, preserving current behavior).

- `variant="floating"` (used by `ChatComunication.tsx`): unchanged buttons (history, new chat, hide) **plus** a new **Maximize** button.
- `variant="page"` (used by `EcoAssistantPage.tsx`): keeps history + new chat buttons; **omits** "Hide chatbot" and "Maximize" (not meaningful when already full-page).

### 4. Maximize button behavior

New icon button in `HeaderChatbot.tsx` (icon: `ArrowsOutSimpleIcon` from `@phosphor-icons/react`, tooltip "Full screen"), rendered only for `variant="floating"`:

```ts
onClick={() => {
  navigate('/eco-assistant')
  dispatch(setIsShow(false)) // hide the floating widget; ChatIconComp launcher reappears
}}
```

### 5. `EcoAssistantPage.tsx` layout

- `Container width="page"` (1280px, matches other full app pages — wider than the `narrow` 720px used by `ContactPage`).
- Breadcrumbs (`Home / Eco Assistant`) consistent with other static pages.
- A single chat panel reusing `HeaderChatbot` (`variant="page"`), the messages list (same rendering as today: `ChatBanner` empty state, `MessageBox` list, typing indicator), and the same input bar — sized to fill most of the viewport (e.g. `h-[calc(100vh-220px)]` instead of the widget's fixed `560px`).
- No new components needed for message rendering — `ChatBanner`, `MessageBox`, the typing-indicator block, and the input `TextInput` markup are reused as-is (extracted or duplicated minimally as needed to keep `ChatComunication.tsx` and `EcoAssistantPage.tsx` each simple single-purpose components).

## Data flow

```
User types in EITHER surface (floating widget OR /eco-assistant page)
        │
        ▼
useChatConversation() (shared hook, same localStorage session key)
        │
        ▼
useAskChatbot() → backend → same ChatSession
        │
        ▼
Both surfaces show the same messages next time they read the session
```

## Testing / verification

- Manual: open floating widget, send a message, click Maximize → lands on `/eco-assistant` with the same message history, floating widget hidden.
- Manual: from `/eco-assistant`, send another message, navigate to another page, reopen floating widget → same message present.
- Manual: mobile drawer menu shows "Eco Assistant" next to "Contact".
- No automated tests exist for the chatbot today; none added (consistent with existing scope — this is a UI/navigation feature, not new business logic).
