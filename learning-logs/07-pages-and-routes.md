# 07 - Pages and Routes

Every URL the app serves, the file that renders it, what it shows, where its data comes
from, and what is unfinished.

## Outside the dashboard shell

| URL | File | Renders | State |
|-----|------|---------|-------|
| `/` | `src/app/page.tsx` | the literal text "Homepage" | placeholder |
| `/sign-In` | `src/app/sign-In/page.tsx` | the literal text "loginPage" | placeholder; note the capital `I` in the folder name |

Neither is built. `/` should eventually redirect a logged-in user to their role home;
`/sign-In` should become the real login (file 13).

## The dashboard shell

`src/app/(dashboard)/layout.tsx` wraps everything below. It renders, on every one of
these routes:

- left column (14-16% wide, responsive): logo + `<Menu/>`
- right column: `<Navbar/>` then the page's own content

The layout stays mounted while you navigate between the routes below - only the content
area re-renders.

## Role home pages

| URL | File | What it shows |
|-----|------|---------------|
| `/admin` | `(dashboard)/admin/page.tsx` | Left: 4 `UserCard`s (student/teacher/parent/staff), then `CountChart` + `AttendanceChart` side by side, then `FinanceChart`. Right: `EventCalendar`, `EventList`, `Announcements`. This is the densest screen. |
| `/teacher` | `(dashboard)/teacher/page.tsx` | Left: `BigCalendar` ("Schedule"). Right: `EventCalendar`, `Announcements`. |
| `/student` | `(dashboard)/student/page.tsx` | Same as teacher, heading "Schedule (4A)". |
| `/parent` | `(dashboard)/parent/page.tsx` | Same as teacher, heading "Schedule (John Doe)". |

The three non-admin pages are almost identical - only the heading text differs today.
They will diverge once each pulls its own data.

## List pages

Thirteen routes, all the same shape:

`/list/teachers`, `/list/students`, `/list/parents`, `/list/subjects`, `/list/classes`,
`/list/lessons`, `/list/exams`, `/list/assignments`, `/list/results`,
`/list/attendance`, `/list/events`, `/list/messages`, `/list/announcements`

Each file (`(dashboard)/list/<entity>/page.tsx`):

1. imports its data array and `role` from `@/lib/data`,
2. declares a local `type` for the row (e.g. `type Teacher = {...}`),
3. declares a local `columns` array (`{ header, accessor, className? }`),
4. defines `renderRow(item)` returning a `<tr>`,
5. returns: a header row (title + `TableSearch` + filter/sort buttons + an
   admin-only add button/`FormModal`) then `<Table columns renderRow data />` then
   `<Pagination />`.

Data source: the matching `xData` const in `src/lib/data.ts`. The add and delete
controls are gated by `role === "admin"`.

`teachers` and `students` rows have a working "view" link to their `[id]` page and use
`<FormModal>` for delete. The other eleven use plain `<Image>` buttons that do nothing.

**Unfinished on all of them:** search, filter, sort, and pagination are visual only; no
real create/update/delete.

## Detail pages (dynamic route)

| URL pattern | File | What it shows |
|-------------|------|---------------|
| `/list/teachers/[id]` | `(dashboard)/list/teachers/[id]/page.tsx` | profile card (photo, blood type, join date, email, phone) + 4 stat cards (attendance, branches, lessons, classes) + `BigCalendar` + a "Shortcuts" link grid + `Performance` + `Announcements` |
| `/list/students/[id]` | `(dashboard)/list/students/[id]/page.tsx` | same layout; stat cards are attendance, grade, lessons, class |

**Unfinished:** the `[id]` param is never read. Names ("Leonard Snyder", "Cameron
Moran"), photos, and every stat are hardcoded. Shortcut links all point to `/`.

## Static account pages

| URL | File | What it shows |
|-----|------|---------------|
| `/profile` | `(dashboard)/profile/page.tsx` | avatar + name + bio card, then an "Account Details" grid (email, phone, address, role). All hardcoded. |
| `/settings` | `(dashboard)/settings/page.tsx` | toggles for email/push notifications and dark mode (uncontrolled checkboxes, no effect), and a "Change Password" button (no handler). |

## Route tree at a glance

```
/                         placeholder
/sign-In                  placeholder
(dashboard) [shell: Menu + Navbar]
  /admin                  full dashboard
  /teacher /student /parent   schedule dashboards
  /profile /settings      static
  /list
    /teachers  /teachers/[id]
    /students  /students/[id]
    /parents /subjects /classes /lessons /exams /assignments
    /results /attendance /events /messages /announcements
```

## Server vs client on these pages

Every `page.tsx` here is a **Server Component** (no `"use client"`). They render on the
server. They currently import synchronous arrays, so they aren't `async` - but they are
already in the right place to become `async` and `await db...` with no structural change.
The interactive bits (`FormModal`, charts, calendars) are client components dropped into
these server pages.
