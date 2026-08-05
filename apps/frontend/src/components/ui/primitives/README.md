# Sizing law

Every page in this app is judged against this table. If a class isn't in this table
or in the "banned" list below, don't add it without checking here first.

| Role | Class | px |
|---|---|---|
| Storefront page title | `text-2xl font-semibold` | 20 |
| Home hero title (only exception) | `text-3xl md:text-4xl font-semibold` | 24/28 |
| Section heading | `text-xl font-semibold` | 18 |
| Card / product title | `text-md font-medium` | 15 |
| Body | `text-base` | 14 |
| Meta, caption, chip | `text-xs` | 12 |
| Admin `th` | `text-2xs uppercase tracking-[0.04em]` | 11 |
| Admin `td` | `text-xs` | 12 |
| Section rhythm | `py-section` | 40 |
| Panel padding | storefront `p-5` / admin `p-4` | 20 / 16 |
| Card & panel radius | `rounded-lg` | 8 |
| Input & button radius | `rounded-md` | 6 |
| Catalog grid gap | `gap-x-5 gap-y-8` | 20 / 32 |
| Empty state | `py-10`, icon circle 48 | |
| Icons | storefront 16 · admin 14 · header 20 | |
| Buttons | admin `size="xs"` 30 · storefront `size="sm"` 36 · CTA `size="md"` 42 | |

**Banned:** `py-16`, `py-20`, `py-24`, `rounded-3xl`, `text-4xl`+ outside the home hero,
`font-black`, `size-100`, `shadow-2xl`, `group-hover:scale-150`, `hover:-translate-y-1`,
`lg:grid-cols-2` on a product grid, and any `!` in a Tailwind class.

## Where the numbers come from

The scale lives in two places that read the same `--ds-*` CSS variables (`src/index.css`):

- Tailwind's `@theme inline` block — controls `text-*`, `radius-*`, `spacing-*`, `shadow-*` utilities.
- Mantine's `createTheme` in `src/main.tsx` — `fontSizes`, `spacing`, `radius`, `shadows`,
  `headings`, and per-component `defaultProps`/`styles`.

Changing a value in `:root` in `index.css` moves both systems at once.

## Primitives in this folder

Reach for these before writing raw Tailwind/Mantine markup:

- `Container`, `Section` — page width and vertical rhythm (the `py-16` killer).
- `Toolbar`, `ProductGrid` — catalog/list layout chokepoints.
- `Panel`, `PageHeader`, `SectionHeading`, `PriceTag`, `EmptyState`, `Stat`, `Prose` — shared content primitives.
- `ConfirmModal` — replaces hand-rolled delete modals and native `confirm()`.
- `DataTable`, `RowActions`, `SkeletonRows` — admin list pages.
- `FormPanel`, `FormGrid` — admin create/edit pages (form-library-agnostic — works with `@mantine/form` or `react-hook-form`).
- `StatCard`, `AdminPageShell` — admin dashboard and page chrome.
