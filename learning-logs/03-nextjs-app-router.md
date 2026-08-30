# 03 - Next.js App Router

Everything here is taught through files that exist in this repo. The App Router lives in
`src/app/`.

## The core idea: folders are routes

Inside `src/app/`:

- A folder becomes a URL segment.
- A `page.tsx` in that folder makes the folder a real, visitable page.
- A `layout.tsx` wraps every page at or below its folder.
- Special filenames (`loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`) have
  reserved meanings. This repo uses none of them yet - see file 13.

Examples from this project:

| Folder path | URL |
|-------------|-----|
| `src/app/page.tsx` | `/` |
| `src/app/sign-In/page.tsx` | `/sign-In` |
| `src/app/(dashboard)/admin/page.tsx` | `/admin` |
| `src/app/(dashboard)/list/teachers/page.tsx` | `/list/teachers` |
| `src/app/(dashboard)/list/teachers/[id]/page.tsx` | `/list/teachers/1`, `/list/teachers/2`, ... |

## Layouts

### Root layout - `src/app/layout.tsx`

Required. It renders the `<html>` and `<body>` tags for the whole app. It also:

- imports `./globals.css` (the only place global CSS is loaded),
- sets up the `Inter` font with `next/font/google` and applies it via
  `className={inter.className}` on `<body>`,
- exports `metadata` (`title`, `description`) which Next puts in `<head>`.

Its `children` prop is whatever page (or nested layout) the user navigated to.

```tsx
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### Nested layout - `src/app/(dashboard)/layout.tsx`

Wraps every screen under `(dashboard)`. It renders the persistent shell:

```
<div class="h-screen flex">
  left  14-16% : logo + <Menu/>
  right 84-86% : <Navbar/> + {children}
</div>
```

Key behaviour: **layouts do not re-render on navigation.** Move from `/admin` to
`/list/teachers` and the sidebar and navbar stay mounted; only `{children}` swaps. That
is why shared chrome goes in a layout, not repeated in every page.

## Route groups - the `(dashboard)` folder

Parentheses around a folder name mean "group these routes so they can share a layout,
but do not add this folder to the URL." So `(dashboard)/admin/page.tsx` is `/admin`, not
`/dashboard/admin`. Login (`sign-In`) is deliberately outside the group so it does not
get the sidebar.

## Dynamic segments - `[id]`

`list/teachers/[id]/page.tsx` matches any single segment there: `/list/teachers/42`. The
value is handed to the page as `params`:

```tsx
// how it SHOULD look once wired up
export default async function SingleTeacherPage({ params }: { params: { id: string } }) {
  const teacher = await db.orm.public.Teacher.where({ id: Number(params.id) }).first();
  ...
}
```

**Right now the repo does not do this.** `SingleTeacherPage` and `SingleStudentPage`
ignore `params` entirely and show hardcoded names ("Leonard Snyder", "Cameron Moran").
Reading the param and fetching the record is a file-13 task.

## Server Components vs Client Components

This is the concept that trips everyone up. Learn it here.

### Server Components (the default)

Any component whose file does **not** start with `"use client"`. In this repo that is:
`layout.tsx` files, every `page.tsx` except none-are-client, `Menu`, `Navbar`,
`UserCard`, `Table`, `TableSearch`, `Pagination`, `InputField`, `Announcements`,
`EventList`.

They render on the server. They can be `async` and fetch data directly. They ship zero
JavaScript for themselves to the browser. They cannot use `useState`, `useEffect`,
`onClick`, or any browser API.

### Client Components

Files that start with `"use client"`. In this repo:
`FormModal`, `forms/TeacherForm`, `forms/StudentForm`, `CountChart`, `AttendanceChart`,
`FinanceChart`, `Performance`, `EventCalendar`, `BigCalendar`.

They render on the server once (for the initial HTML) and then "hydrate" and run in the
browser. They can use hooks, event handlers, and browser-only libraries. Why each of the
above is a client component:

- charts + `EventCalendar` - recharts and react-calendar measure the DOM, browser only.
- `FormModal` - `useState` for open/closed, `onClick`.
- the forms - react-hook-form uses hooks.
- `BigCalendar` - `useState` for the active day tab.

### The boundary rule

A Server Component may import and render a Client Component (a page renders `<FormModal/>`).
A Client Component may **not** import a Server Component - but it can receive one as
`children` or another prop. Keep `"use client"` as deep in the tree as possible so most
of the app stays server-rendered.

## `next/image` and `next/link`

- `<Image src="/logo.png" width={32} height={32} alt="Logo" />` - optimises images,
  requires `width`/`height` (or `fill`). **Remote hosts must be allowlisted** in
  `next.config.mjs`. This repo allows `images.pexels.com` (the fake avatars). Add hosts
  there or the image 500s.
- `<Link href="/list/teachers">` - client-side navigation, no full page reload.

## `next/font/google`

`const inter = Inter({ subsets: ["latin"] })` downloads and self-hosts the font at build
time (no request to Google at runtime, no layout shift). Applied through
`inter.className`.

## Metadata

`export const metadata: Metadata = { title, description }` from a layout or page. Next
injects it into `<head>`. The root layout and `(dashboard)/layout.tsx` both export it in
this repo (the nested one is redundant but harmless).

## Scripts (`package.json`)

- `npm run dev` - dev server with hot reload (`next dev`).
- `npm run build` - production build (`next build`).
- `npm run start` - serve the production build (`next start`).
- `npm run lint` - ESLint (`next lint`).

## Known smells in this repo's routing

- `src/app/sign-In/` has a capital `I`, so the URL is `/sign-In` (case-sensitive). Should
  be `sign-in`.
- There is no `(dashboard)/page.tsx`, so visiting `/` hits the root `src/app/page.tsx`
  which just says "Homepage". No redirect to a role dashboard.
- `[id]` pages exist but don't use the id.
- No `loading.tsx` / `error.tsx` / `not-found.tsx` anywhere.
