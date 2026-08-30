# 02 - Build Timeline

Read this top to bottom to see how the project grew. Each entry: the commit, the date,
what changed, why, and what it unlocked. Add a new entry after every session.

---

## 2026-08-08 - `dd2cf85` "Starter"

**What:** Output of `create-next-app` (Next 14, TypeScript, Tailwind, ESLint, `src/`
directory, App Router). Plus: all the icon PNGs dropped into `public/`, the full fake
dataset already written in `src/lib/data.ts` (~1000 lines), `src/components/Menu.tsx`
already present, and `tailwind.config.ts` already carrying the `lama*` colour theme.

**Why:** Get a running project and pre-load the assets and data so UI work isn't blocked
by hunting for icons or inventing sample records.

**Unlocked:** `npm run dev` works. Everything after this is building screens.

**Concepts introduced:** the App Router file layout, `layout.tsx` / `page.tsx`,
`public/` for static files, `tsconfig.json` path alias `@/*`.

---

## 2026-08-08 - `30b0c1d` "Dashboard Pages Starter"

**What:** Created the route group `src/app/(dashboard)/` with its own `layout.tsx`, and
placeholder `page.tsx` files for `admin/`, `teacher/`, `student/`, `parent/`. Also
`src/app/sign-In/page.tsx`. Each page was one line of text at this point.

**Why:** Lock in the URL structure before styling anything. Decide up front that all
signed-in screens share one shell (sidebar + navbar) and login sits outside it.

**Unlocked:** `/admin`, `/teacher`, `/student`, `/parent`, `/sign-In` all resolve.

**Concepts introduced:** route groups `(folder)` - they let routes share a `layout.tsx`
without adding `/dashboard` to the path. Nested layouts.

---

## 2026-08-09 - `a13de07` "Menu and Navbar"

**What:** Built `Navbar.tsx`. Extended `Menu.tsx` rendering (the `menuItems` config with
`visible` role arrays). Fleshed out `(dashboard)/layout.tsx` into a two-column shell:
left sidebar `w-[14%] md:w-[8%] lg:w-[16%]` holding the logo + `<Menu/>`, right column
holding `<Navbar/>` + `{children}`. Root `layout.tsx` wired the `Inter` Google font.

**Why:** The shared shell is the frame every dashboard screen sits in; build it once.

**Concepts introduced:** `next/font/google`, `next/link` + `next/image`, responsive
width classes, the `children` prop, `metadata` export.

---

## 2026-08-09 - `cefcc5a` "Navbar | Charts | Menu"

**What:** `UserCard.tsx` (the coloured stat card), `CountChart.tsx` (first recharts
component, a radial bar). Confirmed the `lama*` palette in `tailwind.config.ts`
(`lamaSky`, `lamaPurple`, `lamaYellow` and their `*Light` variants). `admin/page.tsx`
started composing cards and chart slots.

**Why:** Start the admin dashboard - the densest screen - so the reusable pieces
(`UserCard`, chart wrappers) get designed early.

**Concepts introduced:** `"use client"` (recharts needs the browser), `ResponsiveContainer`,
extending the Tailwind theme vs overriding it.

---

## 2026-08-09 - `4c81b07` "Charts Completed"

**What:** `AttendanceChart.tsx` (bar chart) and `FinanceChart.tsx` (line chart). Added
`recharts` to dependencies. `admin/page.tsx` now lays out all three charts.

**Why:** Finish the visual half of the admin dashboard.

**Concepts introduced:** recharts `BarChart`/`LineChart`, styled axes, `Tooltip`,
`Legend`, the "parent needs an explicit height or the chart is invisible" rule.

---

## 2026-08-10 - `830c4aa` "Remove 'Learn More' section from README" and `a188450` "Create Community"

**What:** Housekeeping. Trimmed the root `README.md`. Added an empty file named
`Community`.

**Why:** Minor. The `Community` file has no content and no purpose - a stray add.
It is a candidate for deletion (noted in file 13).

---

## 2026-08-11 - `96b9462` "Built respective Components"

**What:** `Announcements.tsx`, `EventList.tsx`, `EventCalendar.tsx` (a thin wrapper over
`react-calendar`). Added the react-calendar visual overrides to `globals.css`
(`.react-calendar__tile--active` etc. with `!important`). `admin/page.tsx` right-hand
column assembled: calendar, event list, announcements.

**Why:** Complete the admin dashboard's right rail.

**Concepts introduced:** wrapping a third-party widget, styling a library's own CSS
classes from `globals.css` because you can't reach them with `className`.

---

## 2026-08-11 - `3170442` merge `main`

Merge commit, no content of its own.

---

## 2026-08-15 - `9fac9ef` "Student Dashboard and teacher Table"

**What:** The reusable list toolkit:
- `Table.tsx` - generic table. Takes `columns` and a `renderRow(item)` function.
- `TableSearch.tsx` - styled search input (no logic yet).
- `Pagination.tsx` - static page buttons (no logic yet).
- `BigCalendar.tsx` - a hand-built weekly timetable with day tabs (NOT a library).
- First real list screen: `list/teachers/page.tsx`.
- `next.config.mjs` gained `images.remotePatterns` for `images.pexels.com` so `<Image>`
  can load the fake avatar photos.

**Why:** Thirteen list screens are coming. Build the table, search, and pagination once
and pass data in.

**Concepts introduced:** the render-prop pattern (`renderRow`), generic reusable
components, remote image allowlisting, `useState` for the calendar's active day.

---

## 2026-08-15 - `04148ae` "Frontend Completed"

**What:** Everything else on the frontend:
- List pages for parents, subjects, classes, lessons, exams, assignments, results,
  attendance, events, messages, announcements (plus students). All follow the
  `list/teachers/page.tsx` shape: local `columns`, local row `type`, `renderRow`,
  `<Table>` + `<Pagination>`, `role` gate on the add/delete buttons.
- Detail pages `list/teachers/[id]/page.tsx` and `list/students/[id]/page.tsx`
  (profile card + stat cards + `BigCalendar` + shortcuts + `Performance` + announcements).
  Content is hardcoded; the `[id]` param is not read yet.
- `profile/page.tsx`, `settings/page.tsx` - static.
- The form system: `FormModal.tsx` (button + overlay + `dynamic()` imported forms),
  `forms/TeacherForm.tsx`, `forms/StudentForm.tsx`, `InputField.tsx`.
- `Performance.tsx` - recharts half-donut Pie.
- Added `react-hook-form`, `zod`, `@hookform/resolvers`, `react-toastify`.

**Why:** Finish the entire UI against fake data so the backend can be slotted in behind
unchanged screens.

**Concepts introduced:** dynamic segments `[id]`, `react-hook-form` + `zod` +
`zodResolver`, `z.infer<typeof schema>`, `next/dynamic` for code-splitting, controlled
vs uncontrolled inputs.

---

## 2026-08-30 - `6e2a7f8` "Prisma Setup"  (branch: `backend`)

**What:** Output of `prisma orm init` (Prisma ORM for Postgres, v8 release candidate):
- `src/prisma/contract.prisma` - the data models. **Still the starter sample** (`User`,
  `Post`), not the school domain.
- `src/prisma/contract.json` + `src/prisma/contract.d.ts` - generated from the contract.
  `contract.json` is committed like a lockfile; `contract.d.ts` powers autocomplete.
- `src/prisma/db.ts` - the client:
  `postgres<Contract>({ contractJson, url: process.env['DATABASE_URL']! })`.
- `prisma.config.ts` - points the CLI at the contract and the connection string.
- `.env.example` - `DATABASE_URL="postgresql://user:password@localhost:5432/mydb"`.
- `prisma-next.md` - the official quickstart, kept in the repo for reference.
- `package.json` scripts: `postinstall: prisma skills sync || exit 0`,
  `contract:emit: prisma contract emit`.
- `.gitignore` now excludes `.claude/ .agents/ .cursor/ .devin/` (AI tool skill folders).
- `tsconfig.json` tweaked (`module: preserve`, `resolveJsonModule`, JSON import support).

**Why:** Begin the backend. `orm init` gives you a working client and a place to declare
your schema.

**State after this commit:** Database layer exists but is inert. No real schema, no
running Postgres, no screen reads from `db`. This is exactly where the project sits now.

**Concepts introduced:** Prisma Next's "contract" model (see file 11), `contract emit`,
`db init`, ESM config files, `process.env[...]!` non-null assertion.

---

## 2026-08-30 - `3bbdb0f` "Prisma Schema File"  (branch: `backend`)

**What:** Committed the `learning-logs/` folder (files 01-14). Deleted
`src/prisma/contract.prisma`. Added `src/prisma/schema.prisma` - the real school data
model: 15 models (`Admin`, `Student`, `Teacher`, `Parent`, `Grade`, `Class`, `Subject`,
`Lesson`, `Exam`, `Assignment`, `Result`, `Attendance`, `Event`, `Announcement`) and 2
enums (`UserSex`, `Day`). Written in **classic Prisma** syntax (`generator client`
`prisma-client-js` + `datasource db` postgresql), matching the Lama Dev tutorial rather
than the Prisma Next contract style set up in `6e2a7f8`.

**Why:** Replace the placeholder `User`/`Post` sample with the actual domain so the
backend can be built.

**State after:** `schema.prisma` is complete and correct, but it does not match the rest
of `src/prisma/` - `db.ts` is still the Prisma Next client, `contract.json`/`contract.d.ts`
are stale, and `prisma.config.ts` points at the now-deleted `contract.prisma`. No client
generated, no Postgres running, no migrations, no screen using it.

**Concepts introduced:** classic Prisma `generator`/`datasource` blocks, `@id` without
`@default` (id supplied by the app / auth provider), implicit many-to-many
(`Teacher.subjects` <-> `Subject.teachers`), nullable vs required relations, the
`Lesson` model as the hub for `Exam`/`Assignment`/`Attendance`, `Result` linked to
exam-or-assignment with no DB-level "exactly one" guarantee. Full detail in
`15-prisma-schema.md`.

---

## Next entry goes here

Template:

```
## YYYY-MM-DD - <commit hash> "<message>"

**What:**
**Why:**
**Unlocked / State after:**
**Concepts introduced:**
```
