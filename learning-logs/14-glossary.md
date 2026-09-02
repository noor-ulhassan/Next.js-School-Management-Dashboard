# 14 - Glossary

One line each. Terms as they are used in this project and these logs.

## Next.js / routing

- **App Router** - Next.js's routing system based on `src/app/`; folders are URLs. This
  repo uses it (not the older Pages Router).
- **Segment** - one folder in a route path; becomes one part of the URL.
- **`page.tsx`** - makes a folder a visitable page.
- **`layout.tsx`** - wraps every page at or below its folder; does not re-render on
  navigation.
- **Route group** - a folder in `(parens)`; shares a layout without adding to the URL.
  Here: `(dashboard)`.
- **Dynamic segment** - a folder in `[brackets]`; matches any value and passes it as
  `params`. Here: `list/teachers/[id]`.
- **`children` prop** - the nested page/layout that a layout renders inside itself.
- **`metadata`** - an exported object that Next puts in `<head>` (title, description).
- **`next/image` (`<Image>`)** - optimised images; needs `width`/`height`; remote hosts
  must be listed in `next.config.mjs`.
- **`next/link` (`<Link>`)** - client-side navigation, no full reload.
- **`next/font`** - build-time self-hosted fonts; here `Inter`.
- **`next/dynamic`** - lazy-load a component as a separate JS chunk; used in `FormModal`.
- **`loading.tsx` / `error.tsx` / `not-found.tsx`** - reserved files for pending, error,
  and 404 UI per segment. Not used yet.
- **`middleware.ts`** - code that runs before a request resolves; the place for auth
  redirects. Not present yet.

## React

- **Component** - a function returning JSX.
- **Props** - read-only inputs to a component.
- **JSX** - HTML-shaped syntax compiled to function calls; `{}` embeds JS.
- **Fragment (`<>...</>`)** - group siblings without a wrapper element.
- **State (`useState`)** - data that re-renders the component when it changes; client
  only.
- **Hook** - a `use*` function (`useState`, `useForm`, ...); only valid in client
  components.
- **Server Component** - default; renders on the server; can be `async`; no hooks/events.
- **Client Component** - file starts with `"use client"`; hydrates and runs in the
  browser.
- **Hydration** - the browser attaching interactivity to server-rendered HTML.
- **Render prop** - passing a function as a prop that returns JSX; here `Table`'s
  `renderRow`.
- **`key`** - stable unique id on each item in a rendered list.
- **Controlled input** - React state is the value source (`value` + `onChange`).
- **Uncontrolled input** - the DOM holds the value (`defaultValue`); react-hook-form
  uses this.

## Styling

- **Tailwind** - utility-first CSS; classes like `p-4`, `flex`, `bg-lamaSky` in
  `className`.
- **`content` (Tailwind config)** - the file globs Tailwind scans; classes in unscanned
  files are purged.
- **`theme.extend`** - add to Tailwind's defaults (vs replacing them).
- **`lama*` colours** - the custom palette (`lamaSky`, `lamaPurple`, `lamaYellow` + Light
  variants) in `tailwind.config.ts`.
- **Breakpoint prefix** - `md:` / `lg:` / `xl:`; applies a class from that width up
  (mobile-first).
- **Arbitrary value** - `w-[14%]`, `h-[450px]`; an exact value in square brackets.
- **State variant** - `hover:`, `even:`, `odd:`, `disabled:`; class applies only in that
  state.
- **`globals.css`** - the one global stylesheet; holds `@tailwind` directives + hand
  overrides for `react-calendar`.

## Forms

- **react-hook-form (RHF)** - form-state library using uncontrolled inputs.
- **`register(name)`** - RHF function; spread onto an `<input>` to connect it.
- **`handleSubmit(fn)`** - RHF wrapper; validates, then calls `fn` only if valid.
- **`formState.errors`** - RHF's per-field validation errors.
- **zod** - schema validation library; `z.object({...})`, `z.string().min()`, `z.enum()`.
- **`z.infer<typeof schema>`** - the TypeScript type derived from a zod schema.
- **`zodResolver`** - adapter (`@hookform/resolvers/zod`) letting RHF validate with zod.
- **`FieldError`** - RHF's error type, imported in `InputField`.

## Charts

- **recharts** - React SVG chart library; all chart components are `"use client"`.
- **`ResponsiveContainer`** - fills the parent; the parent must have an explicit height.
- **`dataKey`** - which field of a data row a chart element reads.
- **`<Cell>`** - per-slice styling inside a `<Pie>`.
- **`fill` vs `stroke`** - bars/pies use `fill`; lines use `stroke`.

## Backend / Prisma Next

- **Prisma ORM for Postgres / "Prisma Next"** - the v8 rewrite; contract-based, not
  `schema.prisma` + generated client.
- **Contract** - `src/prisma/contract.prisma`; your models. The heart of the data layer.
- **`contract.json`** - compiled contract, committed like a lockfile.
- **`contract.d.ts`** - generated types for query autocomplete; never edited.
- **`prisma contract emit`** - regenerates `contract.json` + `contract.d.ts` from the
  contract. Script: `npm run contract:emit`.
- **`prisma db init`** - creates the tables in the database.
- **`prisma migration status`** - shows which migrations are applied.
- **`db`** - the client exported from `src/prisma/db.ts`; server-only.
- **`db.orm.public.<Model>`** - `public` is the Postgres schema/namespace; the entry
  point for queries.
- **`DATABASE_URL`** - Postgres connection string in `.env`; needs Postgres 15+.
- **`prisma.config.ts`** - points the Prisma CLI at the contract and the DB.
- **ORM** - Object-Relational Mapper; lets you query the database in typed code instead
  of raw SQL.
- **Migration** - a recorded, replayable schema change.
- **Seed** - a script that loads initial rows into a fresh database.

## TypeScript

- **Path alias `@/*`** - maps to `./src/*` (from `tsconfig.json`); why imports read
  `@/components/...`.
- **Union of string literals** - `"create" | "update" | "delete"`; value must be exactly
  one.
- **Optional property `?`** - `data?: any`; may be `undefined`.
- **Generic** - a type parameter, e.g. `Table<T>` or `postgres<Contract>()`.
- **Non-null assertion `!`** - `process.env['X']!`; "trust me, not null/undefined".
- **Optional chaining `?.`** - `data?.username`; short-circuits to `undefined`.

## Not in the repo yet (you will meet these in file 13)

- **Server Action** - a `"use server"` function a form can call directly to mutate data.
- **`revalidatePath` / `revalidateTag`** - refresh cached server data after a mutation.
- **`useActionState` / `useFormStatus`** - client hooks for Server Action pending/result
  state.
- **`useOptimistic`** - show a change before the server confirms it.
- **`searchParams`** - a Server Component prop holding the URL query; drives real
  pagination/search.
