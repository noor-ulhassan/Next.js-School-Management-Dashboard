# 10 - Mock Data and the Role System

File: `src/lib/data.ts`. It has existed since the first commit (`dd2cf85`, 2026-08-08).

## What it is

One module that `export`s a plain constant array for every entity, plus a `role` string.
No database, no types beyond what TypeScript infers from the literals.

```ts
export let role = "admin";

export const teachersData = [ { id: 1, teacherId: "1234567890", name: "John Doe",
  email: "john@doe.com", photo: "https://images.pexels.com/...", phone: "1234567890",
  subjects: ["Math", "Geometry"], classes: ["1B", "2A", "3C"], address: "..." }, ... ];

export const studentsData    = [ { id, studentId, name, email, photo, phone, grade, class, address }, ... ];
export const parentsData     = [ { id, name, students: string[], email, phone, address }, ... ];
export const subjectsData    = [ { id, name, teachers: string[] }, ... ];
export const classesData     = [ { id, name, capacity, grade, supervisor }, ... ];
export const lessonsData     = [ { id, subject, class, teacher }, ... ];
export const examsData       = [ { id, subject, class, teacher, date }, ... ];
export const assignmentsData = [ { id, subject, class, teacher, dueDate }, ... ];
export const resultsData     = [ { id, subject, class, teacher, student, date, type, score }, ... ];
export const eventsData      = [ { id, title, class, date, startTime, endTime }, ... ];
export const announcementsData = [ { id, title, class, date }, ... ];
export const attendanceData  = [ { id, student, class, date, present }, ... ];
export const messagesData    = [ { id, sender, subject, date, read }, ... ];
export const calendarEvents  = [ { title, allDay, start: Date, end: Date }, ... ];
```

Each list page imports the one array it needs and passes it to `<Table>`. Relationships
are just strings (`teacher: "Tommy Wise"`, `classes: ["1B","2A"]`) - there are no real
foreign keys.

## Why it exists

To build and style the entire frontend without a backend. The shapes are close enough to
the eventual database rows that pages can later swap `import { teachersData }` for an
`await db...` call without restructuring.

## The `role` "system"

```ts
export let role = "admin";
```

This single line is the whole authorization model right now.

- List pages do `import { role } from "@/lib/data"` and gate controls with
  `{role === "admin" && <FormModal .../>}`.
- It is `let`, so it could be reassigned, but nothing ever reassigns it. Change the
  string by hand to preview a different role's view.
- `Menu.tsx` has `visible: ["admin", "teacher", ...]` on each nav item - the intended
  per-role navigation - but the render never checks `role`, so every link always shows.

## Known data problems (fix before seeding a real DB)

| Problem | Where |
|---------|-------|
| Two rows with `id: 5` | `classesData` (the "5B" row reuses id 5) |
| Many parents share `email: "mike@geller.com"` | `parentsData` rows 3-10 |
| Calendar events dated August **2024** | `calendarEvents` uses `new Date(2024, 7, ...)`; the file's own comment says to change them. This is why `BigCalendar`/`EventCalendar` look empty for the current date. |
| One `calendarEvents` entry ends the day before it starts | last "History" item: `start` day 14, `end` day 13 |
| No shared types | each list page re-declares its own `type Teacher`/`type Student`/... that can drift from the actual object shape |

## How this gets replaced (see file 11 and file 13)

1. Write real models in `src/prisma/contract.prisma` (with proper relations and enums).
2. Write a seed script that inserts the contents of these arrays into Postgres once.
3. Per screen, replace `import { xData } from "@/lib/data"` with
   `const xData = await db.orm.public.X.<query>()` inside the (now `async`) Server
   Component.
4. Replace `role` with the real role from the authenticated session; then enforce
   `Menu`'s `visible` arrays and the route-level guards.
5. Delete `src/lib/data.ts` when nothing imports it. Keep `calendarEvents` shape in mind
   for the timetable feature.
